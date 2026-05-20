import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  GraduationCap,
  LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-gradient-to-b from-primary-gradientStart to-primary-gradientEnd text-white z-20 flex flex-col justify-between">
      <div>
        <div className="p-6 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <GraduationCap size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">RSmart</span>
        </div>

        <nav className="px-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-primary bg-white shadow-soft' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-primary' : ''} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 bg-white rounded-xl shadow-soft -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-6 space-y-4">
        <button 
          onClick={() => navigate('/login')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-white/10 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10"
        >
          <LogOut size={20} />
          <span className="font-medium">Sign Out</span>
        </button>

        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
          <p className="text-sm font-medium mb-1">Need help?</p>
          <p className="text-xs text-white/70 mb-3">Check our docs</p>
          <button className="w-full py-2 bg-white text-primary rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors shadow-sm">
            Documentation
          </button>
        </div>
      </div>
    </aside>
  );
}
