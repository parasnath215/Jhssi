// 'use client';

// import { useEffect, useState } from 'react';
// import { Line, Bar } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler
// );

// interface AdAnalytics {
//   adId: string;
//   adName: string;
//   placement: string;
//   isActive: boolean;
//   metrics: {
//     impressions: number;
//     views: number;
//     clicks: number;
//     uniqueVisitors: number;
//     ctr: number;
//     viewability: number;
//     clickThroughRate: number;
//     avgViewDuration: number;
//     engagementRate: number;
//   };
// }

// interface TimeSeriesData {
//   date: string;
//   impressions: number;
//   views: number;
//   clicks: number;
//   ctr: number;
// }

// export default function Analytics() {
//   const [analytics, setAnalytics] = useState<AdAnalytics[]>([]);
//   const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
//   const [selectedAdId, setSelectedAdId] = useState<string>('');
//   const [timeRange, setTimeRange] = useState<number>(7);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchAnalytics();
//     fetchTimeSeries();
//     const interval = setInterval(() => {
//       fetchAnalytics();
//       fetchTimeSeries();
//     }, 30000); // Refresh every 30 seconds
//     return () => clearInterval(interval);
//   }, [selectedAdId, timeRange]);

//   const fetchAnalytics = async () => {
//     try {
//       const url = selectedAdId 
//         ? `/api/ads/analytics?adId=${selectedAdId}`
//         : '/api/ads/analytics';
//       const response = await fetch(url);
//       const data = await response.json();
//       setAnalytics(data.analytics || []);
//     } catch (error) {
//       console.error('Error fetching analytics:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTimeSeries = async () => {
//     try {
//       const url = selectedAdId
//         ? `/api/ads/analytics/timeseries?adId=${selectedAdId}&days=${timeRange}`
//         : `/api/ads/analytics/timeseries?days=${timeRange}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setTimeSeries(data.timeSeries || []);
//     } catch (error) {
//       console.error('Error fetching time series:', error);
//     }
//   };

//   const lineChartData = {
//     labels: timeSeries.map(d => d.date),
//     datasets: [
//       {
//         label: 'Impressions',
//         data: timeSeries.map(d => d.impressions),
//         borderColor: 'rgb(59, 130, 246)',
//         backgroundColor: 'rgba(59, 130, 246, 0.1)',
//         fill: true,
//         tension: 0.4,
//       },
//       {
//         label: 'Views',
//         data: timeSeries.map(d => d.views),
//         borderColor: 'rgb(34, 197, 94)',
//         backgroundColor: 'rgba(34, 197, 94, 0.1)',
//         fill: true,
//         tension: 0.4,
//       },
//       {
//         label: 'Clicks',
//         data: timeSeries.map(d => d.clicks),
//         borderColor: 'rgb(168, 85, 247)',
//         backgroundColor: 'rgba(168, 85, 247, 0.1)',
//         fill: true,
//         tension: 0.4,
//       },
//     ],
//   };

//   const barChartData = {
//     labels: analytics.map(a => a.adName),
//     datasets: [
//       {
//         label: 'CTR (%)',
//         data: analytics.map(a => a.metrics.ctr),
//         backgroundColor: 'rgba(59, 130, 246, 0.8)',
//       },
//       {
//         label: 'Viewability (%)',
//         data: analytics.map(a => a.metrics.viewability),
//         backgroundColor: 'rgba(34, 197, 94, 0.8)',
//       },
//       {
//         label: 'Engagement (%)',
//         data: analytics.map(a => a.metrics.engagementRate),
//         backgroundColor: 'rgba(168, 85, 247, 0.8)',
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top' as const,
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
//         <p className="text-gray-600 mt-2">Detailed performance metrics and insights</p>
//       </div>

//       <div className="flex gap-4 mb-6">
//         <select
//           value={selectedAdId}
//           onChange={(e) => setSelectedAdId(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="">All Ads</option>
//           {analytics.map((ad) => (
//             <option key={ad.adId} value={ad.adId}>
//               {ad.adName}
//             </option>
//           ))}
//         </select>

