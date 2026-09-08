// 'use client';

// import { useState } from 'react';
// import Sidebar from './Sidebar';
// import Overview from './Overview';
// import AdsList from './AdsList';
// import Analytics from './Analytics';
// import RealTimeMetrics from './RealTimeMetrics';

// type View = 'overview' | 'ads' | 'analytics' | 'realtime';

// export default function DashboardLayout() {
//   const [currentView, setCurrentView] = useState<View>('overview');

//   const renderView = () => {
//     switch (currentView) {
//       case 'overview':
//         return <Overview />;
//       case 'ads':
//         return <AdsList />;
//       case 'analytics':
//         return <Analytics />;
//       case 'realtime':
//         return <RealTimeMetrics />;
//       default:
//         return <Overview />;
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <Sidebar currentView={currentView} onViewChange={setCurrentView} />
//       <main className="flex-1 p-8">
//         <div className="max-w-7xl mx-auto">
//           {renderView()}
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Overview from './Overview';
import AdsList from './AdsList';
import Analytics from './Analytics';
import RealTimeMetrics from './RealTimeMetrics';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type View = 'overview' | 'ads' | 'analytics' | 'realtime';

export default function DashboardLayout() {
  const [currentView, setCurrentView] = useState<View>('overview');

  const renderView = () => {
    switch (currentView) {
      case 'overview':
        return <Overview />;
      case 'ads':
        return <AdsList />;
      case 'analytics':
        return <Analytics />;
      case 'realtime':
        return <RealTimeMetrics />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F1E8]">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1">
        {/* Header with back button */}
        <div className="bg-white border-b border-[#E6DDCF] sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <button
  onClick={() => window.history.back()}
  className="flex items-center gap-2 text-[#6B4A2E] hover:text-[#3F2A1D] transition-colors group"
>
  <div className="p-1.5 rounded-full bg-[#F6F1E8] group-hover:bg-[#E6DDCF] transition-colors">
    <ArrowLeft className="w-4 h-4" />
  </div>
  <span className="font-medium">Back to Admin Dashboard</span>
</button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#6B4A2E] to-[#3F2A1D] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-[#3F2A1D]">Ad Management</h1>
                <p className="text-xs text-[#6B4A2E]/60">Analytics & Campaigns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
    </div>
  );
}