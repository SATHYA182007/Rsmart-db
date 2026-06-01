import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell, Search, ChevronDown, LogOut, UserCircle,
  FileText, Settings, X, Check, Sparkles, Zap
} from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import { useProfile } from '@/context/ProfileContext';
import { useAuth } from '@/context/AuthContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { supabase } from '@/lib/supabase';
import { useAppData } from '@/hooks/useAppData';

const ntStyles: Record<string, { dot: string; bar: string; text: string }> = {
  warning: { dot: 'bg-amber-400',  bar: 'border-l-amber-400',  text: 'text-amber-700' },
  info:    { dot: 'bg-blue-400',   bar: 'border-l-blue-400',   text: 'text-blue-700'  },
  success: { dot: 'bg-green-400',  bar: 'border-l-green-400',  text: 'text-green-700' },
  danger:  { dot: 'bg-red-400',    bar: 'border-l-red-400',    text: 'text-red-700'   },
};

const COURSES = [
  { value: 'bba',          label: 'BBA'            },
  { value: 'engineering',  label: 'Engineering'    },
  { value: 'arts_science', label: 'Arts & Science' },
  { value: 'mba',          label: 'MBA'            },
  { value: 'mca',          label: 'MCA'            },
] as const;

export default function Topbar() {
  const { currentCourse, setCurrentCourse, config } = useCourse();
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen]             = useState(false);
  const [searchQuery, setSearchQuery]           = useState('');
  const [notifOpen, setNotifOpen]               = useState(false);
  const [profileOpen, setProfileOpen]           = useState(false);
  const [courseOpen, setCourseOpen]             = useState(false);

  const notifRef   = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const courseRef  = useRef<HTMLDivElement>(null);

  const { students, examResults, reload } = useAppData();

  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rsmart_read_notifs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markRead = (id: string) => {
    setReadNotifIds(prev => {
      const next = [...prev, id];
      localStorage.setItem('rsmart_read_notifs', JSON.stringify(next));
      return next;
    });
  };

  const markAllRead = (allIds: string[]) => {
    setReadNotifIds(prev => {
      const next = Array.from(new Set([...prev, ...allIds]));
      localStorage.setItem('rsmart_read_notifs', JSON.stringify(next));
      return next;
    });
  };

  // Compile real highlighted notifications directly from Database Data
  const realNotifications = useMemo(() => {
    const list: any[] = [];

    // 1. Add all Malpractice results (Critical Alert Alerts)
    examResults
      .filter(r => r.status === 'Malpractice')
      .forEach(r => {
        const student = students.find(s => s.id === r.student_id);
        const name = student?.name ?? 'Unknown';
        const id = `malpractice-${r.id}`;
        list.push({
          id,
          type: 'danger',
          msg: `Malpractice flagged for applicant "${name}" on ${config.label} Exam!`,
          time: 'Active Alert',
          isRead: readNotifIds.includes(id),
        });
      });

    // 2. Add all High Score approvals (Scholarships) - Score >= 76 (Distinguished Band)
    examResults
      .filter(r => (r.total_score || 0) >= 76)
      .forEach(r => {
        const student = students.find(s => s.id === r.student_id);
        const name = student?.name ?? 'Unknown';
        const id = `scholarship-${r.id}`;
        list.push({
          id,
          type: 'success',
          msg: `Applicant "${name}" approved for scholarship (Distinguished Band: ${r.total_score}/100)!`,
          time: 'High Score Approval',
          isRead: readNotifIds.includes(id),
        });
      });

    // 3. Add all pending student registrations (Info Alerts)
    students.forEach(s => {
      const hasExam = examResults.some(r => r.student_id === s.id);
      if (!hasExam) {
        const id = `pending-${s.id}`;
        list.push({
          id,
          type: 'info',
          msg: `New applicant "${s.name}" from ${s.city || 'local area'} registered, pending exam completion.`,
          time: 'Pending Registration',
          isRead: readNotifIds.includes(id),
        });
      }
    });

    return list;
  }, [students, examResults, readNotifIds, config.label]);

  const unreadCount = realNotifications.filter(n => !n.isRead).length;

  // Realtime Supabase Replication: Reload app data immediately on insert/update/delete!
  useEffect(() => {
    const studentChannel = supabase
      .channel('notif-db-students')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: config.studentsTable },
        () => {
          console.log('Realtime database change on students table - reloading...');
          reload();
        }
      )
      .subscribe();

    const examChannel = supabase
      .channel('notif-db-exams')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: config.examResultsTable },
        () => {
          console.log('Realtime database change on exams table - reloading...');
          reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(studentChannel);
      supabase.removeChannel(examChannel);
    };
  }, [config.studentsTable, config.examResultsTable, reload]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current   && !notifRef.current.contains(e.target as Node))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (courseRef.current  && !courseRef.current.contains(e.target as Node))  setCourseOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dropdownClass = 'absolute z-50 bg-white rounded-xl border border-border shadow-premium overflow-hidden';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-border flex items-center gap-3 px-4 h-14 shrink-0">
      
      {/* Sidebar Toggle */}
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:bg-muted" />

      {/* Search */}
      <AnimatePresence initial={false}>
        {searchOpen ? (
          <motion.div
            key="search-open"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="relative overflow-hidden flex-shrink-0"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search students, results..."
              className="w-full h-9 pl-8 pr-8 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0"
            />
            <button
              onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={13} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="search-icon"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex-shrink-0"
          >
            <Search size={17} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Course switcher */}
      <div className="relative flex-shrink-0" ref={courseRef}>
        <button
          onClick={() => setCourseOpen(v => !v)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all border border-border bg-muted/50 text-foreground hover:bg-muted"
        >
          <Sparkles size={12} />
          {config.label}
          <ChevronDown size={12} className={`transition-transform duration-150 ${courseOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {courseOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className={`${dropdownClass} right-0 top-10 w-44 py-1`}
            >
              {COURSES.map(c => (
                <button
                  key={c.value}
                  onClick={() => { setCurrentCourse(c.value); setCourseOpen(false); }}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  style={currentCourse === c.value ? { background: 'var(--muted)' } : {}}
                >
                  {c.label}
                  {currentCourse === c.value && <Check size={12} className="text-foreground" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border flex-shrink-0" />

      {/* Notifications */}
      <div className="relative flex-shrink-0" ref={notifRef}>
        <button
          onClick={() => setNotifOpen(v => !v)}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
          )}
        </button>
        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className={`${dropdownClass} right-0 top-11`}
              style={{ width: '340px' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gray-50/50">
                <div>
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  {unreadCount > 0 && (
                    <p className="text-[10px] text-violet-600 font-semibold">{unreadCount} unread</p>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => markAllRead(realNotifications.map(n => n.id))}
                    disabled={unreadCount === 0}
                    className="text-xs font-semibold text-primary cursor-pointer hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline"
                  >
                    Mark all read
                  </button>
                </div>
              </div>
              <div className="divide-y divide-border max-h-80 overflow-y-auto">
                {realNotifications.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">
                    No new alerts or notifications.
                  </div>
                ) : (
                  realNotifications.map(n => {
                    const s = ntStyles[n.type];
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`flex items-start gap-3 px-4 py-3.5 hover:bg-muted transition-colors cursor-pointer relative group ${!n.isRead ? 'bg-violet-50/10' : ''}`}
                      >
                        {!n.isRead && (
                          <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-3 rounded bg-violet-600" />
                        )}
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs ${!n.isRead ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>{n.msg}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Profile */}
      <div className="relative flex-shrink-0" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(v => !v)}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors"
        >

          {/* Avatar circle */}
          {(() => {
            const initials = profile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
            return (
              <div
                className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden text-[11px] font-bold text-white"
                style={{ background: profile.avatar ? 'transparent' : 'linear-gradient(135deg,#7c3aed,#a855f7)' }}
              >
                {profile.avatar
                  ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : initials}
              </div>
            );
          })()}

          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-foreground leading-none">{profile.fullName}</p>
          </div>
          <ChevronDown size={12} className="text-muted-foreground hidden sm:block" />
        </button>
        <AnimatePresence>
          {profileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.12 }}
              className={`${dropdownClass} right-0 top-11 w-48 py-1`}
            >
              {[
                { icon: UserCircle, label: 'My Profile',   action: () => { setProfileOpen(false); navigate('/settings?tab=profile'); } },
                { icon: Settings,   label: 'Settings',     action: () => { setProfileOpen(false); navigate('/settings?tab=admission'); } },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                >
                  <item.icon size={14} className="text-muted-foreground" />
                  {item.label}
                </button>
              ))}
              <div className="border-t border-border mt-1 pt-1">
                <button
                  onClick={async () => { await signOut(); navigate('/login'); }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
