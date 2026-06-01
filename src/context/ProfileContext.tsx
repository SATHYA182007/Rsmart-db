import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/lib/supabase';

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string | null; // base64 data URL or null
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Admin User',
  email: 'admin@rsmart.in',
  phone: '+919876543210',
  role: 'Admin',
  avatar: null,
};

interface ProfileContextType {
  profile: UserProfile;
  saveProfile: (updates: Partial<UserProfile>) => Promise<void>;
  loading: boolean;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

function getProfileFromUser(user: any): UserProfile {
  if (!user) return DEFAULT_PROFILE;
  return {
    fullName: user.user_metadata?.full_name || 'Admin User',
    email: user.email || 'admin@rsmart.in',
    phone: user.user_metadata?.phone || '+919876543210',
    role: user.user_metadata?.role || 'Admin',
    avatar: user.user_metadata?.avatar || null,
  };
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(() => getProfileFromUser(user));
  const [loading, setLoading] = useState(false);

  // Sync profile state whenever user changes (e.g. login, logout, update)
  useEffect(() => {
    setProfile(getProfileFromUser(user));
  }, [user]);

  const saveProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setLoading(true);

    // Update state locally first for instant UI response
    setProfile(prev => ({ ...prev, ...updates }));

    // Persist to Supabase auth user_metadata
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: updates.fullName !== undefined ? updates.fullName : user.user_metadata?.full_name,
        phone: updates.phone !== undefined ? updates.phone : user.user_metadata?.phone,
        role: updates.role !== undefined ? updates.role : user.user_metadata?.role,
        avatar: updates.avatar !== undefined ? updates.avatar : user.user_metadata?.avatar,
      }
    });

    if (error) {
      console.error('Failed to update profile metadata in Supabase:', error);
    }
    setLoading(false);
  }, [user]);

  return (
    <ProfileContext.Provider value={{ profile, saveProfile, loading }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}
