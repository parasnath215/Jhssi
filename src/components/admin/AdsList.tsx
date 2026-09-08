// 'use client';

// import { useEffect, useState } from 'react';
// import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
// import Image from 'next/image';

// interface Ad {
//   id: string;
//   name: string;
//   description?: string;
//   imageUrl: string;
//   targetUrl: string;
//   placement: string;
//   isActive: boolean;
//   startDate: string;
//   endDate?: string;
// }

// export default function AdsList() {
//   const [ads, setAds] = useState<Ad[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateForm, setShowCreateForm] = useState(false);

//   useEffect(() => {
//     fetchAds();
//   }, []);

//   const fetchAds = async () => {
//     try {
//       const response = await fetch('/api/ads');
//       const data = await response.json();
//       setAds(data.ads || []);
//     } catch (error) {
//       console.error('Error fetching ads:', error);
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
//       <div className="flex justify-between items-center mb-8">
//         <div>
//           <h2 className="text-3xl font-bold text-gray-900">Manage Ads</h2>
//           <p className="text-gray-600 mt-2">Create and manage your advertisements</p>
//         </div>
//         <button
//           onClick={() => setShowCreateForm(!showCreateForm)}
//           className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus className="w-5 h-5" />
//           Create New Ad
//         </button>
//       </div>

//       {showCreateForm && (
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <h3 className="text-xl font-semibold mb-4">Create New Advertisement</h3>
//           <CreateAdForm onSuccess={() => { fetchAds(); setShowCreateForm(false); }} />
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-6">
//         {ads.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-12 text-center">
//             <p className="text-gray-500">No ads found. Create your first ad to get started.</p>
//           </div>
//         ) : (
//           ads.map((ad) => (
//             <div key={ad.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
//               <div className="flex gap-6">
//                 <div className="relative w-48 h-32 flex-shrink-0">
//                   <img
//                     src={ad.imageUrl}
//                     alt={ad.name}
                    
//                     className="object-cover rounded-lg"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="text-xl font-semibold text-gray-900">{ad.name}</h3>
//                       {ad.description && (
//                         <p className="text-gray-600 text-sm mt-1">{ad.description}</p>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2">
//                       {ad.isActive ? (
//                         <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
//                           <ToggleRight className="w-4 h-4" />
//                           Active
//                         </span>
//                       ) : (
//                         <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm font-medium">
//                           <ToggleLeft className="w-4 h-4" />
//                           Inactive
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4 mt-4">
//                     <div>
//                       <span className="text-sm text-gray-500">Placement:</span>
//                       <span className="ml-2 text-sm font-medium text-gray-900">{ad.placement}</span>
//                     </div>
//                     <div>
//                       <span className="text-sm text-gray-500">Target URL:</span>
//                       <a 
//                         href={ad.targetUrl} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="ml-2 text-sm font-medium text-blue-600 hover:underline"
//                       >
//                         {ad.targetUrl.length > 30 ? ad.targetUrl.substring(0, 30) + '...' : ad.targetUrl}
//                       </a>
//                     </div>
//                   </div>
//                   <div className="flex gap-2 mt-4">
//                     <button className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
//                       <Edit className="w-4 h-4" />
//                       Edit
//                     </button>
//                     <button className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
//                       <Trash2 className="w-4 h-4" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// function CreateAdForm({ onSuccess }: { onSuccess: () => void }) {
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     imageUrl: '',
//     targetUrl: '',
//     placement: 'sidebar',
//     isActive: true,
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       const response = await fetch('/api/ads', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.error('Error creating ad:', error);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Ad Name</label>
//         <input
//           type="text"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
//         <textarea
//           value={formData.description}
//           onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           rows={3}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
//         <input
//           type="url"
//           value={formData.imageUrl}
//           onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Target URL</label>
//         <input
//           type="url"
//           value={formData.targetUrl}
//           onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           required
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">Placement</label>
//         <select
//           value={formData.placement}
//           onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
//           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//         >
//           <option value="sidebar">Sidebar</option>
//           <option value="header">Header</option>
//           <option value="article-top">Article Top</option>
//           <option value="article-bottom">Article Bottom</option>
//           <option value="footer">Footer</option>
//         </select>
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="checkbox"
//           id="isActive"
//           checked={formData.isActive}
//           onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//           className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//         />
//         <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
//           Active
//         </label>
//       </div>

//       <div className="flex justify-end gap-3 pt-4">
//         <button
//           type="submit"
//           disabled={submitting}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
//         >
//           {submitting ? 'Creating...' : 'Create Ad'}
//         </button>
//       </div>
//     </form>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, Eye, Calendar, Link2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ad {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  targetUrl: string;
  placement: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
}

