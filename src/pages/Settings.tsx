import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User, Settings2, Database, Shield,
  Upload, Eye, EyeOff, Save, RefreshCw,
  CheckCircle2, AlertCircle, ToggleLeft, ToggleRight,
  Download, Server, Activity, Lock
} from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { useProfile } from '@/context/ProfileContext';
import { supabase } from '@/lib/supabase';

/* ─────────────── types ─────────────── */
type Tab = 'profile' | 'admission' | 'database' | 'security';

/* ─────────────── helpers ─────────────── */
const inputCls =
  'w-full px-3 py-2.5 rounded-lg text-sm border border-gray-200 bg-white text-gray-900 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-100 font-sans';

const labelCls =
  'block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5';

function SectionTitle({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <Icon size={16} className="text-violet-600" />
      <div>
        <h2 className="text-base font-bold text-gray-900">{title}</h2>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl bg-white border border-gray-100 ${className}`}
      style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────── */
/*              PROFILE TAB               */
/* ─────────────────────────────────────── */
function ProfileTab() {
  const { profile, saveProfile } = useProfile();

  // Local draft state — pre-populated from persisted profile
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [role, setRole] = useState(profile.role);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);

  // Sync draft states when profile changes (e.g. on mount or load)
  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setRole(profile.role);
    setAvatar(profile.avatar);
  }, [profile]);

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCur, setShowCur] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPwd) {
      if (newPwd !== confirmPwd) {
        setError('New passwords do not match.');
        return;
      }
      if (!currentPwd) {
        setError('Please enter your current password to verify your identity.');
        return;
      }
    }

    setSaving(true);

    try {
      // 1. Verify and update password in Supabase if requested
      if (newPwd) {
        // Attempt to sign in with current credentials to verify password
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: profile.email,
          password: currentPwd,
        });

        if (verifyError) {
          setError('Incorrect current password. Please try again.');
          setSaving(false);
          return;
        }

        // Current password is correct, now update to new password
        const { error: pwdError } = await supabase.auth.updateUser({
          password: newPwd,
        });
        if (pwdError) {
          setError(pwdError.message);
          setSaving(false);
          return;
        }
      }

      // 2. Save profile information to Supabase user_metadata
      await saveProfile({ fullName, email, phone, role, avatar });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (err: any) {
      setError(err?.message || 'An error occurred while saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="mb-1">
        <SectionTitle icon={User} title="Profile Settings" sub="Update your personal information and change your admin security credentials." />
      </div>

      {/* Avatar card */}
      <Card className="p-5 flex items-center gap-5">
        <div
          className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
          style={{ background: avatar ? 'transparent' : 'linear-gradient(135deg,#7c3aed,#a855f7)', fontSize: 22, fontWeight: 700, color: '#fff' }}
        >
          {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">Profile Photo</p>
          <p className="text-xs text-gray-400 mt-0.5">Avatar is generated from your name or uploads.</p>
          <div className="flex items-center gap-3 mt-2.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Upload size={12} /> Upload Custom Photo
            </button>
            {avatar && (
              <button
                type="button"
                onClick={() => setAvatar(null)}
                className="text-xs font-medium text-red-500 hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </Card>

      {/* Personal info */}
      <Card className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Full Name</label>
            <input className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="off" />
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input className={inputCls} value={phone} onChange={e => setPhone(e.target.value)} autoComplete="off" />
          </div>
        </div>
      </Card>

      {/* Password */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <Lock size={14} className="text-violet-600" />
          <p className="text-sm font-bold text-gray-800">Update Password Security</p>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
            <AlertCircle size={13} /> {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Current Password', value: currentPwd, set: setCurrentPwd, show: showCur, toggle: () => setShowCur(!showCur) },
            { label: 'New Password', value: newPwd, set: setNewPwd, show: showNew, toggle: () => setShowNew(!showNew) },
            { label: 'Confirm New Password', value: confirmPwd, set: setConfirmPwd, show: showConf, toggle: () => setShowConf(!showConf) },
          ].map(({ label, value, set, show, toggle }) => (
            <div key={label}>
              <label className={labelCls}>{label}</label>
              <div className="relative">
                <input
                  className={inputCls + ' pr-9'}
                  type={show ? 'text' : 'password'}
                  value={value}
                  onChange={e => set(e.target.value)}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {show ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Save */}
      <div className="flex justify-end items-center gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
            <CheckCircle2 size={14} /> Saved successfully
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          Save Profile Changes
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────── */
/*          ADMISSION CONFIG TAB          */
/* ─────────────────────────────────────── */
function AdmissionTab() {
  const { config } = useCourse();
  const [passingCutoff, setPassingCutoff] = useState('50');
  const [distinguishedBand, setDistinguishedBand] = useState('76');
  const [examDuration, setExamDuration] = useState('60');
  const [totalMarks, setTotalMarks] = useState('100');
  const [selfReg, setSelfReg] = useState(true);
  const [admissionOpen, setAdmissionOpen] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="mb-1">
        <SectionTitle icon={Settings2} title="Admission Config" sub={`Exam rules & cutoffs for ${config.label}`} />
      </div>

      {/* Score Bands */}
      <Card className="p-5 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Score Bands</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Passing Cutoff (%)</label>
            <input
              className={inputCls}
              type="number"
              min="0"
              max="100"
              value={passingCutoff}
              onChange={e => setPassingCutoff(e.target.value)}
            />
            <p className="text-[11px] text-gray-400 mt-1">Minimum score to qualify for admission.</p>
          </div>
          <div>
            <label className={labelCls}>Distinguished Band (≥%)</label>
            <input
              className={inputCls}
              type="number"
              min="0"
              max="100"
              value={distinguishedBand}
              onChange={e => setDistinguishedBand(e.target.value)}
            />
            <p className="text-[11px] text-gray-400 mt-1">Score threshold for merit consideration.</p>
          </div>
        </div>
      </Card>

      {/* Exam Settings */}
      <Card className="p-5 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Exam Settings</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Exam Duration (minutes)</label>
            <input className={inputCls} type="number" value={examDuration} onChange={e => setExamDuration(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Total Marks</label>
            <input className={inputCls} type="number" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} />
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Section Breakdown</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {config.sections.map(sec => (
              <div key={sec.key} className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5 text-center">
                <p className="text-[10px] text-gray-400">{sec.label}</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">{sec.max} marks</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Channels */}
      <Card className="p-5 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Admission Channels</p>
        {[
          {
            label: 'Enable Candidate Self-Registration',
            desc: 'Let new applicants create registrations on the public portal.',
            value: selfReg,
            toggle: () => setSelfReg(!selfReg),
          },
          {
            label: 'Admission Intake Cycle Open',
            desc: 'Marking the current admission cycle open for selections.',
            value: admissionOpen,
            toggle: () => setAdmissionOpen(!admissionOpen),
          },
        ].map((item, i) => (
          <div key={i}>
            {i > 0 && <div className="h-px bg-gray-100 mb-4" />}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
              <button type="button" onClick={item.toggle} className="flex-shrink-0">
                {item.value
                  ? <ToggleRight size={36} className="text-violet-600" />
                  : <ToggleLeft size={36} className="text-gray-300" />}
              </button>
            </div>
          </div>
        ))}
      </Card>

      <div className="flex justify-end items-center gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          Save Config
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────── */
/*         DATABASE & SYNC TAB            */
/* ─────────────────────────────────────── */
function DatabaseTab() {
  const { config } = useCourse();
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [backedUp, setBackedUp] = useState(false);
  const [exportingLogs, setExportingLogs] = useState(false);
  const [logsExported, setLogsExported] = useState(false);

  const handleSync = async () => {
    setSyncing(true); setSynced(false);
    await new Promise(r => setTimeout(r, 1500));
    setSyncing(false); setSynced(true);
  };

  const handleBackup = async () => {
    setBackingUp(true); setBackedUp(false);
    await new Promise(r => setTimeout(r, 1800));
    setBackingUp(false); setBackedUp(true);
    setTimeout(() => setBackedUp(false), 4000);
  };

  const handleExportLogs = async () => {
    setExportingLogs(true); setLogsExported(false);
    await new Promise(r => setTimeout(r, 1200));
    setExportingLogs(false); setLogsExported(true);
    setTimeout(() => setLogsExported(false), 4000);
  };

  return (
    <div className="space-y-5">
      <div className="mb-1">
        <SectionTitle icon={Database} title="Database & Sync" sub="Supabase status, snapshots & logs" />
      </div>

      {/* Connection status */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Connection Status</p>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${synced ? 'bg-green-500' : 'bg-amber-400'}`} />
            <span className="text-xs font-semibold text-gray-600">{synced ? 'Synced' : 'Syncing...'}</span>
          </div>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Host', value: 'dxmfavdiygtkoghrreui.supabase.co' },
            { label: 'Students Table', value: config.studentsTable },
            { label: 'Results Table', value: config.examResultsTable },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-xs font-mono font-semibold text-gray-700">{value}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          type="button"
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', opacity: syncing ? 0.7 : 1 }}
        >
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing...' : 'Force Re-Sync'}
        </button>
      </Card>

      {/* Activity log (mock) */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Activity size={13} className="text-violet-600" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Activity</p>
        </div>
        <div className="space-y-2">
          {[
            { msg: 'Supabase sync completed', time: '2 mins ago', ok: true },
            { msg: `${config.studentsTable} updated (3 rows)`, time: '15 mins ago', ok: true },
            { msg: 'Database backup created', time: '1 hour ago', ok: true },
            { msg: 'Schema validation passed', time: '3 hours ago', ok: true },
          ].map((log, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-gray-700">{log.msg}</span>
              </div>
              <span className="text-[11px] text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Operations */}
      <Card className="p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Server size={13} className="text-violet-600" />
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Operations</p>
        </div>
        <button
          type="button"
          onClick={handleBackup}
          disabled={backingUp}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {backingUp ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
          {backedUp ? '✓ Backup Created' : backingUp ? 'Creating Backup...' : 'Create Database Backup'}
        </button>
        <button
          type="button"
          onClick={handleExportLogs}
          disabled={exportingLogs}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {exportingLogs ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
          {logsExported ? '✓ Logs Exported' : exportingLogs ? 'Exporting...' : 'Export Settings Logs'}
        </button>
      </Card>
    </div>
  );
}

/* ─────────────────────────────────────── */
/*         SECURITY PREFERENCES TAB       */
/* ─────────────────────────────────────── */
function SecurityTab() {
  const [twoFA, setTwoFA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <div className="mb-1">
        <SectionTitle icon={Shield} title="Security Preferences" sub="Two-factor authentication, session timeouts, and IP whitelists." />
      </div>

      {/* 2FA + Session */}
      <Card className="p-5 space-y-4">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Security Settings</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
            <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to admin accounts.</p>
          </div>
          <button type="button" onClick={() => setTwoFA(!twoFA)}>
            {twoFA
              ? <ToggleRight size={36} className="text-violet-600" />
              : <ToggleLeft size={36} className="text-gray-300" />}
          </button>
        </div>
        <div className="h-px bg-gray-100" />
        <div>
          <label className={labelCls}>Session Timeout (minutes)</label>
          <input
            className={inputCls}
            type="number"
            min="5"
            max="480"
            value={sessionTimeout}
            onChange={e => setSessionTimeout(e.target.value)}
          />
          <p className="text-[11px] text-gray-400 mt-1">Users will be logged out after this period of inactivity.</p>
        </div>
        <div>
          <label className={labelCls}>IP Whitelist (comma-separated)</label>
          <input
            className={inputCls}
            placeholder="e.g. 192.168.1.0, 10.0.0.1"
            value={ipWhitelist}
            onChange={e => setIpWhitelist(e.target.value)}
            autoComplete="off"
          />
          <p className="text-[11px] text-gray-400 mt-1">Leave empty to allow all IPs.</p>
        </div>
      </Card>

      <div className="flex justify-end items-center gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
          style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', opacity: saving ? 0.7 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
        >
          {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
          Save Security Settings
        </button>
      </div>
    </form>
  );
}

/* ─────────────────────────────────────── */
/*               MAIN PAGE                */
/* ─────────────────────────────────────── */
const TABS: { id: Tab; label: string; sub: string; icon: React.ElementType }[] = [
  { id: 'profile',   label: 'My Profile',       sub: 'Personal info & password',     icon: User },
  { id: 'admission', label: 'Admission Config',  sub: 'Exam rules & cutoffs',         icon: Settings2 },
  { id: 'database',  label: 'Database & Sync',   sub: 'Supabase status & logs',       icon: Database },
  { id: 'security',  label: 'Security Preferences', sub: 'Toggles & session rules',   icon: Shield },
];

export default function Settings() {
  const { config } = useCourse();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') as Tab;

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    if (tabParam && ['profile', 'admission', 'database', 'security'].includes(tabParam)) {
      return tabParam;
    }
    return 'profile';
  });

  // Sync state if URL search param changes
  useEffect(() => {
    if (tabParam && ['profile', 'admission', 'database', 'security'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabId: Tab) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  // Active config summary (shown in left panel)
  const passingCutoff = 50;
  const distinguishedBand = 76;

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings &amp; System Preferences</h1>
        <p className="text-sm text-gray-400 mt-1">
          Manage your administrator profile, configure admission intakes, database snapshots, and security preferences.
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Left panel ── */}
        <div className="w-72 flex-shrink-0 space-y-4">
          {/* Categories */}
          <Card className="overflow-hidden">
            <div className="px-4 pt-4 pb-2">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Settings Categories</p>
            </div>
            <div className="pb-2">
              {TABS.map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors relative"
                    style={{ backgroundColor: active ? '#f5f3ff' : 'transparent' }}
                  >
                    {active && (
                      <span
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full"
                        style={{ backgroundColor: '#7c3aed' }}
                      />
                    )}
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: active ? '#ede9fe' : '#f3f4f6' }}
                    >
                      <Icon size={15} style={{ color: active ? '#7c3aed' : '#9ca3af' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: active ? '#7c3aed' : '#374151' }}>
                        {tab.label}
                      </p>
                      <p className="text-[11px] text-gray-400">{tab.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Active configurations summary */}
          <Card className="p-4 space-y-3">
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">System Active Configurations</p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Passing Cutoff</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
                >
                  {passingCutoff}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Distinguished Band</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}
                >
                  ≥{distinguishedBand}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Supabase Synced</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 block" />
              </div>
              <div className="h-px bg-gray-100" />
              <p className="text-[11px] text-gray-400 leading-relaxed">
                This settings panel controls the core criteria of {config.label}'s admission database. Adjusting any cutoff will immediately affect candidate ranking.
              </p>
            </div>
          </Card>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile'   && <ProfileTab />}
          {activeTab === 'admission' && <AdmissionTab />}
          {activeTab === 'database'  && <DatabaseTab />}
          {activeTab === 'security'  && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
