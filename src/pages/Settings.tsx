import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, Shield, Server, Bell, Database, Lock, Eye, Check,
  Sparkles, RefreshCw, Save, CheckCircle2, Sliders, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function Settings() {
  const [examDuration, setExamDuration] = useState('60');
  const [totalMarks, setTotalMarks] = useState('100');
  const [admissionOpen, setAdmissionOpen] = useState(true);
  const [selfReg, setSelfReg] = useState(true);
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
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-border rounded-xl p-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <h1 className="text-xl font-bold text-text-primary">System Configurations</h1>
          </div>
          <p className="text-xs text-text-secondary mt-1">Configure admission rules, exam monitoring preferences, and access permissions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Navigation Links / Panel */}
        <div className="space-y-4 lg:col-span-2">
          {/* General Config Form */}
          <form onSubmit={handleSave} className="bg-white border border-border rounded-xl p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Sliders size={16} className="text-primary" /> Exam Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Exam Duration (Minutes)</label>
                <input
                  type="number"
                  value={examDuration}
                  onChange={e => setExamDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-text-secondary uppercase mb-1 block">Total Exam Marks</label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={e => setTotalMarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <p className="text-[10px] font-bold text-text-secondary uppercase">Sectional Breakdowns (Marks/Sec)</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {['Section A', 'Section B', 'Section C', 'Section D'].map(sec => (
                  <div key={sec} className="p-2 border border-border rounded-lg bg-background">
                    <p className="text-[10px] text-text-secondary">{sec}</p>
                    <p className="font-bold text-text-primary mt-1">25 marks</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4">
              {saved && (
                <span className="flex items-center gap-1 text-xs text-success font-semibold">
                  <CheckCircle2 size={14} /> Saved successfully
                </span>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition disabled:opacity-75"
              >
                {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          </form>

          {/* Admission portal status toggles */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Server size={16} className="text-primary" /> Admission Channels
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-text-primary">Enable Candidate Self-Registration</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Let new applicants create registrations on the public portal.</p>
                </div>
                <button onClick={() => setSelfReg(!selfReg)} className="text-primary">
                  {selfReg ? <ToggleRight size={38} className="text-primary" /> : <ToggleLeft size={38} className="text-text-secondary" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs border-t border-border pt-4">
                <div>
                  <p className="font-bold text-text-primary">Admission Intake Cycle Open</p>
                  <p className="text-[10px] text-text-secondary mt-0.5">Marking the current admission cycle open for selections.</p>
                </div>
                <button onClick={() => setAdmissionOpen(!admissionOpen)} className="text-primary">
                  {admissionOpen ? <ToggleRight size={38} className="text-primary" /> : <ToggleLeft size={38} className="text-text-secondary" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Access control and backups */}
        <div className="space-y-6">
          {/* User Access Controls */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Shield size={16} className="text-primary" /> User Roles & Access
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { role: 'Super Admin', desc: 'Full configuration access & user control' },
                { role: 'Admission Coordinator', desc: 'Schedule interviews, update results' },
                { role: 'Reviewer', desc: 'Assess candidate profiles, submit feedback' },
                { role: 'Staff Member', desc: 'General verification & details check' },
              ].map(u => (
                <div key={u.role} className="flex justify-between items-start border-b border-border pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-semibold text-text-primary">{u.role}</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">{u.desc}</p>
                  </div>
                  <span className="bg-blue-50 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">Active</span>
                </div>
              ))}
            </div>
          </div>

          {/* Database Backup Strip */}
          <div className="bg-white border border-border rounded-xl p-6 shadow-soft space-y-4">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 pb-2 border-b border-border">
              <Database size={16} className="text-primary" /> Database Operations
            </h3>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              Export full PostgreSQL schema structures, back up student logs, or download transactional logs.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => alert('PostgreSQL DB Snapshot Backup successful.')}
                className="w-full py-2 bg-background border border-border hover:bg-primary/5 hover:text-primary rounded-lg text-xs font-semibold transition"
              >
                Create Database Backup
              </button>
              <button
                onClick={() => alert('Exporting application verification logs...')}
                className="w-full py-2 bg-background border border-border hover:bg-primary/5 hover:text-primary rounded-lg text-xs font-semibold transition"
              >
                Export Settings Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
