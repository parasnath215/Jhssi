'use client';

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Trash2,
  Edit,
  Key,
  Shield,
  Search,
  Check,
  Copy,
  X,
  FileCheck2,
  Clock,
  RefreshCw,
  Building2,
  GraduationCap,
  Eye,
  EyeOff
} from 'lucide-react';

export interface ReviewerData {
  id: string;
  name: string;
  email: string;
  institution?: string | null;
  fieldOfStudy?: string | null;
  role?: string;
  createdAt?: string;
  totalAssigned?: number;
  completedReviews?: number;
}

interface AdminReviewersTabProps {
  reviewers: ReviewerData[];
  onRefresh: () => void;
}

export default function AdminReviewersTab({ reviewers, onRefresh }: AdminReviewersTabProps) {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Reviewer Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newInstitution, setNewInstitution] = useState('');
  const [newFieldOfStudy, setNewFieldOfStudy] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submittingAdd, setSubmittingAdd] = useState(false);
  const [addError, setAddError] = useState('');

  // Edit Reviewer Modal State
  const [editingReviewer, setEditingReviewer] = useState<ReviewerData | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editInstitution, setEditInstitution] = useState('');
  const [editFieldOfStudy, setEditFieldOfStudy] = useState('');
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState('');

  const generateRandomPassword = () => {
    const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenAdd = () => {
    setNewName('');
    setNewEmail('');
    setNewPassword(generateRandomPassword());
    setNewInstitution('');
    setNewFieldOfStudy('');
    setAddError('');
    setIsAddOpen(true);
  };

  const handleCreateReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');

    if (!newName.trim() || !newEmail.trim() || !newPassword) {
      setAddError('Name, Email (ID), and Password are required.');
      return;
    }

    setSubmittingAdd(true);
    try {
      const res = await fetch('/api/users/reviewers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          email: newEmail.trim(),
          password: newPassword,
          institution: newInstitution.trim() || undefined,
          fieldOfStudy: newFieldOfStudy.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create reviewer account');

      alert(`Reviewer "${data.reviewer.name}" created successfully with ID: ${data.reviewer.email}`);
      setIsAddOpen(false);
      onRefresh();
    } catch (err: any) {
      setAddError(err.message || 'Error creating reviewer');
    } finally {
      setSubmittingAdd(false);
    }
  };

  const handleOpenEdit = (reviewer: ReviewerData) => {
    setEditingReviewer(reviewer);
    setEditName(reviewer.name || '');
    setEditEmail(reviewer.email || '');
    setEditPassword('');
    setEditInstitution(reviewer.institution || '');
    setEditFieldOfStudy(reviewer.fieldOfStudy || '');
    setEditError('');
  };

  const handleUpdateReviewer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReviewer) return;
    setEditError('');

    setSubmittingEdit(true);
    try {
      const payload: any = {
        id: editingReviewer.id,
        name: editName.trim(),
        email: editEmail.trim(),
        institution: editInstitution.trim(),
        fieldOfStudy: editFieldOfStudy.trim(),
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await fetch('/api/users/reviewers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update reviewer');

      alert(data.message || 'Reviewer updated successfully');
      setEditingReviewer(null);
      onRefresh();
    } catch (err: any) {
      setEditError(err.message || 'Error updating reviewer');
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteReviewer = async (reviewer: ReviewerData) => {
    if (
      !confirm(
        `Are you sure you want to delete reviewer "${reviewer.name}" (${reviewer.email})?\n\nThey will be unassigned from any pending submissions.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/users/reviewers?id=${reviewer.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete reviewer');

      alert('Reviewer account deleted successfully');
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting reviewer');
    }
  };

  const filteredReviewers = reviewers.filter(r => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.institution?.toLowerCase().includes(q) ||
      r.fieldOfStudy?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      {/* Action Header */}
      <div className="bg-white p-4 rounded-2xl border border-[#E6DDCF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-lg font-bold text-[#3F2A1D] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#6B4A2E]" />
            <span>Peer Reviewer Directorate</span>
          </h2>
          <p className="text-xs text-[#7A6F63] mt-0.5">
            Manage peer reviewers, generate login credentials (ID & password), monitor workload, and delete accounts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B4A2E]/60" />
            <input
              type="text"
              placeholder="Search reviewers by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
            />
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-3.5 py-1.5 bg-[#6B4A2E] hover:bg-[#523720] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition shadow-xs shrink-0 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Reviewer</span>
          </button>
        </div>
      </div>

      {/* Reviewers List */}
      {filteredReviewers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E6DDCF]">
          <Users className="w-10 h-10 text-[#C8A45D] mx-auto mb-2 opacity-60" />
          <h3 className="font-serif font-bold text-base text-[#3F2A1D]">No reviewers found</h3>
          <p className="text-xs text-[#7A6F63] max-w-sm mx-auto mt-1 mb-4">
            {search
              ? 'No reviewers match your search query.'
              : 'No reviewers have been registered yet. Add a reviewer with an ID and password to get started.'}
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#6B4A2E] text-white rounded-xl text-xs font-semibold hover:bg-[#523720] transition cursor-pointer"
          >
            Create First Reviewer Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredReviewers.map(r => {
            const initials = r.name
              ? r.name
                  .split(' ')
                  .map(n => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              : 'RV';

            return (
              <div
                key={r.id}
                className="bg-white border border-[#E6DDCF] rounded-2xl p-4 shadow-xs hover:border-[#C8A45D] transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E6DDCF] text-[#6B4A2E] font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif font-bold text-[#3F2A1D] text-sm">{r.name}</h3>
                          {r.role === 'ADMIN' && (
                            <span className="px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-900 text-[10px] font-bold">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-mono text-[#6B4A2E]">{r.email}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(r.email, r.id)}
                            className="p-1 text-gray-400 hover:text-[#6B4A2E] rounded transition"
                            title="Copy Email / Login ID"
                          >
                            {copiedId === r.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(r)}
                        className="p-1.5 text-gray-400 hover:text-[#6B4A2E] hover:bg-[#FAF7F2] rounded-lg transition"
                        title="Edit Reviewer or Reset Password"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteReviewer(r)}
                        className="p-1.5 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete Reviewer Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-[#7A6F63] pt-1">
                    {r.institution && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
                        <span className="truncate">{r.institution}</span>
                      </div>
                    )}
                    {r.fieldOfStudy && (
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-[#C8A45D] shrink-0" />
                        <span className="truncate">{r.fieldOfStudy}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E6DDCF]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-[11px] font-semibold">
                      Assigned: {r.totalAssigned || 0}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-[11px] font-semibold">
                      Completed: {r.completedReviews || 0}
                    </span>
                  </div>
                  {r.createdAt && (
                    <span className="text-[10px] text-gray-400">
                      Added {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD REVIEWER WITH ID AND PASSWORD */}
      {/* ============================================================ */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B4A2E] font-bold">
                Reviewer Accounts
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1">
                Add New Peer Reviewer
              </h3>
              <p className="text-[11px] text-[#7A6F63] mt-0.5">
                Create a reviewer account and set their Login ID (email) and password.
              </p>
            </div>

            {addError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateReviewer} className="space-y-3">
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Smith"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">
                  Email / Login ID *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jsmith@university.edu"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-[#3F2A1D]">Password *</label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[11px] text-[#6B4A2E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password (min 6 characters)"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl font-mono text-xs focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 mt-1">
                  Share these credentials with the reviewer so they can log in at <code>/login</code>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Institution</label>
                  <input
                    type="text"
                    placeholder="e.g. Oxford University"
                    value={newInstitution}
                    onChange={e => setNewInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Field of Study</label>
                  <input
                    type="text"
                    placeholder="e.g. Social Sciences"
                    value={newFieldOfStudy}
                    onChange={e => setNewFieldOfStudy(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdd}
                  className="bg-[#6B4A2E] hover:bg-[#523720] text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {submittingAdd ? 'Creating...' : 'Create Reviewer ID'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT REVIEWER & RESET PASSWORD */}
      {/* ============================================================ */}
      {editingReviewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="bg-white border border-[#E6DDCF] rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setEditingReviewer(null)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#6B4A2E] font-bold">
                Edit Profile
              </span>
              <h3 className="font-serif text-lg font-bold text-[#3F2A1D] mt-1">
                Update Reviewer Details
              </h3>
            </div>

            {editError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateReviewer} className="space-y-3">
              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">Email / Login ID</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-[#3F2A1D] block mb-1">
                  Reset Password (leave empty to keep current password)
                </label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={editPassword}
                  onChange={e => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Institution</label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={e => setEditInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#3F2A1D] block mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={editFieldOfStudy}
                    onChange={e => setEditFieldOfStudy(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingReviewer(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingEdit}
                  className="bg-[#6B4A2E] hover:bg-[#523720] text-white px-5 py-2 rounded-xl font-bold transition disabled:opacity-50 cursor-pointer"
                >
                  {submittingEdit ? 'Saving...' : 'Update Reviewer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
