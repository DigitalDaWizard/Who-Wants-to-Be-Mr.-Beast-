import React from 'react';
import { SUBS_LADDER } from '../constants';

interface Props {
  currentLevel: number;
  totalLevels: number;
}

const MoneyLadder: React.FC<Props> = ({ currentLevel, totalLevels }) => {
  // Use only the first N levels from the master ladder for shorter games
  const activeLadder = SUBS_LADDER.slice(0, totalLevels);
  const ladderReversed = [...activeLadder].reverse();

  const formatSubs = (val: number) => {
    if (val >= 1000000) return `${val / 1000000}M`;
    if (val >= 1000) return `${val / 1000}K`;
    return val;
  };

  return (
    <div className="h-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 flex flex-col shadow-xl overflow-hidden">
      <h3 className="text-center text-beast-yellow font-black italic uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
         Chaos Ladder
      </h3>
      <div className="flex-1 flex flex-col justify-center space-y-1 overflow-y-auto pr-1 custom-scrollbar">
      {ladderReversed.map((amount, index) => {
        const realIndex = totalLevels - 1 - index;
        const isActive = realIndex === currentLevel;
        const isPast = realIndex < currentLevel;
        // Checkpoints at 5K (Q5, index 4) and 250K (Q10, index 9) and Top Prize
        const isCheckpoint = amount === 5000 || amount === 250000 || realIndex === totalLevels - 1;

        return (
          <div 
            key={realIndex}
            className={`
              flex justify-between items-center px-4 py-2 rounded-lg
              text-sm font-bold tracking-wider transition-all duration-300
              ${isActive ? 'bg-beast-pink text-white scale-105 shadow-[0_0_15px_rgba(236,72,153,0.6)] z-10 border border-white' : ''}
              ${isPast ? 'text-green-500 opacity-60' : ''}
              ${!isActive && !isPast ? 'text-white/40' : ''}
              ${isCheckpoint && !isActive && !isPast ? 'text-white' : ''}
            `}
          >
            <span className={`w-6 text-right ${isCheckpoint && !isActive && !isPast ? 'text-beast-yellow' : ''}`}>
                {realIndex + 1}
            </span>
            <span className={`${isCheckpoint && !isActive && !isPast ? 'text-beast-yellow' : ''}`}>
              {formatSubs(amount)} SUBS
            </span>
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default MoneyLadder;