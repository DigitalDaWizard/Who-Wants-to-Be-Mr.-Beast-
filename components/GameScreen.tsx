import React, { useState, useEffect, useRef } from 'react';
import { Question, LifelineState, GameConfig } from '../types';
import LifelinePanel from './LifelinePanel';
import MoneyLadder from './MoneyLadder';
import TriviaCard from './TriviaCard';
import LifelineModal, { LifelineType } from './LifelineModal';
import { audioService } from '../services/audioService';

interface Props {
  question: Question;
  currentLevel: number;
  winnings: number;
  lifelines: LifelineState;
  onAnswer: (index: number) => void;
  onUseLifeline: (type: keyof LifelineState) => void;
  onTimeOut: () => void;
  config: GameConfig;
}

interface ModalState {
  type: LifelineType;
  data: any;
}

const GameScreen: React.FC<Props> = ({ 
  question, 
  currentLevel, 
  winnings, 
  lifelines, 
  onAnswer, 
  onUseLifeline, 
  onTimeOut,
  config
}) => {
  const [removedIndices, setRemovedIndices] = useState<number[]>([]);
  const [audienceHint, setAudienceHint] = useState<number[] | null>(null);
  const [friendHint, setFriendHint] = useState<string | null>(null);
  
  // Modal State
  const [modalState, setModalState] = useState<ModalState | null>(null);
  
  // Answer Flow State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'processing' | 'correct' | 'wrong'>('idle');

  // Timer State
  const [timeLeft, setTimeLeft] = useState(config.timeLimit);
  const timerRef = useRef<number | null>(null);

  // Audio: Start Tension Loop on Mount
  useEffect(() => {
    audioService.play('tension', true);
    return () => {
      audioService.stop('tension');
    };
  }, []);

  // Formatting Helper
  const formatSubs = (val: number) => {
    if (val >= 1000000) return `${val / 1000000}M`;
    if (val >= 1000) return `${val / 1000}K`;
    return val;
  };

  // Reset local state when question changes
  useEffect(() => {
    setRemovedIndices([]);
    setAudienceHint(null);
    setFriendHint(null);
    setTimeLeft(config.timeLimit);
    setModalState(null);
    setSelectedOption(null);
    setAnswerStatus('idle');
  }, [question, config.timeLimit]);

  // Timer Logic
  useEffect(() => {
    // Stop timer if modal is open OR answer is being processed
    if (modalState || answerStatus !== 'idle') {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        return;
    }

    // Start/Resume Timer
    timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                if (timerRef.current) clearInterval(timerRef.current);
                onTimeOut();
                return 0;
            }
            return prev - 1;
        });
    }, 1000);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question, onTimeOut, modalState, answerStatus]); 

  // Audio Tick Effect - Plays when time changes and is low
  useEffect(() => {
     if (timeLeft <= 10 && timeLeft > 0 && !modalState && answerStatus === 'idle') {
        audioService.play('tick');
     }
  }, [timeLeft, modalState, answerStatus]);

  // Handle Option Click
  const handleOptionSelect = (index: number) => {
      if (answerStatus !== 'idle') return;

      // 1. Lock in
      audioService.play('click');
      setSelectedOption(index);
      setAnswerStatus('processing');

      // 2. Wait 1s then Reveal
      setTimeout(() => {
          const isCorrect = index === question.correctAnswerIndex;
          if (isCorrect) {
              audioService.play('correct');
              setAnswerStatus('correct');
          } else {
              audioService.play('wrong');
              setAnswerStatus('wrong');
          }

          // 3. Wait 1.5s then Notify App
          setTimeout(() => {
              onAnswer(index);
          }, 1500);

      }, 1000);
  };

  const handleUseLifeline = (type: keyof LifelineState) => {
    if (answerStatus !== 'idle') return; // Cannot use lifeline if answered
    
    // Play Lifeline Specific Sound
    if (type === 'fiftyFifty') audioService.play('cut');
    else if (type === 'phoneAFriend') audioService.play('phone');
    else if (type === 'askAudience') audioService.play('audience');
    else audioService.play('lifeline');

    // 1. Calculate Data based on type
    let data: any = null;

    if (type === 'fiftyFifty') { // Cut the Clip
      // We don't need data for the modal, but we calculate indices to remove for AFTER
      const correct = question.correctAnswerIndex;
      const incorrectIndices = [0, 1, 2, 3].filter(i => i !== correct);
      const shuffled = incorrectIndices.sort(() => 0.5 - Math.random());
      data = [shuffled[0], shuffled[1]]; // Passed as data to keep logic consistent
    } else if (type === 'askAudience') { // Ask Comments
      const votes = [0, 0, 0, 0];
      const correct = question.correctAnswerIndex;
      let accuracy = 0.8;
      if (question.difficulty === 'medium') accuracy = 0.6;
      if (question.difficulty === 'hard') accuracy = 0.4;

      const remaining = 100 - (accuracy * 100);
      votes[correct] = accuracy * 100;
      for (let i = 0; i < 4; i++) {
        if (i !== correct) votes[i] = remaining / 3;
      }
      const noisyVotes = votes.map(v => Math.max(0, Math.floor(v + (Math.random() * 10 - 5))));
      data = noisyVotes;
    } else if (type === 'phoneAFriend') { // Call Editor
        const correct = question.correctAnswerIndex;
        const opts = ["A", "B", "C", "D"];
        const isCorrectHint = Math.random() < config.friendAccuracy;
        
        let msg = "";
        if (isCorrectHint) {
            msg = `I'm pretty sure it's ${opts[correct]}!`;
        } else {
            const wrongIndices = [0, 1, 2, 3].filter(i => i !== correct);
            const wrongGuess = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
            msg = `It's definitely ${opts[wrongGuess]}. I saw a video about this!`;
        }
        if (config.friendAccuracy < 0.5) msg += " ...but honestly, I might be wrong.";
        data = msg;
    }

    // 2. Open Modal with Data
    setModalState({ type: type as LifelineType, data });
  };

  const handleModalClose = () => {
    if (!modalState) return;

    // 3. Apply Effects and Disable Lifeline
    const { type, data } = modalState;

    if (type === 'fiftyFifty') {
       setRemovedIndices(data);
    } else if (type === 'askAudience') {
       setAudienceHint(data);
    } else if (type === 'phoneAFriend') {
       setFriendHint(data);
    }

    // Disable the button in parent state
    onUseLifeline(type); // This updates App.tsx state

    // Close modal (Resumes timer via useEffect)
    setModalState(null);
  };

  const timerPercentage = (timeLeft / config.timeLimit) * 100;
  let timerColor = 'text-green-400';
  let borderColor = 'border-green-400';
  if (timerPercentage < 50) { timerColor = 'text-beast-yellow'; borderColor = 'border-beast-yellow'; }
  if (timerPercentage < 20) { timerColor = 'text-red-600'; borderColor = 'border-red-600'; }

  // Determine category label
  let categoryLabel = '🎥 Trending Topic';
  if (question.category) {
      categoryLabel = `🎥 ${question.category}`;
  } else if (question.difficulty === 'hard') {
      categoryLabel = '🔥 Extreme Chaos';
  }

  return (
    <div className="flex flex-col lg:flex-row w-full h-full max-h-screen p-2 md:p-4 gap-4 relative">
      
      {/* Modal / Effect Overlay */}
      {modalState && (
        <LifelineModal 
            type={modalState.type} 
            data={modalState.data} 
            onClose={handleModalClose} 
        />
      )}

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col relative mt-2 md:mt-0 max-w-4xl mx-auto w-full">
        
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 bg-slate-900/80 p-4 rounded-2xl border-2 border-slate-700 backdrop-blur-sm z-10">
           {/* Chaos Points */}
           <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Chaos Points</span>
              <span className="text-2xl md:text-4xl font-black text-beast-pink text-shadow">
                {formatSubs(winnings)} <span className="text-sm md:text-lg text-white">SUBS</span>
              </span>
           </div>

           {/* Timer Circle */}
           <div className={`relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-4 ${borderColor} bg-slate-900 shadow-lg`}>
                <div className="flex flex-col items-center">
                   <span className={`text-xl md:text-2xl font-black ${timerColor}`}>{timeLeft}</span>
                </div>
           </div>

           {/* Question Count */}
           <div className="flex flex-col items-end">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Question</span>
              <span className="text-2xl md:text-4xl font-black text-beast-blue text-shadow">
                 {currentLevel + 1}<span className="text-lg text-slate-500">/{config.questionCount}</span>
              </span>
           </div>
        </div>

        {/* Question Area */}
        <div className="flex-grow flex flex-col justify-center relative z-0">
            {/* Category Badge */}
            <div className="self-center mb-4">
               <span className="bg-slate-800 text-beast-yellow px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-600">
                  {categoryLabel}
               </span>
            </div>

            <TriviaCard 
                question={question} 
                removedIndices={removedIndices}
                onOptionSelect={handleOptionSelect}
                selectedOption={selectedOption}
                answerStatus={answerStatus}
                audienceHint={audienceHint}
                friendHint={friendHint}
            />
        </div>

        {/* Lifelines Bar */}
        <div className="mt-4 md:mt-8 z-10">
            <LifelinePanel 
                lifelines={lifelines} 
                onUse={handleUseLifeline} 
                allowedLifelines={config.allowedLifelines}
            />
        </div>
      </div>

      {/* Chaos Points Ladder Sidebar */}
      <div className="hidden lg:block w-72 h-full pt-4 sticky top-4 z-0">
         <MoneyLadder currentLevel={currentLevel} totalLevels={config.questionCount} />
      </div>
    </div>
  );
};

export default GameScreen;