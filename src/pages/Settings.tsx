import React, { useState } from 'react';
import {
  Shield, Server, Database, Sparkles, RefreshCw, Save, CheckCircle2, Sliders, ToggleLeft, ToggleRight
} from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function Settings() {
  const { config } = useCourse();
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
      {/* Header */}
      <Card>
        <CardHeader className="flex-row items-center gap-2.5 border-b border-border pb-4">
          <Sparkles size={17} className="text-primary" />
          <div>
            <CardTitle className="text-base font-bold text-foreground">System Configurations ({config.label})</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Configure admission rules, exam monitoring preferences, and access permissions.</p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main forms */}
        <div className="space-y-6 lg:col-span-2">
          {/* Exam Settings */}
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sliders size={15} className="text-primary" />
                <CardTitle className="text-sm font-bold">Exam Settings</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Exam Duration (Minutes)</Label>
                    <Input
                      type="number"
                      value={examDuration}
                      onChange={e => setExamDuration(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Total Exam Marks</Label>
                    <Input
                      type="number"
                      value={totalMarks}
                      onChange={e => setTotalMarks(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Sectional Breakdowns (Marks/Sec)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center text-xs">
                    {config.sections.map(sec => (
                      <div key={sec.key} className="p-3 border border-border rounded-xl bg-muted">
                        <p className="text-[10px] text-muted-foreground">{sec.label}</p>
                        <p className="font-bold text-foreground mt-1">{sec.max} marks</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  {saved && (
                    <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
                      <CheckCircle2 size={13} /> Saved successfully
                    </span>
                  )}
                  <Button type="submit" size="sm" disabled={saving} className="gap-1.5 text-xs">
                    {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Admission Channels */}
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Server size={15} className="text-primary" />
                <CardTitle className="text-sm font-bold">Admission Channels</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-foreground">Enable Candidate Self-Registration</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Let new applicants create registrations on the public portal.</p>
                </div>
                <button type="button" onClick={() => setSelfReg(!selfReg)}>
                  {selfReg
                    ? <ToggleRight size={36} className="text-primary" />
                    : <ToggleLeft size={36} className="text-muted-foreground" />
                  }
                </button>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-foreground">Admission Intake Cycle Open</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Marking the current admission cycle open for selections.</p>
                </div>
                <button type="button" onClick={() => setAdmissionOpen(!admissionOpen)}>
                  {admissionOpen
                    ? <ToggleRight size={36} className="text-primary" />
                    : <ToggleLeft size={36} className="text-muted-foreground" />
                  }
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Access & DB */}
        <div className="space-y-6">
          {/* User Roles */}
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Shield size={15} className="text-primary" />
                <CardTitle className="text-sm font-bold">User Roles & Access</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {[
                { role: 'Super Admin', desc: 'Full configuration access & user control' },
                { role: 'Admission Coordinator', desc: 'Process applications, update results' },
                { role: 'Reviewer', desc: 'Assess candidate profiles, submit feedback' },
                { role: 'Staff Member', desc: 'General verification & details check' },
              ].map((u, i, arr) => (
                <div key={u.role}>
                  <div className="flex justify-between items-start py-1">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{u.role}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{u.desc}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">Active</Badge>
                  </div>
                  {i < arr.length - 1 && <Separator className="mt-2" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Database Operations */}
          <Card>
            <CardHeader className="border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Database size={15} className="text-primary" />
                <CardTitle className="text-sm font-bold">Database Operations</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="text-[10px] text-muted-foreground space-y-2">
                <p>Connected to <span className="font-mono font-semibold text-primary">dxmfavdiygtkoghrreui.supabase.co</span></p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="font-mono text-[9px]">{config.studentsTable}</Badge>
                  <Badge variant="outline" className="font-mono text-[9px]">{config.examResultsTable}</Badge>
                </div>
                <p className="leading-relaxed">Export full schema structures, back up student logs, or download transactional logs.</p>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-xs h-9"
                  onClick={() => alert(`PostgreSQL DB Snapshot Backup successful for ${config.label}.`)}
                >
                  Create Database Backup
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-xs h-9"
                  onClick={() => alert('Exporting application verification logs...')}
                >
                  Export Settings Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
