import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Database, ChevronRight, Check } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Privacy', icon: Database },
];

const SectionCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5">
    <h3 className="text-base font-bold text-text-primary border-b border-border pb-3">{title}</h3>
    {children}
  </div>
);

const Toggle = ({ label, desc, defaultOn = false }: { label: string; desc: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="font-medium text-text-primary text-sm">{label}</p>
        <p className="text-xs text-text-secondary mt-0.5">{desc}</p>
      </div>
      <button onClick={() => setOn(!on)}
        className={`relative w-11 h-6 rounded-full transition-all ${on ? 'bg-primary' : 'bg-border'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Manage your account preferences and system settings.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 shrink-0 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-text-secondary hover:bg-white hover:text-text-primary border border-transparent hover:border-border'
              }`}>
              <tab.icon size={18} />
              {tab.label}
              <ChevronRight size={14} className="ml-auto opacity-60" />
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}
          className="flex-1 space-y-5">
          
          {activeTab === 'profile' && (
            <>
              <SectionCard title="Profile Information">
                <div className="flex items-center gap-5 pb-4 border-b border-border">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd flex items-center justify-center text-white text-3xl font-bold shadow-soft">
                    AU
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">Admin User</p>
                    <p className="text-sm text-text-secondary">Admission Head</p>
                    <button className="mt-2 text-sm text-primary hover:underline font-medium">Change Photo</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Full Name</Label>
                    <Input defaultValue="Admin User" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Input defaultValue="Admission Head" disabled className="bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input defaultValue="admin@rsmartcollege.edu" type="email" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Mobile</Label>
                    <Input defaultValue="+1 (555) 000-0000" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label>Institution</Label>
                    <Input defaultValue="RSmart College of Technology" />
                  </div>
                </div>
              </SectionCard>
              <SectionCard title="Academic Year">
                <div className="space-y-1.5">
                  <Label>Current Academic Year</Label>
                  <select className="flex h-10 w-full max-w-xs rounded-md border border-border bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <option>2026-2027</option>
                    <option>2025-2026</option>
                    <option>2024-2025</option>
                  </select>
                </div>
              </SectionCard>
            </>
          )}

          {activeTab === 'notifications' && (
            <SectionCard title="Notification Preferences">
              <div className="space-y-4">
                <Toggle label="New Application Alerts" desc="Get notified when a new student applies" defaultOn={true} />
                <Toggle label="Status Change Updates" desc="Get notified when an application is approved or rejected" defaultOn={true} />
                <Toggle label="Weekly Reports" desc="Weekly admission summary via email" defaultOn={false} />
                <Toggle label="System Maintenance" desc="Planned downtime and update notifications" defaultOn={true} />
              </div>
            </SectionCard>
          )}

          {activeTab === 'security' && (
            <SectionCard title="Security Settings">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="pt-2 border-t border-border space-y-4">
                  <Toggle label="Two-Factor Authentication" desc="Add an extra layer of security to your account" />
                  <Toggle label="Session Timeout" desc="Auto logout after 30 minutes of inactivity" defaultOn={true} />
                </div>
              </div>
            </SectionCard>
          )}

          {activeTab === 'appearance' && (
            <SectionCard title="Appearance & Theme">
              <div>
                <p className="text-sm font-medium text-text-primary mb-3">Color Theme</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'Light Blue', from: '#4F8CFF', to: '#7AB8FF', active: true },
                    { name: 'Emerald', from: '#059669', to: '#34D399', active: false },
                    { name: 'Purple', from: '#7C3AED', to: '#A78BFA', active: false },
                  ].map((t) => (
                    <div key={t.name} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${t.active ? 'border-primary shadow-soft' : 'border-border hover:border-primary/40'}`}>
                      <div className="h-12 rounded-lg mb-2" style={{ background: `linear-gradient(135deg, ${t.from}, ${t.to})` }} />
                      <p className="text-xs font-medium text-text-primary">{t.name}</p>
                      {t.active && <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check size={11} className="text-white" /></div>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-border space-y-3">
                <Toggle label="Compact Mode" desc="Reduce spacing for a denser layout" />
                <Toggle label="Animations" desc="Enable micro-animations and transitions" defaultOn={true} />
              </div>
            </SectionCard>
          )}

          {activeTab === 'data' && (
            <SectionCard title="Data & Privacy">
              <div className="space-y-4">
                <Toggle label="Analytics Tracking" desc="Help improve the platform by sharing usage data" defaultOn={true} />
                <Toggle label="Auto-backup" desc="Backup admission data every 24 hours" defaultOn={true} />
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="p-4 rounded-xl bg-background border border-border">
                    <p className="text-sm font-medium text-text-primary mb-1">Data Export</p>
                    <p className="text-xs text-text-secondary mb-3">Download all student and application data as a CSV file</p>
                    <Button variant="outline" size="sm">Export All Data</Button>
                  </div>
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                    <p className="text-sm font-medium text-danger mb-1">Danger Zone</p>
                    <p className="text-xs text-red-600 mb-3">Permanently delete all data for the current academic year</p>
                    <Button variant="danger" size="sm">Delete Year Data</Button>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="flex items-center gap-2 min-w-32">
              {saved ? <><Check size={16} /> Saved!</> : 'Save Changes'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
