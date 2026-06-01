import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

/**
 * Wraps protected routes.
 * - While session is loading → shows a centered spinner so there's no flash.
 * - No session → redirects to /login (replaces history so Back button can't bypass it).
 * - Session present → renders child routes normally.
 */
export default function ProtectedRoute() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F1F3F6' }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-[3px] rounded-full animate-spin"
            style={{ borderColor: '#e5e7eb', borderTopColor: '#7c3aed' }} />
          <p className="text-sm text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
