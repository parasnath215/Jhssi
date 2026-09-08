'use client';

import { useEffect, useState, useRef } from 'react';
import { Activity } from 'lucide-react';

interface RealTimeMetric {
  adId: string;
  adName: string;
  metrics: {
    impressions: number;
    views: number;
    clicks: number;
    ctr: number;
    viewability: number;
  };
}

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Connect to SSE endpoint
    eventSourceRef.current = new EventSource('/api/ads/analytics/stream');

    eventSourceRef.current.onopen = () => {
      setIsConnected(true);
    };

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMetrics(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSourceRef.current.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Real-time Metrics</h2>
          <p className="text-gray-600 mt-2">Live advertising performance (Last 24 hours)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {metrics.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Waiting for real-time data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {metrics.map((metric) => (
            <div key={metric.adId} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{metric.adName}</h3>
                  <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs text-gray-500">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-blue-600 font-medium mb-1">Impressions</div>
                  <div className="text-2xl font-bold text-blue-900">
                    {metric.metrics.impressions.toLocaleString()}
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-green-600 font-medium mb-1">Views</div>
                  <div className="text-2xl font-bold text-green-900">
                    {metric.metrics.views.toLocaleString()}
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-sm text-purple-600 font-medium mb-1">Clicks</div>
                  <div className="text-2xl font-bold text-purple-900">
                    {metric.metrics.clicks.toLocaleString()}
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-orange-600 font-medium mb-1">CTR</div>
                  <div className="text-2xl font-bold text-orange-900">
                    {metric.metrics.ctr}%
                  </div>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="text-sm text-indigo-600 font-medium mb-1">Viewability</div>
                  <div className="text-2xl font-bold text-indigo-900">
                    {metric.metrics.viewability}%
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Click-through Rate</span>
                    <span className="font-semibold text-gray-900">{metric.metrics.ctr}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(metric.metrics.ctr, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Viewability Rate</span>
                    <span className="font-semibold text-gray-900">{metric.metrics.viewability}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(metric.metrics.viewability, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}