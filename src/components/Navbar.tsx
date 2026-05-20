import React from 'react';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-border sticky top-0 z-10 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-6 flex-1">
        <h2 className="text-xl font-bold text-text-primary hidden md:block">Overview</h2>
        
        <div className="relative max-w-md w-full ml-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <Input 
            className="pl-10 bg-background border-transparent focus:bg-white" 
            placeholder="Search students, applications..."
          />
        </div>
      </div>

      <div className="flex items-center gap-5 ml-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background cursor-pointer hover:bg-border/50 transition-colors">
          <span className="text-sm font-medium text-text-primary">2026-2027</span>
          <ChevronDown size={14} className="text-text-secondary" />
        </div>

        <button className="p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-full transition-colors">
          <Sun size={20} />
        </button>

        <button className="relative p-2 text-text-secondary hover:text-text-primary hover:bg-background rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-px bg-border mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">Admin User</p>
            <p className="text-xs text-text-secondary">Admission Head</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary-gradientStart flex items-center justify-center text-white font-bold shadow-soft">
            AU
          </div>
        </div>
      </div>
    </header>
  );
}
