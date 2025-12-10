'use client';
import React from 'react';
import { Users, Activity, DollarSign, TrendingUp } from 'lucide-react';

export default function DashboardOverview() {
  const stats = [
    { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20' },
    { label: 'Active Sessions', value: '56', change: '+5%', icon: Activity, color: 'text-green-400', bg: 'bg-green-900/20' },
    { label: 'Revenue', value: '$12,400', change: '+18%', icon: DollarSign, color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
    { label: 'Conversion', value: '3.2%', change: '+1.1%', icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-900/20' },
  ];

  return (
    <div className="p-6 ml-64 text-white">
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-green-400 text-sm font-bold bg-green-900/30 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-slate-400 text-sm uppercase font-bold tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-64 flex flex-col justify-center items-center text-slate-500">
           <p>Revenue Chart Placeholder</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl h-64 flex flex-col justify-center items-center text-slate-500">
           <p>User Growth Placeholder</p>
        </div>
      </div>
    </div>
  );
}