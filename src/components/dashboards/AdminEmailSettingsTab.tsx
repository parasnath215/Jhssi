'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Hash,
  Server,
  FileText,
  Clock,
  Eye,
  RefreshCw,
  Sliders,
  Check,
  ShieldCheck,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SmtpSettings {
  host: string;
  port: string | number;
  user: string;
  hasPassword?: boolean;
  fromName: string;
  fromEmail: string;
  enabled: boolean;
}

interface ManuscriptConfig {
  prefix: string;
  yearCode: string;
  currentCounter: number;
  nextPreview: string;
}

interface EmailTemplate {
  subject: string;
  body: string;
}

interface EmailLogItem {
  id: string;
  recipient: string;
  recipientName?: string | null;
  subject: string;
  body: string;
  templateType: string;
  manuscriptNo?: string | null;
  status: string;
  errorMessage?: string | null;
  createdAt: string;
}

type TemplateKey = 'SUBMISSION_CONFIRMATION' | 'REVISION_REQUESTED' | 'REJECTED' | 'PUBLISHED';

export default function AdminEmailSettingsTab() {
  const [loading, setLoading] = useState(true);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [savingManuscript, setSavingManuscript] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  // Data states
  const [smtp, setSmtp] = useState<SmtpSettings>({
    host: 'smtp.gmail.com',
    port: '587',
    user: '',
    fromName: 'Journal of Humanities and Social Sciences Inventions',
    fromEmail: 'journalofhssi@gmail.com',
    enabled: true,
  });
  const [smtpPassword, setSmtpPassword] = useState('');

  const [manuscript, setManuscript] = useState<ManuscriptConfig>({
    prefix: 'JHSSI',
    yearCode: '26',
    currentCounter: 0,
    nextPreview: 'JHSSI-26-0001',
  });

  const [templates, setTemplates] = useState<Record<TemplateKey, EmailTemplate>>({
    SUBMISSION_CONFIRMATION: { subject: '', body: '' },
    REVISION_REQUESTED: { subject: '', body: '' },
    REJECTED: { subject: '', body: '' },
    PUBLISHED: { subject: '', body: '' },
  });

  const [defaultTemplates, setDefaultTemplates] = useState<Record<string, EmailTemplate>>({});
  const [recentLogs, setRecentLogs] = useState<EmailLogItem[]>([]);

  // UI state
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<TemplateKey>('SUBMISSION_CONFIRMATION');
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; status?: string } | null>(null);
  const [selectedLog, setSelectedLog] = useState<EmailLogItem | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/email-settings');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load settings');

      if (data.smtp) setSmtp(data.smtp);
      if (data.manuscript) setManuscript(data.manuscript);
      if (data.templates) setTemplates(data.templates);
      if (data.defaultTemplates) setDefaultTemplates(data.defaultTemplates);
      if (data.recentLogs) setRecentLogs(data.recentLogs);
    } catch (err: any) {
      console.error('Error loading email settings:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Error loading settings' });
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSmtp(true);
    try {
      const payload: any = {
        smtp: {
          ...smtp,
          pass: smtpPassword || undefined,
        },
      };

      const res = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save SMTP');

      showToast('success', 'SMTP and Mail server configurations updated successfully!');
      setSmtpPassword('');
      fetchSettings();
    } catch (err: any) {
      showToast('error', err.message || 'Error saving SMTP');
    } finally {
      setSavingSmtp(false);
    }
  };

  const handleSaveManuscript = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingManuscript(true);
    try {
      const payload = {
        manuscript: {
          prefix: manuscript.prefix,
          counter: Number(manuscript.currentCounter),
        },
      };

      const res = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save manuscript settings');

      showToast('success', 'Manuscript numbering system updated successfully!');
      fetchSettings();
    } catch (err: any) {
      showToast('error', err.message || 'Error saving manuscript numbering');
    } finally {
      setSavingManuscript(false);
    }
  };

  const handleSaveCurrentTemplate = async () => {
    setSavingTemplate(true);
    try {
      const current = templates[selectedTemplateKey];
      const payload = {
        templates: {
          [selectedTemplateKey]: current,
        },
      };

      const res = await fetch('/api/admin/email-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save template');

      showToast('success', `Email template "${selectedTemplateKey.replace(/_/g, ' ')}" saved successfully!`);
    } catch (err: any) {
      showToast('error', err.message || 'Error saving template');
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleResetTemplate = () => {
    const defaultTpl = defaultTemplates[selectedTemplateKey];
    if (defaultTpl) {
      setTemplates(prev => ({
        ...prev,
        [selectedTemplateKey]: { ...defaultTpl },
      }));
      showToast('success', `Restored default template for ${selectedTemplateKey.replace(/_/g, ' ')}. Click "Save Template" to persist.`);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailRecipient.trim()) {
      showToast('error', 'Please enter a target recipient email address for testing.');
      return;
    }

    setTestingEmail(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/admin/email-settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetEmail: testEmailRecipient.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Test email failed');

      setTestResult({
        success: data.success,
        message: data.message,
        status: data.status,
      });

      if (data.success) {
        showToast('success', `Test notification processed (${data.status}). Check recipient inbox or audit log.`);
        fetchSettings();
      } else {
        showToast('error', data.message || 'Test email delivery failed');
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch test email',
      });
      showToast('error', err.message || 'Error executing test');
    } finally {
      setTestingEmail(false);
    }
  };

  const insertVariable = (tag: string) => {
    const current = templates[selectedTemplateKey];
    setTemplates(prev => ({
      ...prev,
      [selectedTemplateKey]: {
        ...current,
        body: (current.body || '') + tag,
      },
    }));
  };

  if (loading) {
    return (
      <div className="bg-white border border-[#E6DDCF] rounded-2xl p-16 text-center text-[#6B4A2E]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C8A45D]" />
        <p className="text-sm font-semibold">Loading Email & Manuscript System Setup...</p>
      </div>
    );
  }

  const templateTabList: { key: TemplateKey; label: string; desc: string }[] = [
    {
      key: 'SUBMISSION_CONFIRMATION',
      label: '1. Submission Received',
      desc: 'Dispatched immediately when an author submits a new manuscript',
    },
    {
      key: 'REVISION_REQUESTED',
      label: '2. Revision / Update Required',
      desc: 'Dispatched when reviewers or editors request manuscript modifications',
    },
    {
      key: 'REJECTED',
      label: '3. Manuscript Rejected',
      desc: 'Dispatched upon negative editorial decision',
    },
    {
      key: 'PUBLISHED',
      label: '4. Manuscript Published',
      desc: 'Dispatched when manuscript is approved and scheduled in journal archives',
    },
  ];

  const availableVariables = [
    { tag: '{TITLE}', label: 'Manuscript Title' },
    { tag: '{AUTHORS}', label: 'Author Full Name' },
    { tag: '{ARTICLE_TYPE}', label: 'Article Category' },
    { tag: '{MANUSCRIPT_NO}', label: 'Manuscript No (JHSSI-26-0001)' },
    { tag: '{SALUTATION}', label: 'Dear Dr. Surname' },
    { tag: '{USERNAME}', label: 'Author Login / Username' },
    { tag: '{COMMENTS}', label: 'Reviewer Feedback Notes' },
    { tag: '{CONTACT_EMAIL}', label: 'Journal Contact Email' },
    { tag: '{DOI}', label: 'DOI Number' },
    { tag: '{VOLUME}', label: 'Volume' },
    { tag: '{ISSUE}', label: 'Issue' },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-gray-400 hover:text-gray-600 font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Hero Overview */}
      <div className="bg-gradient-to-br from-[#6B4A2E] to-[#3F2A1D] text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-xs border border-[#C8A45D]/40 rounded-full text-xs font-semibold text-[#E6DDCF] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
              <span>Automated Editorial Communications Engine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold">
              Email Notifications & Manuscript Numbering Setup
            </h2>
            <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Every submission is assigned a formal Manuscript Number (<code className="bg-black/30 px-1.5 py-0.5 rounded text-[#C8A45D] font-mono">JHSSI-26-0001</code>). Automated email notifications are dispatched for submissions, updates requested, rejections, and publications.
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center shrink-0">
            <span className="text-[11px] text-[#E6DDCF] uppercase font-bold tracking-wider block mb-1">
              Next Assigned Manuscript No.
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-[#C8A45D] tracking-wide">
              {manuscript.prefix}-{manuscript.yearCode}-{String(Number(manuscript.currentCounter) + 1).padStart(4, '0')}
            </span>
            <span className="text-[10px] text-white/60 block mt-1">
              Current Year Counter: {manuscript.currentCounter}
            </span>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns for Manuscript & SMTP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Manuscript Numbering Format */}
        <div className="bg-white border border-[#E6DDCF] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-4 border-b border-[#F0E8DC] pb-3">
            <div className="w-8 h-8 rounded-lg bg-[#F6F1E8] flex items-center justify-center text-[#6B4A2E]">
              <Hash className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#3F2A1D]">
                Manuscript Numbering Configuration
              </h3>
              <p className="text-[11px] text-[#7A6F63]">
                Sequence format rule: <code className="font-mono font-bold text-[#6B4A2E]">{'{PREFIX}-{YY}-{XXXX}'}</code>
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveManuscript} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] mb-1">
                  Journal Prefix
                </label>
                <input
                  type="text"
                  value={manuscript.prefix}
                  onChange={e => setManuscript({ ...manuscript, prefix: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                  placeholder="JHSSI"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3F2A1D] mb-1">
                  2-Digit Year Code
                </label>
                <input
                  type="text"
                  disabled
                  value={manuscript.yearCode}
                  className="w-full px-3 py-2 text-xs font-mono bg-gray-100 text-gray-500 border border-gray-200 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3F2A1D] mb-1">
                Current Sequence Counter
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  value={manuscript.currentCounter}
                  onChange={e => setManuscript({ ...manuscript, currentCounter: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs font-mono bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={() => setManuscript({ ...manuscript, currentCounter: 0 })}
                  className="px-3 py-2 text-[11px] font-semibold text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-xl border border-[#E6DDCF] shrink-0"
                >
                  Reset Counter
                </button>
              </div>
              <p className="text-[11px] text-[#7A6F63] mt-1">
                The next submission will receive: <strong className="font-mono text-[#6B4A2E]">{manuscript.prefix}-{manuscript.yearCode}-{String(Number(manuscript.currentCounter) + 1).padStart(4, '0')}</strong>
              </p>
            </div>

            <button
              type="submit"
              disabled={savingManuscript}
              className="w-full py-2.5 bg-[#6B4A2E] hover:bg-[#523720] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              {savingManuscript ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Numbering Rules...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Numbering Rules</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Card 2: SMTP Configuration */}
        <div className="bg-white border border-[#E6DDCF] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4 border-b border-[#F0E8DC] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F6F1E8] flex items-center justify-center text-[#6B4A2E]">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#3F2A1D]">
                  SMTP Mail Server Configuration
                </h3>
                <p className="text-[11px] text-[#7A6F63]">
                  Host, ports, and sender identity for real email delivery
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smtp.enabled}
                onChange={e => setSmtp({ ...smtp, enabled: e.target.checked })}
                className="w-4 h-4 accent-[#6B4A2E] rounded"
              />
              <span className="text-xs font-bold text-[#3F2A1D]">
                {smtp.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <form onSubmit={handleSaveSmtp} className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-[#3F2A1D] mb-1">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={smtp.host}
                  onChange={e => setSmtp({ ...smtp, host: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  placeholder="smtp.gmail.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F2A1D] mb-1">
                  Port
                </label>
                <input
                  type="text"
                  value={String(smtp.port)}
                  onChange={e => setSmtp({ ...smtp, port: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  placeholder="587"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#3F2A1D] mb-1">
                  SMTP Username / Email
                </label>
                <input
                  type="text"
                  value={smtp.user}
                  onChange={e => setSmtp({ ...smtp, user: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  placeholder="journalofhssi@gmail.com"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F2A1D] mb-1">
                  SMTP Password / App Password
                </label>
                <input
                  type="password"
                  value={smtpPassword}
                  onChange={e => setSmtpPassword(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  placeholder={smtp.hasPassword ? '•••••••• (configured)' : 'Enter SMTP password'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#3F2A1D] mb-1">
                  Sender Display Name
                </label>
                <input
                  type="text"
                  value={smtp.fromName}
                  onChange={e => setSmtp({ ...smtp, fromName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  placeholder="Journal of Humanities and Social Sciences Inventions"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3F2A1D] mb-1">
                  Sender / Reply-To Email
                </label>
                <input
                  type="email"
                  value={smtp.fromEmail}
                  onChange={e => setSmtp({ ...smtp, fromEmail: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
                  placeholder="journalofhssi@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#7A6F63]">
                {smtp.user ? '✓ SMTP credentials provided' : 'ⓘ Running in simulated database log mode until credentials saved'}
              </span>
              <button
                type="submit"
                disabled={savingSmtp}
                className="px-4 py-2 bg-[#6B4A2E] hover:bg-[#523720] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
              >
                {savingSmtp ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save SMTP</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Test Email Section */}
          <div className="mt-4 pt-4 border-t border-[#F0E8DC]">
            <form onSubmit={handleSendTestEmail} className="flex items-center gap-2">
              <input
                type="email"
                value={testEmailRecipient}
                onChange={e => setTestEmailRecipient(e.target.value)}
                placeholder="Enter recipient email to send test..."
                className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={testingEmail}
                className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
              >
                {testingEmail ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test</span>
                  </>
                )}
              </button>
            </form>
            {testResult && (
              <p className={`text-[11px] mt-1.5 font-medium ${testResult.success ? 'text-emerald-700' : 'text-red-700'}`}>
                {testResult.message} ({testResult.status})
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Card 3: Email Templates Editor */}
      <div className="bg-white border border-[#E6DDCF] rounded-2xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-[#F0E8DC] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F6F1E8] flex items-center justify-center text-[#6B4A2E]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#3F2A1D]">
                Customizable Email Notification Templates
              </h3>
              <p className="text-[11px] text-[#7A6F63]">
                Manage the exact email wording sent to authors during every editorial milestone
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetTemplate}
              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F6F1E8] text-[#6B4A2E] rounded-xl text-xs font-semibold border border-[#E6DDCF] transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
            <button
              onClick={handleSaveCurrentTemplate}
              disabled={savingTemplate}
              className="px-4 py-1.5 bg-[#6B4A2E] hover:bg-[#523720] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
            >
              {savingTemplate ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Template...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Template</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {templateTabList.map(tab => {
            const isSelected = selectedTemplateKey === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTemplateKey(tab.key)}
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#6B4A2E] text-white border-[#6B4A2E] shadow-xs'
                    : 'bg-[#FAF7F2] text-[#3F2A1D] border-[#E6DDCF] hover:bg-white hover:border-[#C8A45D]'
                }`}
              >
                <div className="font-serif font-bold text-xs truncate">
                  {tab.label}
                </div>
                <div className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-[#E6DDCF]' : 'text-[#7A6F63]'}`}>
                  {tab.desc}
                </div>
              </button>
            );
          })}
        </div>

        {/* Template Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3F2A1D] mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              value={templates[selectedTemplateKey]?.subject || ''}
              onChange={e =>
                setTemplates({
                  ...templates,
                  [selectedTemplateKey]: {
                    ...templates[selectedTemplateKey],
                    subject: e.target.value,
                  },
                })
              }
              className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden font-medium"
              placeholder="Email subject..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#3F2A1D]">
                Email Message Body
              </label>
              <span className="text-[11px] text-[#7A6F63]">
                Plain text and clean formatting supported
              </span>
            </div>

            <textarea
              rows={16}
              value={templates[selectedTemplateKey]?.body || ''}
              onChange={e =>
                setTemplates({
                  ...templates,
                  [selectedTemplateKey]: {
                    ...templates[selectedTemplateKey],
                    body: e.target.value,
                  },
                })
              }
              className="w-full p-4 text-xs font-mono bg-[#FAF7F2] border border-[#E6DDCF] rounded-xl focus:bg-white focus:ring-1 focus:ring-[#C8A45D] focus:outline-hidden leading-relaxed"
              placeholder="Email template body..."
            />
          </div>

          {/* Variables Palette */}
          <div>
            <span className="text-[11px] font-bold text-[#6B4A2E] block mb-2">
              Click to insert dynamic variables:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {availableVariables.map(v => (
                <button
                  key={v.tag}
                  type="button"
                  onClick={() => insertVariable(` ${v.tag} `)}
                  className="px-2.5 py-1 bg-[#F6F1E8] hover:bg-[#EAE2D5] text-[#6B4A2E] border border-[#E6DDCF] rounded-lg text-[11px] font-mono font-semibold transition active:scale-95"
                  title={v.label}
                >
                  {v.tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Real-Time Email Dispatch Audit Logs */}
      <div className="bg-white border border-[#E6DDCF] rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-[#F0E8DC] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F6F1E8] flex items-center justify-center text-[#6B4A2E]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#3F2A1D]">
                Dispatched Author Notifications (Live Audit Log)
              </h3>
              <p className="text-[11px] text-[#7A6F63]">
                Recent emails generated across submission, revision, and publication events
              </p>
            </div>
          </div>

          <button
            onClick={fetchSettings}
            className="p-1.5 text-[#6B4A2E] hover:bg-[#F6F1E8] rounded-lg transition"
            title="Refresh logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#7A6F63] bg-[#FAF7F2] rounded-xl border border-dashed border-[#E6DDCF]">
            No notification logs recorded yet. When authors submit manuscripts or status updates occur, logs will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E6DDCF] text-[#6B4A2E] bg-[#FAF7F2]">
                  <th className="py-2.5 px-3 font-bold">Recipient</th>
                  <th className="py-2.5 px-3 font-bold">Manuscript No.</th>
                  <th className="py-2.5 px-3 font-bold">Subject</th>
                  <th className="py-2.5 px-3 font-bold">Type</th>
                  <th className="py-2.5 px-3 font-bold">Delivery Status</th>
                  <th className="py-2.5 px-3 font-bold">Date & Time</th>
                  <th className="py-2.5 px-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {recentLogs.map(log => {
                  const isSent = log.status === 'SENT';
                  const isMock = log.status === 'MOCK_SENT';
                  const isFailed = log.status === 'FAILED';

                  return (
                    <tr key={log.id} className="hover:bg-[#FAF7F2] transition">
                      <td className="py-2 px-3 font-medium text-[#3F2A1D]">
                        <div>{log.recipientName || 'Author'}</div>
                        <div className="text-[10px] text-gray-500">{log.recipient}</div>
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-[#6B4A2E]">
                        {log.manuscriptNo || '—'}
                      </td>
                      <td className="py-2 px-3 text-[#3F2A1D] max-w-xs truncate">
                        {log.subject}
                      </td>
                      <td className="py-2 px-3 text-[11px] text-gray-600">
                        {log.templateType.replace(/_/g, ' ')}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isSent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isMock
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-red-50 text-red-700 border border-red-200'
                          }`}
                        >
                          {isSent ? '✓ SENT (SMTP)' : isMock ? 'LOGGED (SIM)' : '✕ FAILED'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-[11px] text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-2 py-1 text-[11px] text-[#6B4A2E] hover:underline font-semibold"
                        >
                          View Email
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: View Email Log Body */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-[#E6DDCF] shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-[#F0E8DC] bg-[#FAF7F2] flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-[#3F2A1D]">
                  {selectedLog.subject}
                </h4>
                <p className="text-[11px] text-[#7A6F63]">
                  To: {selectedLog.recipient} • {new Date(selectedLog.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto font-mono text-xs text-[#3F2A1D] whitespace-pre-wrap leading-relaxed bg-white">
              {selectedLog.body}
            </div>

            {selectedLog.errorMessage && (
              <div className="p-3 bg-red-50 border-t border-red-200 text-xs text-red-700">
                <strong>Error info:</strong> {selectedLog.errorMessage}
              </div>
            )}

            <div className="p-3 border-t border-[#F0E8DC] bg-[#FAF7F2] text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-[#6B4A2E] text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