export default function AdsList() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads');
      const data = await response.json();
      setAds(data.ads || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      try {
        await fetch(`/api/ads/${id}`, { method: 'DELETE' });
        fetchAds();
      } catch (error) {
        console.error('Error deleting ad:', error);
      }
    }
  };

  const handleToggleActive = async (ad: Ad) => {
    try {
      await fetch(`/api/ads/${ad.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !ad.isActive }),
      });
      fetchAds();
    } catch (error) {
      console.error('Error toggling ad:', error);
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
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h2 className="font-serif text-3xl text-[#3F2A1D] mb-2">Manage Ads</h2>
          <div className="h-px w-20 bg-[#C8A45D] mb-4"></div>
          <p className="text-[#4A4036]">Create and manage your advertisements</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setEditingAd(null);
            setShowCreateForm(!showCreateForm);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#6B4A2E] to-[#3F2A1D] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New Ad
        </motion.button>
      </motion.div>

      {/* Create/Edit Form */}
      <AnimatePresence>
        {(showCreateForm || editingAd) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#E6DDCF]">
              <h3 className="font-serif text-xl text-[#3F2A1D] mb-4">
                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h3>
              <CreateAdForm 
                ad={editingAd}
                onSuccess={() => { 
                  fetchAds(); 
                  setShowCreateForm(false);
                  setEditingAd(null);
                }}
                onCancel={() => {
                  setShowCreateForm(false);
                  setEditingAd(null);
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ads Grid */}
      <div className="grid grid-cols-1 gap-6">
        {ads.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-16 text-center border border-[#E6DDCF]"
          >
            <Eye className="w-16 h-16 text-[#C8A45D] mx-auto mb-4" />
            <p className="text-[#4A4036] text-lg mb-2">No ads found</p>
            <p className="text-[#6B4A2E]/60">Create your first ad to get started</p>
          </motion.div>
        ) : (
          ads.map((ad, index) => (
            <motion.div
              key={ad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-[#E6DDCF] hover:shadow-xl transition-all"
            >
              <div className="flex gap-6">
                {/* Image */}
                <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-[#E6DDCF]">
                  {ad.imageUrl ? (
                    <img
                      src={ad.imageUrl}
                      alt={ad.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F6F1E8] flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#C8A45D]" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-[#3F2A1D] mb-1">{ad.name}</h3>
                      {ad.description && (
                        <p className="text-[#4A4036] text-sm">{ad.description}</p>
                      )}
                    </div>
                    
                    {/* Status Badge */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleToggleActive(ad)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        ad.isActive
                          ? 'bg-green-50 text-green-700 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {ad.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4" />
                          Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4" />
                          Inactive
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F6F1E8] rounded-lg">
                        <Eye className="w-4 h-4 text-[#C8A45D]" />
                      </div>
                      <div>
                        <span className="text-xs text-[#6B4A2E]/60">Placement</span>
                        <p className="text-sm font-medium text-[#3F2A1D] capitalize">{ad.placement}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F6F1E8] rounded-lg">
                        <Link2 className="w-4 h-4 text-[#C8A45D]" />
                      </div>
                      <div>
                        <span className="text-xs text-[#6B4A2E]/60">Target URL</span>
                        <a 
                          href={ad.targetUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-[#C8A45D] hover:underline block truncate max-w-[200px]"
                        >
                          {ad.targetUrl}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-[#F6F1E8] rounded-lg">
                        <Calendar className="w-4 h-4 text-[#C8A45D]" />
                      </div>
                      <div>
                        <span className="text-xs text-[#6B4A2E]/60">Start Date</span>
                        <p className="text-sm font-medium text-[#3F2A1D]">
                          {new Date(ad.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {ad.endDate && (
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#F6F1E8] rounded-lg">
                          <Calendar className="w-4 h-4 text-[#C8A45D]" />
                        </div>
                        <div>
                          <span className="text-xs text-[#6B4A2E]/60">End Date</span>
                          <p className="text-sm font-medium text-[#3F2A1D]">
                            {new Date(ad.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-[#E6DDCF]">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingAd(ad)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#F6F1E8] text-[#6B4A2E] rounded-lg hover:bg-[#E6DDCF] transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(ad.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function CreateAdForm({ ad, onSuccess, onCancel }: { ad?: Ad | null; onSuccess: () => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: ad?.name || '',
    description: ad?.description || '',
    imageUrl: ad?.imageUrl || '',
    targetUrl: ad?.targetUrl || '',
    placement: ad?.placement || 'sidebar',
    isActive: ad?.isActive ?? true,
    startDate: ad?.startDate || new Date().toISOString().split('T')[0],
    endDate: ad?.endDate || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(ad ? `/api/ads/${ad.id}` : '/api/ads', {
        method: ad ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving ad:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#6B4A2E] mb-2">Ad Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B4A2E] mb-2">Placement</label>
          <select
            value={formData.placement}
            onChange={(e) => setFormData({ ...formData, placement: e.target.value })}
            className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
          >
            <option value="sidebar">Sidebar</option>
            <option value="header">Header</option>
            <option value="article-top">Article Top</option>
            <option value="article-bottom">Article Bottom</option>
            <option value="footer">Footer</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#6B4A2E] mb-2">Description (Optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#6B4A2E] mb-2">Image URL</label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#6B4A2E] mb-2">Target URL</label>
          <input
            type="url"
            value={formData.targetUrl}
            onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
            className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B4A2E] mb-2">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#6B4A2E] mb-2">End Date (Optional)</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2 border border-[#E6DDCF] rounded-lg focus:ring-2 focus:ring-[#C8A45D] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4 text-[#C8A45D] rounded focus:ring-[#C8A45D] border-[#E6DDCF]"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-[#6B4A2E]">
          Active immediately
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-[#E6DDCF]">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-[#E6DDCF] text-[#6B4A2E] rounded-lg hover:bg-[#F6F1E8] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2 bg-gradient-to-r from-[#6B4A2E] to-[#3F2A1D] text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
        >
          {submitting ? 'Saving...' : ad ? 'Update Ad' : 'Create Ad'}
        </button>
      </div>
    </form>
  );
}