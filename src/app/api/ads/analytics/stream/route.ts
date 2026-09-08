import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const ads = await prisma.ad.findMany({
            include: {
              impressions: {
                where: {
                  timestamp: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                  },
                },
              },
              views: {
                where: {
                  viewedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                  },
                },
              },
              clicks: {
                where: {
                  clickedAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
                  },
                },
              },
            },
          });
// change type here
          const analytics = ads.map((ad: { impressions: string | any[]; views: string | any[]; clicks: string | any[]; id: any; name: any; }) => {
            const impressions = ad.impressions.length;
            const views = ad.views.length;
            const clicks = ad.clicks.length;
            const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
            const viewability = impressions > 0 ? (views / impressions) * 100 : 0;

            return {
              adId: ad.id,
              adName: ad.name,
              metrics: {
                impressions,
                views,
                clicks,
                ctr: parseFloat(ctr.toFixed(2)),
                viewability: parseFloat(viewability.toFixed(2)),
              },
            };
          });

          const data = `data: ${JSON.stringify(analytics)}\n\n`;
          controller.enqueue(encoder.encode(data));
        } catch (error) {
          console.error('Error in SSE:', error);
        }
      };

      // Send initial data
      await sendUpdate();

      // Send updates every 5 seconds
      const interval = setInterval(sendUpdate, 5000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}