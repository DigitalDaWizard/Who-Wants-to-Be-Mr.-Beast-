import React from 'react';
import { DifficultyLevel } from '../types';
import { DIFFICULTY_CONFIGS } from '../constants';
import { audioService } from '../services/audioService';
import { Zap, Clock, HelpCircle, ArrowLeft } from 'lucide-react';

interface Props {
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
  isLoading: boolean;
}

const DifficultyScreen: React.FC<Props> = ({ onSelectDifficulty, onBack, isLoading }) => {
  const handleDifficultySelect = (level: DifficultyLevel) => {
    audioService.play('click');
    onSelectDifficulty(level);
  };

  const handleBack = () => {
    audioService.play('click');
    onBack();
  };

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900/80 p-12 backdrop-blur-md">
             <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-8 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-t-beast-pink border-r-beast-blue border-b-beast-yellow border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-white animate-pulse" size={32} fill="currentColor" />
                </div>
             </div>
             <p className="text-3xl font-black text-white animate-pulse tracking-wide text-center">GENERATING CHAOS...</p>
             <p className="text-slate-300 mt-2 font-bold text-lg text-center">AI is cooking up fresh questions</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-4 md:p-8 bg-gradient-to-b from-beast-navy via-slate-900 to-beast-navy overflow-y-auto custom-scrollbar">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-beast-blue/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-beast-pink/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="z-10 w-full max-w-5xl">
        <div className="flex items-center mb-8">
            <button 
                onClick={handleBack}
                className="mr-4 p-2 rounded-full bg-slate-800 border border-slate-700 hover:bg-slate-700 text-white transition-colors"
            >
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
                Select <span className="text-beast-blue">Difficulty</span>
            </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-8">
            {(Object.keys(DIFFICULTY_CONFIGS) as DifficultyLevel[]).map((level) => {
                const config = DIFFICULTY_CONFIGS[level];
                
                let cardStyle = "border-slate-700 bg-slate-800/80";
                let iconColor = "text-slate-400";
                let hoverStyle = "";

                if (level === 'EASY') {
                    cardStyle = "border-green-500/50 bg-slate-800";
                    hoverStyle = "hover:border-green-400 hover:bg-green-900/20 hover:shadow-[0_0_30px_rgba(74,222,128,0.2)]";
                    iconColor = "text-green-400";
                } else if (level === 'MEDIUM') {
                    cardStyle = "border-yellow-500/50 bg-slate-800";
                    hoverStyle = "hover:border-yellow-400 hover:bg-yellow-900/20 hover:shadow-[0_0_30px_rgba(250,204,21,0.2)]";
                    iconColor = "text-yellow-400";
                } else if (level === 'HARD') {
                    cardStyle = "border-red-500/50 bg-slate-800";
                    hoverStyle = "hover:border-red-500 hover:bg-red-900/20 hover:shadow-[0_0_30px_rgba(248,113,113,0.2)]";
                    iconColor = "text-red-500";
                } else if (level === 'IMPOSSIBLE') {
                    cardStyle = "border-purple-500/50 bg-slate-800";
                    hoverStyle = "hover:border-purple-500 hover:bg-purple-900/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]";
                    iconColor = "text-purple-500";
                }

                return (
                    <button
                        key={level}
                        onClick={() => handleDifficultySelect(level)}
                        className={`
                            group relative p-6 md:p-8 rounded-3xl border-4 text-left transition-all duration-300 transform hover:-translate-y-2
                            flex flex-col justify-between min-h-[180px]
                            ${cardStyle} ${hoverStyle}
                        `}
                    >
                        <div className="flex justify-between items-start w-full mb-4">
                            <div>
                                <h2 className={`text-3xl font-black italic tracking-wide mb-2 text-white group-hover:scale-105 transition-transform origin-left`}>
                                    {config.label}
                                </h2>
                                <p className="text-slate-400 text-sm font-bold leading-relaxed pr-8">
                                    {config.description}
                                </p>
                            </div>
                            <div className={`p-3 rounded-full bg-slate-900 border border-slate-700 ${iconColor}`}>
                                <Zap size={24} fill="currentColor" />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-auto">
                            <span className="flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">
                                <HelpCircle size={14} /> {config.questionCount} Questions
                            </span>
                            <span className="flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 rounded-lg bg-black/40 border border-white/5 text-slate-300">
                                <Clock size={14} /> {config.timeLimit}s Timer
                            </span>
                        </div>
                        
                        <div className="mt-3 text-xs text-slate-500 font-bold uppercase tracking-wider">
                           Lifelines: <span className="text-white">{config.allowedLifelines.length > 0 ? config.allowedLifelines.map(l => l === 'fiftyFifty' ? 'Cut' : l === 'phoneAFriend' ? 'Phone' : 'Ask').join(' • ') : 'None'}</span>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default DifficultyScreen;