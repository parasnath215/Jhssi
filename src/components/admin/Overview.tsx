// 'use client';

// import { useEffect, useState } from 'react';
// import { Eye, MousePointer, TrendingUp, Users } from 'lucide-react';
// import MetricCard from './MetricCard';

// interface OverallMetrics {
//   totalImpressions: number;
//   totalViews: number;
//   totalClicks: number;
//   avgCTR: number;
//   avgViewability: number;
// }

// export default function Overview() {
//   const [metrics, setMetrics] = useState<OverallMetrics | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchMetrics();
//     const interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const fetchMetrics = async () => {
//     try {
//       const response = await fetch('/api/ads/analytics');
//       const data = await response.json();
//       setMetrics(data.overallMetrics);
//     } catch (error) {
//       console.error('Error fetching metrics:', error);
//     } finally {
//       setLoading(false);
//     }
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
//         <h2 className="text-3xl font-bold text-gray-900">Dashboard Overview</h2>
//         <p className="text-gray-600 mt-2">Real-time advertising metrics and performance</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <MetricCard
//           title="Total Impressions"
//           value={metrics?.totalImpressions.toLocaleString() || '0'}
//           icon={Eye}
//           color="blue"
//         />
//         <MetricCard
//           title="Total Views"
//           value={metrics?.totalViews.toLocaleString() || '0'}
//           icon={Users}
//           color="green"
//         />
//         <MetricCard
//           title="Total Clicks"
//           value={metrics?.totalClicks.toLocaleString() || '0'}
//           icon={MousePointer}
//           color="purple"
//         />
//         <MetricCard
//           title="Avg CTR"
//           value={`${metrics?.avgCTR.toFixed(2) || '0'}%`}
//           icon={TrendingUp}
//           color="orange"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm text-gray-600">Click-Through Rate</span>
//                 <span className="text-sm font-semibold text-gray-900">
//                   {metrics?.avgCTR.toFixed(2)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-blue-600 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${Math.min(metrics?.avgCTR || 0, 100)}%` }}
//                 ></div>
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-sm text-gray-600">Viewability Rate</span>
//                 <span className="text-sm font-semibold text-gray-900">
//                   {metrics?.avgViewability.toFixed(2)}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-green-600 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${Math.min(metrics?.avgViewability || 0, 100)}%` }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
//           <div className="space-y-3">
//             <div className="flex justify-between items-center py-2 border-b border-gray-100">
//               <span className="text-gray-600">Impressions</span>
//               <span className="font-semibold text-gray-900">
//                 {metrics?.totalImpressions.toLocaleString()}
//               </span>
//             </div>
//             <div className="flex justify-between items-center py-2 border-b border-gray-100">
//               <span className="text-gray-600">Views</span>
//               <span className="font-semibold text-gray-900">
//                 {metrics?.totalViews.toLocaleString()}
//               </span>
//             </div>
//             <div className="flex justify-between items-center py-2">
//               <span className="text-gray-600">Clicks</span>
//               <span className="font-semibold text-gray-900">
//                 {metrics?.totalClicks.toLocaleString()}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Eye, MousePointer, TrendingUp, Users, Activity, Target } from 'lucide-react';
import MetricCard from './MetricCard';
import { motion } from 'framer-motion';

interface OverallMetrics {
  totalImpressions: number;
  totalViews: number;
  totalClicks: number;
  avgCTR: number;
  avgViewability: number;
}

export default function Overview() {
  const [metrics, setMetrics] = useState<OverallMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/ads/analytics');
      const data = await response.json();
      setMetrics(data.overallMetrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
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
        <h2 className="font-serif text-3xl text-[#3F2A1D] mb-2">Dashboard Overview</h2>
        <div className="h-px w-20 bg-[#C8A45D] mb-4"></div>
        <p className="text-[#4A4036]">Real-time advertising metrics and performance</p>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Impressions"
          value={metrics?.totalImpressions.toLocaleString() || '0'}
          icon={Eye}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Total Views"
          value={metrics?.totalViews.toLocaleString() || '0'}
          icon={Users}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Total Clicks"
          value={metrics?.totalClicks.toLocaleString() || '0'}
          icon={MousePointer}
          color="purple"
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Avg CTR"
          value={`${metrics?.avgCTR.toFixed(2) || '0'}%`}
          icon={TrendingUp}
          color="orange"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      {/* Charts and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-[#E6DDCF]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-[#3F2A1D]">Performance Metrics</h3>
            <Activity className="w-5 h-5 text-[#C8A45D]" />
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#6B4A2E]">Click-Through Rate</span>
                <span className="text-sm font-semibold text-[#3F2A1D]">
                  {metrics?.avgCTR.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-[#F6F1E8] rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(metrics?.avgCTR || 0, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-[#6B4A2E] to-[#3F2A1D] h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-[#6B4A2E]">Viewability Rate</span>
                <span className="text-sm font-semibold text-[#3F2A1D]">
                  {metrics?.avgViewability.toFixed(2)}%
                </span>
              </div>
              <div className="w-full bg-[#F6F1E8] rounded-full h-2.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(metrics?.avgViewability || 0, 100)}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="bg-gradient-to-r from-[#C8A45D] to-[#6B4A2E] h-2.5 rounded-full"
                ></motion.div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E6DDCF]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#6B4A2E]">Engagement Score</span>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#C8A45D]" />
                <span className="font-semibold text-[#3F2A1D]">Good</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-[#E6DDCF]"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-serif text-xl text-[#3F2A1D]">Quick Stats</h3>
            <div className="p-2 bg-[#F6F1E8] rounded-lg">
              <TrendingUp className="w-4 h-4 text-[#C8A45D]" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#E6DDCF]">
              <span className="text-[#6B4A2E]">Total Impressions</span>
              <span className="font-semibold text-[#3F2A1D] text-lg">
                {metrics?.totalImpressions.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#E6DDCF]">
              <span className="text-[#6B4A2E]">Unique Views</span>
              <span className="font-semibold text-[#3F2A1D] text-lg">
                {metrics?.totalViews.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-[#6B4A2E]">Total Clicks</span>
              <span className="font-semibold text-[#3F2A1D] text-lg">
                {metrics?.totalClicks.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-[#F6F1E8] rounded-lg p-3 text-center">
              <p className="text-xs text-[#6B4A2E]/60 mb-1">Conversion Rate</p>
              <p className="text-lg font-bold text-[#3F2A1D]">2.4%</p>
            </div>
            <div className="bg-[#F6F1E8] rounded-lg p-3 text-center">
              <p className="text-xs text-[#6B4A2E]/60 mb-1">Avg. Time</p>
              <p className="text-lg font-bold text-[#3F2A1D]">45s</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}