import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Define types for our data structures
interface AdWithRelations {
  id: string;
  name: string;
  placement: string;
  isActive: boolean;
  impressions: Array<{ sessionId: string }>;
  views: Array<{ sessionId: string; viewDuration: number | null }>;
  clicks: Array<{ sessionId: string }>;
}

interface AdMetrics {
  impressions: number;
  views: number;
  clicks: number;
  uniqueVisitors: number;
  ctr: number;
  viewability: number;
  clickThroughRate: number;
  avgViewDuration: number;
  engagementRate: number;
}

interface AdAnalytics {
  adId: string;
  adName: string;
  placement: string;
  isActive: boolean;
  metrics: AdMetrics;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adId = searchParams.get('adId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate);
    }

    const filter: { adId?: string; timestamp?: { gte?: Date; lte?: Date } } = {};
    if (adId) {
      filter.adId = adId;
    }
    if (Object.keys(dateFilter).length > 0) {
      filter.timestamp = dateFilter;
    }

    // Get all ads with their metrics
    const ads = await prisma.ad.findMany({
      where: adId ? { id: adId } : {},
      include: {
        impressions: {
          where: Object.keys(dateFilter).length > 0 ? { timestamp: dateFilter } : {},
        },
        views: {
          where: Object.keys(dateFilter).length > 0 ? { viewedAt: dateFilter } : {},
        },
        clicks: {
          where: Object.keys(dateFilter).length > 0 ? { clickedAt: dateFilter } : {},
        },
      },
    });

    // Calculate metrics for each ad
    const analytics: AdAnalytics[] = ads.map((ad: AdWithRelations) => {
      const impressions = ad.impressions.length;
      const views = ad.views.length;
      const clicks = ad.clicks.length;
      
      // Get unique sessions
      const uniqueSessions = new Set([
        ...ad.impressions.map((i: { sessionId: string }) => i.sessionId),
        ...ad.views.map((v: { sessionId: string }) => v.sessionId),
        ...ad.clicks.map((c: { sessionId: string }) => c.sessionId),
      ]).size;

      // Calculate metrics
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const viewability = impressions > 0 ? (views / impressions) * 100 : 0;
      const clickThroughRate = views > 0 ? (clicks / views) * 100 : 0;
      
      // Average view duration
      const totalViewDuration = ad.views.reduce(
        (sum: number, v: { viewDuration: number | null }) => sum + (v.viewDuration || 0), 
        0
      );
      const avgViewDuration = views > 0 ? totalViewDuration / views / 1000 : 0; // in seconds

      // Engagement rate
      const engagementRate = impressions > 0 ? ((views + clicks) / impressions) * 100 : 0;

      return {
        adId: ad.id,
        adName: ad.name,
        placement: ad.placement,
        isActive: ad.isActive,
        metrics: {
          impressions,
          views,
          clicks,
          uniqueVisitors: uniqueSessions,
          ctr: parseFloat(ctr.toFixed(2)),
          viewability: parseFloat(viewability.toFixed(2)),
          clickThroughRate: parseFloat(clickThroughRate.toFixed(2)),
          avgViewDuration: parseFloat(avgViewDuration.toFixed(2)),
          engagementRate: parseFloat(engagementRate.toFixed(2)),
        },
      };
    });

    // Calculate overall metrics
    const overallMetrics = {
      totalImpressions: analytics.reduce((sum: number, a: AdAnalytics) => sum + a.metrics.impressions, 0),
      totalViews: analytics.reduce((sum: number, a: AdAnalytics) => sum + a.metrics.views, 0),
      totalClicks: analytics.reduce((sum: number, a: AdAnalytics) => sum + a.metrics.clicks, 0),
      avgCTR: analytics.length > 0 
        ? parseFloat((analytics.reduce((sum: number, a: AdAnalytics) => sum + a.metrics.ctr, 0) / analytics.length).toFixed(2))
        : 0,
      avgViewability: analytics.length > 0
        ? parseFloat((analytics.reduce((sum: number, a: AdAnalytics) => sum + a.metrics.viewability, 0) / analytics.length).toFixed(2))
        : 0,
    };

    return NextResponse.json({ analytics, overallMetrics });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}