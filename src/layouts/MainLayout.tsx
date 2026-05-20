import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-[68px] min-h-screen">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