//         <select
//           value={timeRange}
//           onChange={(e) => setTimeRange(Number(e.target.value))}
//           className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="7">Last 7 days</option>
//           <option value="14">Last 14 days</option>
//           <option value="30">Last 30 days</option>
//           <option value="90">Last 90 days</option>
//         </select>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Over Time</h3>
//           <div style={{ height: '300px' }}>
//             <Line data={lineChartData} options={chartOptions} />
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Performance Comparison</h3>
//           <div style={{ height: '300px' }}>
//             <Bar data={barChartData} options={chartOptions} />
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="px-6 py-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">Detailed Metrics</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Ad Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Placement
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Impressions
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Views
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Clicks
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   CTR
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Viewability
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Avg Duration
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {analytics.map((ad) => (
//                 <tr key={ad.adId} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {ad.adName}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {ad.placement}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
//                     {ad.metrics.impressions.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
//                     {ad.metrics.views.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
//                     {ad.metrics.clicks.toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
//                     {ad.metrics.ctr}%
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
//                     {ad.metrics.viewability}%
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
//                     {ad.metrics.avgViewDuration}s
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { motion } from 'framer-motion';
import { TrendingUp, Eye, MousePointer, Calendar } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AdAnalytics {
  adId: string;
  adName: string;
  placement: string;
  isActive: boolean;
  metrics: {
    impressions: number;
    views: number;
    clicks: number;
    uniqueVisitors: number;
    ctr: number;
    viewability: number;
    clickThroughRate: number;
    avgViewDuration: number;
    engagementRate: number;
  };
}

interface TimeSeriesData {
  date: string;
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AdAnalytics[]>([]);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [selectedAdId, setSelectedAdId] = useState<string>('');
  const [timeRange, setTimeRange] = useState<number>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchTimeSeries();
    const interval = setInterval(() => {
      fetchAnalytics();
      fetchTimeSeries();
    }, 30000);
    return () => clearInterval(interval);
  }, [selectedAdId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      const url = selectedAdId 
        ? `/api/ads/analytics?adId=${selectedAdId}`
        : '/api/ads/analytics';
      const response = await fetch(url);
      const data = await response.json();
      setAnalytics(data.analytics || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSeries = async () => {
    try {
      const url = selectedAdId
        ? `/api/ads/analytics/timeseries?adId=${selectedAdId}&days=${timeRange}`
        : `/api/ads/analytics/timeseries?days=${timeRange}`;
      const response = await fetch(url);
      const data = await response.json();
      setTimeSeries(data.timeSeries || []);
    } catch (error) {
      console.error('Error fetching time series:', error);
    }
  };

  const lineChartData = {
    labels: timeSeries.map(d => d.date),
    datasets: [
      {
        label: 'Impressions',
        data: timeSeries.map(d => d.impressions),
        borderColor: '#6B4A2E',
        backgroundColor: 'rgba(107, 74, 46, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Views',
        data: timeSeries.map(d => d.views),
        borderColor: '#C8A45D',
        backgroundColor: 'rgba(200, 164, 93, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Clicks',
        data: timeSeries.map(d => d.clicks),
        borderColor: '#3F2A1D',
        backgroundColor: 'rgba(63, 42, 29, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: analytics.map(a => a.adName.length > 15 ? a.adName.substring(0, 15) + '...' : a.adName),
    datasets: [
      {
        label: 'CTR (%)',
        data: analytics.map(a => a.metrics.ctr),
        backgroundColor: 'rgba(107, 74, 46, 0.8)',
      },
      {
        label: 'Viewability (%)',
        data: analytics.map(a => a.metrics.viewability),
        backgroundColor: 'rgba(200, 164, 93, 0.8)',
      },
      {
        label: 'Engagement (%)',
        data: analytics.map(a => a.metrics.engagementRate),
        backgroundColor: 'rgba(63, 42, 29, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#6B4A2E',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#E6DDCF',
        },
        ticks: {
          color: '#6B4A2E',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B4A2E',
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#C8A45D] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="font-serif text-3xl text-[#3F2A1D] mb-2">Analytics</h2>
        <div className="h-px w-20 bg-[#C8A45D] mb-4"></div>
        <p className="text-[#4A4036]">Detailed performance metrics and insights</p>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-4 mb-6 border border-[#E6DDCF]"
      >
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[#6B4A2E] mb-1">Select Ad</label>
            <select
              value={selectedAdId}
              onChange={(e) => setSelectedAdId(e.target.value)}
              className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
            >
              <option value="">All Ads</option>
              {analytics.map((ad) => (
                <option key={ad.adId} value={ad.adId}>
                  {ad.adName}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-medium text-[#6B4A2E] mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(Number(e.target.value))}
              className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="14">Last 14 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-[#E6DDCF]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-[#3F2A1D]">Performance Over Time</h3>
            <TrendingUp className="w-5 h-5 text-[#C8A45D]" />
          </div>
          <div style={{ height: '300px' }}>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-[#E6DDCF]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-[#3F2A1D]">Ad Performance Comparison</h3>
            <Eye className="w-5 h-5 text-[#C8A45D]" />
          </div>
          <div style={{ height: '300px' }}>
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </motion.div>
      </div>

      {/* Detailed Metrics Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#E6DDCF]"
      >
        <div className="px-6 py-4 border-b border-[#E6DDCF] bg-[#F6F1E8]">
          <h3 className="font-serif text-lg text-[#3F2A1D]">Detailed Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6F1E8]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  Ad Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  Placement
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  Viewability
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#6B4A2E] uppercase tracking-wider">
                  Avg Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E6DDCF]">
              {analytics.map((ad) => (
                <tr key={ad.adId} className="hover:bg-[#F6F1E8] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#3F2A1D]">
                    {ad.adName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B4A2E] capitalize">
                    {ad.placement}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#3F2A1D]">
                    {ad.metrics.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#3F2A1D]">
                    {ad.metrics.views.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#3F2A1D]">
                    {ad.metrics.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-[#C8A45D]">
                    {ad.metrics.ctr}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#3F2A1D]">
                    {ad.metrics.viewability}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-[#3F2A1D]">
                    {ad.metrics.avgViewDuration}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}