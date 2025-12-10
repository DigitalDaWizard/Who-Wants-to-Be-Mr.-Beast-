import React from 'react';
import { Question } from '../types';
import { audioService } from '../services/audioService';

interface Props {
  question: Question;
  removedIndices: number[];
  onOptionSelect: (index: number) => void;
  selectedOption: number | null;
  answerStatus: 'idle' | 'processing' | 'correct' | 'wrong';
  audienceHint: number[] | null;
  friendHint: string | null;
}

const TriviaCard: React.FC<Props> = ({ 
  question, 
  removedIndices, 
  onOptionSelect, 
  selectedOption,
  answerStatus,
  audienceHint, 
  friendHint 
}) => {

  const handleSelect = (index: number) => {
    if (selectedOption !== null) return; // Locked
    if (removedIndices.includes(index)) return; // Removed
    onOptionSelect(index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      {/* Question Box */}
      <div className="relative bg-black border-4 border-beast-blue rounded-2xl p-6 md:p-10 text-center shadow-[0_0_40px_rgba(14,165,233,0.3)]">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white -mt-1 -ml-1"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white -mt-1 -mr-1"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white -mb-1 -ml-1"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white -mb-1 -mr-1"></div>

        <h2 className="text-xl md:text-3xl font-bold text-white leading-relaxed">
          {question.questionText}
        </h2>

        {/* Hints Display - Persists */}
        {friendHint && (
            <div className="mt-6 p-4 bg-green-900/50 border border-green-500 rounded-xl text-green-200 text-sm md:text-base font-medium flex items-center justify-center gap-2 animate-fade-in">
                <span>📞</span>
                <span className="italic">"{friendHint}"</span>
            </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, idx) => {
          const isRemoved = removedIndices.includes(idx);
          const isSelected = selectedOption === idx;
          const isCorrectAnswer = idx === question.correctAnswerIndex;
          
          const votePercentage = audienceHint ? audienceHint[idx] : null;

          // Visual States
          let containerClass = "bg-slate-900 border-slate-600 hover:border-beast-pink hover:bg-slate-800 text-white";
          let badgeClass = "text-beast-pink";
          
          if (isRemoved) {
             containerClass = "opacity-20 pointer-events-none scale-95 blur-[2px] bg-slate-900 border-slate-700";
          } else if (answerStatus === 'processing' && isSelected) {
             // Selected, waiting
             containerClass = "bg-beast-yellow border-white text-black scale-105 z-10 shadow-[0_0_20px_rgba(250,204,21,0.5)] animate-pulse";
             badgeClass = "text-black";
          } else if (answerStatus === 'correct' && isSelected) {
             // Correct!
             containerClass = "bg-green-500 border-white text-black scale-110 z-20 shadow-[0_0_30px_rgba(34,197,94,0.8)] animate-bounce-short";
             badgeClass = "text-black";
          } else if (answerStatus === 'wrong' && isSelected) {
             // Wrong!
             containerClass = "bg-beast-danger border-white text-white scale-95 z-10 shadow-[0_0_20px_rgba(255,71,87,0.5)] animate-shake";
             badgeClass = "text-white";
          } else if (answerStatus === 'wrong' && isCorrectAnswer) {
             // Show Correct Answer after miss
             containerClass = "bg-green-500/50 border-green-400 text-white opacity-80";
             badgeClass = "text-white";
          }

          return (
            <button
              key={idx}
              disabled={isRemoved || selectedOption !== null}
              onClick={() => handleSelect(idx)}
              className={`
                relative group overflow-hidden p-4 md:p-6 rounded-xl border-2 text-left transition-all duration-300
                ${containerClass}
              `}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className={`font-black text-xl ${badgeClass}`}>
                  {String.fromCharCode(65 + idx)}.
                </span>
                <span className="font-semibold text-lg md:text-xl">{option}</span>
              </div>

              {/* Audience Graph Bar (Background) */}
              {votePercentage !== null && !isRemoved && (
                 <div className="absolute bottom-0 left-0 h-full bg-white/10 transition-all duration-1000" style={{ width: `${votePercentage}%` }}></div>
              )}
              {votePercentage !== null && !isRemoved && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-bold text-beast-yellow z-10">
                    {Math.round(votePercentage)}%
                  </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TriviaCard;