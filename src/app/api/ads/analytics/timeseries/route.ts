import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adId = searchParams.get('adId');
    const days = parseInt(searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const filter: any = {
      timestamp: { gte: startDate },
    };
    
    if (adId) {
      filter.adId = adId;
    }

    // Get impressions by day
    const impressions = await prisma.adImpression.groupBy({
      by: ['adId'],
      where: filter,
      _count: true,
    });

    // Get views by day
    const views = await prisma.adView.groupBy({
      by: ['adId'],
      where: {
        ...filter,
        viewedAt: filter.timestamp,
      },
      _count: true,
    });

    // Get clicks by day
    const clicks = await prisma.adClick.groupBy({
      by: ['adId'],
      where: {
        ...filter,
        clickedAt: filter.timestamp,
      },
      _count: true,
    });

    // Create time series data
    const timeSeriesData = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      // Get counts for this day
      const dayImpressions = await prisma.adImpression.count({
        where: {
          ...filter,
          timestamp: { gte: dayStart, lte: dayEnd },
        },
      });

      const dayViews = await prisma.adView.count({
        where: {
          adId: adId || undefined,
          viewedAt: { gte: dayStart, lte: dayEnd },
        },
      });

      const dayClicks = await prisma.adClick.count({
        where: {
          adId: adId || undefined,
          clickedAt: { gte: dayStart, lte: dayEnd },
        },
      });

      timeSeriesData.push({
        date: date.toISOString().split('T')[0],
        impressions: dayImpressions,
        views: dayViews,
        clicks: dayClicks,
        ctr: dayImpressions > 0 ? (dayClicks / dayImpressions) * 100 : 0,
      });
    }

    return NextResponse.json({ timeSeries: timeSeriesData });
  } catch (error) {
    console.error('Error fetching time series:', error);
    return NextResponse.json(
      { error: 'Failed to fetch time series data' },
      { status: 500 }
    );
  }
}