import React from 'react';
import { Trophy, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';

const QuestManager = () => {
  const quests = [
    { id: 1, title: 'First Article', description: 'Generate your first article using AI', reward: 50, active: true, completions: 120 },
    { id: 2, title: 'Power User', description: 'Generate 10000 words in a month', reward: 500, active: true, completions: 15 },
    { id: 3, title: 'Social Sharer', description: 'Share a generated post on Twitter', reward: 25, active: false, completions: 45 },
  ];

  return (
    <div className="p-6 ml-64 bg-slate-950 min-h-screen text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-bold">Quest Manager</h2>
           <p className="text-slate-400">Gamification and reward settings.</p>
        </div>
        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-lg font-bold transition-colors">
            <Plus size={18} /> Create Quest
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quests.map(quest => (
              <div key={quest.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative group hover:border-purple-500/50 transition-colors">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"><Edit2 size={16} /></button>
                      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
                  </div>
                  
                  <div className="mb-4">
                      <div className="w-12 h-12 bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-700 mb-4">
                          <Trophy className="text-purple-400" />
                      </div>
                      <h3 className="text-xl font-bold">{quest.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{quest.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <div className="flex flex-col">
                          <span className="text-xs text-slate-500 uppercase font-bold">Reward</span>
                          <span className="text-yellow-400 font-bold">{quest.reward} XP</span>
                      </div>
                      <div className="flex flex-col items-end">
                          <span className="text-xs text-slate-500 uppercase font-bold">Completions</span>
                          <span className="text-white font-bold">{quest.completions}</span>
                      </div>
                  </div>

                  <div className={`absolute top-4 left-4 w-3 h-3 rounded-full ${quest.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
          ))}
      </div>
    </div>
  );
};

export default QuestManager;