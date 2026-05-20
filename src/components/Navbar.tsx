import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, ClipboardList, Calendar, Award,
  BarChart2, Settings, Bell, Search, ChevronDown,
  LogOut, UserCircle, FileText, X, Sparkles
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Applicants', icon: Users, path: '/students' },
  { label: 'Interviews', icon: Calendar, path: '/interviews' },
  { label: 'Scholarships', icon: Award, path: '/scholarships' },
  { label: 'Analytics', icon: BarChart2, path: '/analytics' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

const notifications = [
  { id: 1, type: 'warning', msg: '3 students flagged for malpractice', time: '2m ago' },
  { id: 2, type: 'info', msg: '12 new applications submitted today', time: '15m ago' },
  { id: 3, type: 'success', msg: 'Ram Kannan approved for scholarship', time: '1h ago' },
  { id: 4, type: 'danger', msg: '5 payment dues pending review', time: '2h ago' },
];

const ntColors: Record<string, string> = {
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  danger: 'bg-red-50 border-red-200 text-red-700',
};

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-soft h-[68px] flex items-center px-6">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mr-8 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="text-lg font-bold text-text-primary tracking-tight">RSmart<span className="text-primary">DB</span></span>
      </div>

      {/* Nav Links */}
      <nav className="flex items-center gap-1 flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-background hover:text-text-primary'
              }`
            }
          >
            <item.icon size={16} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-4 shrink-0">
        {/* Search */}
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="relative overflow-hidden"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={15} />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search students, apps..."
                className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary">
                <X size={14} />
              </button>
            </motion.div>
          ) : (
            <button onClick={() => setSearchOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-background hover:text-primary transition-colors">
              <Search size={18} />
            </button>
          )}
        </AnimatePresence>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(v => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-background hover:text-primary transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-xl border border-border shadow-premium z-50 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <p className="text-sm font-semibold text-text-primary">Notifications</p>
                  <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
                </div>
                <div className="divide-y divide-border max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 text-xs border-l-2 ${ntColors[n.type]} m-2 rounded-lg`}>
                      <p className="font-medium">{n.msg}</p>
                      <p className="opacity-70 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(v => !v)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-background transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-gradientStart to-primary-gradientEnd flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-text-primary leading-none">Admin User</p>
              <p className="text-[10px] text-text-secondary mt-0.5">Admission Admin</p>
            </div>
            <ChevronDown size={14} className="text-text-secondary hidden md:block" />
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-border shadow-premium z-50 overflow-hidden"
              >
                {[
                  { icon: UserCircle, label: 'My Profile', action: () => {} },
                  { icon: FileText, label: 'Activity Log', action: () => {} },
                  { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
                ].map(item => (
                  <button key={item.label} onClick={item.action} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-text-primary hover:bg-background transition-colors">
                    <item.icon size={15} className="text-text-secondary" />
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-border">
                  <button onClick={() => navigate('/login')} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors">
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
