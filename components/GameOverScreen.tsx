import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  winnings: number;
  onRestart: () => void;
  correctAnswer: string;
}

const GameOverScreen: React.FC<Props> = ({ winnings, onRestart, correctAnswer }) => {
  const formatSubs = (val: number) => {
    if (val >= 1000000) return `${val / 1000000}M`;
    if (val >= 1000) return `${val / 1000}K`;
    return val;
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center p-6 animate-shake">
       {/* Red Flash Overlay */}
       <div className="absolute inset-0 bg-beast-danger pointer-events-none animate-flash z-50"></div>
       
      <div className="mb-8 transform rotate-3 z-10">
        <h1 className="text-6xl md:text-9xl font-black text-beast-danger text-shadow-lg tracking-tighter uppercase mb-4">
          WRONG!
        </h1>
        <div className="flex items-center justify-center gap-2 text-2xl text-white font-bold uppercase tracking-widest bg-black/40 p-4 rounded-xl backdrop-blur-sm">
           <AlertTriangle className="text-beast-yellow" />
           <span>Correct Answer:</span>
        </div>
        <p className="text-beast-teal text-xl md:text-3xl font-black mt-2 bg-black/60 inline-block px-6 py-2 rounded-lg">
           {correctAnswer}
        </p>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border-4 border-slate-700 shadow-2xl mb-12 w-full max-w-md z-10">
        <p className="text-gray-400 text-sm uppercase font-bold mb-2">You leave with</p>
        <div className="text-5xl font-black text-beast-gold text-shadow">
          {formatSubs(winnings)} <span className="text-2xl text-white">SUBS</span>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="z-10 group flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black text-xl hover:bg-gray-200 transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
      >
        <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" />
        TRY AGAIN
      </button>
    </div>
  );
};

export default GameOverScreen;