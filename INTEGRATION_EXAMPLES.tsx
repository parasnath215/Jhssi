/**
 * EXAMPLE: How to integrate ads into your existing pages
 * 
 * This file shows how to add ad placements to your journal pages
 */

// Example 1: Add sidebar ad to any page
// File: src/app/current/page.tsx
// import AdPlacement from '.src/components/ads/AdPlacement';


// export default function CurrentPage() {
//   return (
//     <div className="flex gap-6">
//       {/* Main content */}
//       <main className="flex-1">
//         <h1>Current Issue</h1>
//         {/* Your existing content */}
//       </main>
      
//       {/* Sidebar with ad */}
//       <aside className="w-64">
//         <AdPlacement 
//           placement="sidebar" 
//           className="w-full h-96 mb-6" 
//         />
//         {/* Other sidebar content */}
//       </aside>
//     </div>
//   );
// }

// Example 2: Add header ad
// File: src/components/Navigation.tsx

// import AdPlacement from '@/components/ads/AdPlacement';

// export default function Navigation() {
//   return (
//     <div>
//       <nav>
//         {/* Your navigation */}
//       </nav>
      
//       {/* Header ad below navigation */}
//       <AdPlacement 
//         placement="header" 
//         className="w-full h-24 my-4" 
//       />
//     </div>
//   );
// }

// Example 3: Add ads in article/paper view
// File: src/app/archives/page.tsx

// import AdPlacement from '@/components/ads/AdPlacement';

// export default function ArchivesPage() {
//   return (
//     <div className="max-w-4xl mx-auto">
//       {/* Top ad */}
//       <AdPlacement 
//         placement="article-top" 
//         className="w-full h-48 mb-8" 
//       />
      
//       <article>
//         {/* Your article content */}
//         <h1>Research Paper Title</h1>
//         <div className="content">
//           {/* Paper content */}
//         </div>
//       </article>
      
//       {/* Bottom ad */}
//       <AdPlacement 
//         placement="article-bottom" 
//         className="w-full h-48 mt-8" 
//       />
//     </div>
//   );
// }

// Example 4: Add footer ad
// File: src/components/Footer.tsx

import AdPlacement from '@/components/ads/AdPlacement';

export default function Footer() {
  return (
    <footer>
      {/* Ad above footer */}
      <AdPlacement 
        placement="footer" 
        className="w-full h-32 mb-6" 
      />
      
      <div>
        {/* Your footer content */}
      </div>
    </footer>
  );
}

// Example 5: Multiple ads on a page
// export default function HomePage() {
//   return (
//     <div>
//       {/* Header ad */}
//       <AdPlacement placement="header" className="w-full h-24 mb-4" />
      
//       <div className="flex gap-6">
//         {/* Main content */}
//         <main className="flex-1">
//           {/* Article top ad */}
//           <AdPlacement placement="article-top" className="w-full h-48 mb-6" />
          
//           <div>
//             {/* Your content */}
//           </div>
          
//           {/* Article bottom ad */}
//           <AdPlacement placement="article-bottom" className="w-full h-48 mt-6" />
//         </main>
        
//         {/* Sidebar ad */}
//         <aside className="w-64">
//           <AdPlacement placement="sidebar" className="w-full h-96" />
//         </aside>
//       </div>
      
//       {/* Footer ad */}
//       <AdPlacement placement="footer" className="w-full h-32 mt-8" />
//     </div>
//   );
// }

// //this is a new file