import React from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <AdminSidebar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}