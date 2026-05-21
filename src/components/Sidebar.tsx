import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList,
  BarChart2, Settings, GraduationCap, LogOut, Sparkles
} from 'lucide-react';
import { useCourse } from '@/context/CourseContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'Dashboard',    icon: LayoutDashboard, path: '/' },
  { label: 'Applicants',   icon: Users,           path: '/students' },
  { label: 'Exam Results', icon: ClipboardList,   path: '/scholarships' },
  { label: 'Analytics',    icon: BarChart2,       path: '/analytics' },
  { label: 'Settings',     icon: Settings,        path: '/settings' },
];

export default function AppSidebar() {
  const navigate = useNavigate();
  const { config } = useCourse();

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border pb-4 pt-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles size={16} />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-bold font-heading">RSmartDB</span>
            <span className="text-[10px] text-muted-foreground">Admission Intel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Course badge */}
        <SidebarGroup className="pt-2">
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary group-data-[collapsible=icon]:justify-center">
            <GraduationCap size={16} />
            <span className="text-xs font-semibold group-data-[collapsible=icon]:hidden">{config.label}</span>
          </div>
        </SidebarGroup>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton asChild tooltip={item.label}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''
                    }
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border pb-4 pt-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate('/login')}
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
