// 'use client';

// import { LucideIcon } from 'lucide-react';

// interface MetricCardProps {
//   title: string;
//   value: string | number;
//   icon: LucideIcon;
//   color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
//   trend?: {
//     value: number;
//     isPositive: boolean;
//   };
// }

// const colorClasses = {
//   blue: 'bg-blue-100 text-blue-600',
//   green: 'bg-green-100 text-green-600',
//   purple: 'bg-purple-100 text-purple-600',
//   orange: 'bg-orange-100 text-orange-600',
//   red: 'bg-red-100 text-red-600',
// };

// export default function MetricCard({ title, value, icon: Icon, color, trend }: MetricCardProps) {
//   return (
//     <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
//       <div className="flex items-center justify-between mb-4">
//         <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
//           <Icon className="w-6 h-6" />
//         </div>
//         {trend && (
//           <div className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
//             {trend.isPositive ? '+' : ''}{trend.value}%
//           </div>
//         )}
//       </div>
//       <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
//       <p className="text-2xl font-bold text-gray-900">{value}</p>
//     </div>
//   );
// }

'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  purple: 'bg-purple-100 text-purple-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
};

const iconBgColors = {
  blue: 'bg-blue-50',
  green: 'bg-green-50',
  purple: 'bg-purple-50',
  orange: 'bg-orange-50',
  red: 'bg-red-50',
};

export default function MetricCard({ title, value, icon: Icon, color, trend }: MetricCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-[#E6DDCF] hover:shadow-xl transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${iconBgColors[color]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
        </div>
        {trend && (
          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
            trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-[#6B4A2E]/60 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-[#3F2A1D]">{value}</p>
    </motion.div>
  );
}