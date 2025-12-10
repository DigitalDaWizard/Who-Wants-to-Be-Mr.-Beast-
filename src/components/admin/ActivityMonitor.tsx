import React from 'react';
import { Activity, Download, Filter, Brain, PenTool, User } from 'lucide-react';

const ActivityMonitor = () => {
  const activities = [
    { id: 1, type: 'writer', user: 'Alice', action: 'Generated Blog Post', time: '2 mins ago', icon: PenTool, color: 'text-blue-400' },
    { id: 2, type: 'system', user: 'System', action: 'Daily Backup Completed', time: '15 mins ago', icon: Activity, color: 'text-green-400' },
    { id: 3, type: 'humanizer', user: 'Bob', action: 'Processed 500 words', time: '1 hour ago', icon: Brain, color: 'text-purple-400' },
    { id: 4, type: 'auth', user: 'Charlie', action: 'Failed Login Attempt', time: '2 hours ago', icon: User, color: 'text-red-400' },
  ];

  return (
    <div className="p-6 ml-64 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-bold">Activity Monitor</h2>
           <p className="text-slate-400">Real-time system events and usage logs.</p>
        </div>
        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors">
                <Download size={16} /> Export CSV
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Feed */}
         <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Live Feed
            </h3>
            <div className="space-y-6">
                {activities.map(activity => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                        <div className={`p-3 rounded-full bg-slate-900 border border-slate-800 ${activity.color}`}>
                            <activity.icon size={20} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-white">{activity.action}</span>
                                <span className="text-xs text-slate-500 font-mono">{activity.time}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-1">
                                User: <span className="text-slate-300">{activity.user}</span> • Type: <span className="uppercase text-xs">{activity.type}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* Stats */}
         <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <h3 className="text-lg font-bold mb-4">Usage Today</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">AI Tokens</span>
                            <span className="text-blue-400 font-bold">84%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[84%]"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Server Load</span>
                            <span className="text-green-400 font-bold">32%</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[32%]"></div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ActivityMonitor;