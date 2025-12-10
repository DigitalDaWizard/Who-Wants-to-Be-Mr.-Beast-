import React, { useState, useEffect } from 'react';
import { Phone, Users, Scissors, X, MessageSquare, User, Loader2 } from 'lucide-react';

export type LifelineType = 'phoneAFriend' | 'askAudience' | 'fiftyFifty';

interface Props {
  type: LifelineType;
  data: any; // Dynamic based on type (string for phone, array for audience)
  onClose: () => void;
}

const LifelineModal: React.FC<Props> = ({ type, data, onClose }) => {
  const [phase, setPhase] = useState<'dialing' | 'connected' | 'cutting'>('dialing');

  // Auto-progress for Phone and Cut sequences
  useEffect(() => {
    if (type === 'phoneAFriend') {
      const timer = setTimeout(() => setPhase('connected'), 2000);
      return () => clearTimeout(timer);
    }
    if (type === 'fiftyFifty') {
      setPhase('cutting');
      const timer = setTimeout(() => onClose(), 1500); // Auto close after cut animation
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  // --- RENDERERS ---

  const renderPhone = () => {
    if (phase === 'dialing') {
      return (
        <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
          <div className="bg-beast-blue p-8 rounded-full shadow-[0_0_50px_rgba(14,165,233,0.5)]">
             <Phone className="w-16 h-16 text-white animate-bounce-short" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-widest text-white">
            Calling Editor...
          </h2>
          <Loader2 className="w-8 h-8 text-beast-yellow animate-spin" />
        </div>
      );
    }

    return (
      <div className="w-full max-w-md bg-slate-800 border-4 border-beast-blue rounded-3xl p-6 relative shadow-2xl animate-fade-in mx-4">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
           <div className="w-24 h-24 bg-beast-dark border-4 border-beast-pink rounded-full flex items-center justify-center overflow-hidden">
              <User size={48} className="text-gray-300" />
           </div>
        </div>
        
        <div className="mt-12 text-center">
           <h3 className="text-beast-pink font-black text-xl uppercase mb-4">THE EDITOR SAYS:</h3>
           <div className="bg-white/10 p-4 rounded-xl relative">
              <MessageSquare className="absolute -top-3 -left-3 text-beast-yellow fill-beast-yellow" size={24}/>
              <p className="text-lg md:text-xl font-bold italic leading-relaxed">
                "{data}"
              </p>
           </div>
           
           <button 
             onClick={onClose}
             className="mt-8 w-full bg-beast-yellow text-black font-black py-4 rounded-xl text-xl hover:scale-105 transition-transform uppercase"
           >
             Continue
           </button>
        </div>
      </div>
    );
  };

  const renderAudience = () => {
    // Fake usernames for flavor
    const users = ["BeastFan99", "Karls_Alt", "FeastablesLover", "Gaming_God_x"];
    const labels = ["A", "B", "C", "D"];
    const maxVal = Math.max(...(data as number[]));

    return (
      <div className="w-full max-w-lg bg-slate-900 border-t-4 md:border-4 border-beast-yellow rounded-t-3xl md:rounded-3xl p-6 shadow-2xl animate-[slide-up_0.3s_ease-out] relative mx-4 mt-auto md:mt-0">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black italic uppercase text-beast-yellow flex items-center gap-2">
                <Users /> Live Poll
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                <X className="text-white" />
            </button>
        </div>

        <div className="space-y-4">
            {(data as number[]).map((pct, idx) => {
                const isWinner = pct === maxVal;
                return (
                    <div key={idx} className="relative">
                        <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                            <span>{labels[idx]} • {users[idx]}</span>
                            <span>{Math.round(pct)}%</span>
                        </div>
                        <div className="h-8 bg-black/50 rounded-full overflow-hidden border border-white/10 relative">
                             <div 
                                className={`h-full ${isWinner ? 'bg-beast-pink' : 'bg-beast-blue'} transition-all duration-1000 ease-out flex items-center justify-end px-3`}
                                style={{ width: `${pct}%` }}
                             >
                             </div>
                        </div>
                    </div>
                );
            })}
        </div>

        <button 
             onClick={onClose}
             className="mt-8 w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-3 rounded-xl uppercase tracking-widest transition-colors"
           >
             Back to Game
        </button>
      </div>
    );
  };

  const renderCut = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[60]">
         {/* Red Slash Line */}
         <div className="absolute top-1/2 left-0 w-full h-2 bg-red-600 shadow-[0_0_20px_red] transform -rotate-12 origin-center animate-slash"></div>
         
         {/* Scissors */}
         <div className="text-white transform animate-snip drop-shadow-[0_0_30px_rgba(0,0,0,1)]">
            <Scissors size={200} fill="silver" />
         </div>
      </div>
    );
  };

  // --- MAIN RENDER ---
  
  if (type === 'fiftyFifty') return renderCut();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      {type === 'phoneAFriend' && renderPhone()}
      {type === 'askAudience' && renderAudience()}
    </div>
  );
};

export default LifelineModal;