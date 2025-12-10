import React, { useState, useEffect } from 'react';
import { Settings, Volume2, VolumeX, Heart, X, ExternalLink, PlayCircle } from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  onEnter: () => void;
  isLoading: boolean;
  error: string | null;
  isMuted: boolean;
  onToggleMute: () => void;
}

// Background Component - Cleaned up (No falling cash, no lightning images)
const DynamicBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-beast-navy">
      {/* Base Gradient - Deep and Clean */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-beast-blue/20 via-beast-navy to-black"></div>
      
      {/* Subtle pulsing glow in center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-beast-blue/5 rounded-full blur-3xl animate-pulse-fast"></div>
    </div>
  );
};

// Beast Mascot - Eyes Glow, No Lightning
const BeastMascotSVG = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="eye-glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <g transform="translate(10, 10) scale(0.9)">
      {/* Black Outline/Base */}
      <path d="M40 60 Q30 40 50 30 L70 20 L130 20 L150 30 Q180 40 160 60 L170 100 Q180 140 140 170 L100 190 L60 170 Q20 140 30 100 Z" fill="black" stroke="black" strokeWidth="12"/>
      
      {/* Blue Head */}
      <path d="M45 60 Q35 45 50 35 L70 25 L130 25 L150 35 Q175 45 155 65 L165 100 Q170 135 135 160 L100 180 L65 160 Q30 135 35 100 Z" fill="#0EA5E9"/>
      
      {/* Ears */}
      <path d="M50 35 L40 10 L70 25 Z" fill="#0EA5E9" stroke="black" strokeWidth="4" />
      <path d="M150 35 L160 10 L130 25 Z" fill="#0EA5E9" stroke="black" strokeWidth="4" />
      
      {/* Eyes with Glow */}
      <g filter="url(#eye-glow)">
        <path d="M60 70 L90 80 L70 90 Z" fill="white" className="drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
        <path d="M140 70 L110 80 L130 90 Z" fill="white" className="drop-shadow-[0_0_10px_rgba(255,255,255,1)]" />
      </g>
      
      {/* Mouth Area */}
      <path d="M70 120 Q100 110 130 120 L125 150 Q100 160 75 150 Z" fill="white" />
      
      {/* Teeth */}
      <path d="M80 150 L85 140 L90 150" fill="white" stroke="black" strokeWidth="2" />
      <path d="M110 150 L115 140 L120 150" fill="white" stroke="black" strokeWidth="2" />
      
      {/* Pink Lightning Bolt - REMOVED per request */}
    </g>
  </svg>
);

const SplashScreen: React.FC<Props> = ({ onEnter, isLoading, error, isMuted, onToggleMute }) => {
  // State for sequencing: LOADING -> CREDIT -> MENU -> INTRO_SEQUENCE
  const [viewState, setViewState] = useState<'LOADING' | 'CREDIT' | 'MENU' | 'INTRO_SEQUENCE'>('LOADING');
  const [opacity, setOpacity] = useState(1);
  const [introTextIndex, setIntroTextIndex] = useState(0);

  // Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [showDonate, setShowDonate] = useState(false);

  // Wait helper
  const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    const runSequence = async () => {
      // 1. Loading Screen (3.5s)
      await wait(3500);
      
      // Fade Out
      setOpacity(0);
      await wait(600);

      // 2. Dev Credit Screen
      setViewState('CREDIT');
      setOpacity(1);
      await wait(3500);

      // Fade Out
      setOpacity(0);
      await wait(600);

      // 3. Main Menu
      setViewState('MENU');
      setOpacity(1);
      audioService.play('intro');
      audioService.play('bg', true);
    };

    runSequence();
  }, []);

  const handleEnterClick = async () => {
    audioService.play('click');
    setViewState('INTRO_SEQUENCE');
    
    // Intro sequence logic
    const messages = [
        "WELCOME TO THE STUDIO!",
        "THIS IS GOING TO BE INSANE!",
        "I HOPE YOU STUDIED...",
        "LET'S START THE GAME!"
    ];

    // Play each message for 2 seconds (total 8 seconds)
    for (let i = 0; i < messages.length; i++) {
        setIntroTextIndex(i);
        audioService.play('audience'); 
        await wait(2000);
    }

    onEnter();
  };

  const handleDonateClick = () => {
    audioService.play('click');
    setShowDonate(true);
  };

  // --- RENDER: LOADING SCREEN ---
  if (viewState === 'LOADING') {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden transition-opacity duration-500"
        style={{ opacity }}
      >
        <DynamicBackground />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
           {/* Animated Logo Container */}
           <div className="relative w-48 h-48 md:w-96 md:h-96 animate-[bounce-short_2s_infinite]">
             <div className="absolute inset-0 bg-beast-blue blur-[80px] opacity-60 rounded-full animate-pulse"></div>
             <img 
               src="https://i.postimg.cc/KYDcXcDj/image.png" 
               alt="Mr Beast Logo" 
               className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-[shake_4s_ease-in-out_infinite]"
             />
           </div>

           <div className="mt-8 text-center">
             <h1 className="text-4xl md:text-7xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-beast-blue via-white to-beast-pink tracking-tighter">
               MR. BEAST
             </h1>
           </div>
        </div>
      </div>
    );
  }

  // --- RENDER: DEV CREDIT SCREEN ---
  if (viewState === 'CREDIT') {
    return (
      <div 
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden transition-opacity duration-500"
        style={{ opacity }}
      >
        <DynamicBackground />

        <div className="relative z-10 flex flex-col items-center px-4">
            <p className="text-slate-500 text-xs md:text-sm uppercase tracking-[0.3em] font-bold mb-8 animate-fade-in">
                Developed By
            </p>
            
            <div className="relative group">
                <div className="absolute inset-0 bg-white blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 rounded-full"></div>
                <img 
                    src="https://i.postimg.cc/dtQy51rp/DG-logo.png" 
                    alt="DG Logo" 
                    className="w-40 md:w-64 object-contain drop-shadow-2xl animate-[scale-in_1s_ease-out]"
                />
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: INTRO SEQUENCE (Talking Mr. Beast) ---
  if (viewState === 'INTRO_SEQUENCE') {
    const messages = [
        "WELCOME TO THE STUDIO!",
        "THIS IS GOING TO BE INSANE!",
        "I HOPE YOU STUDIED...",
        "LET'S START THE GAME!"
    ];
    
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-beast-navy overflow-hidden">
        <DynamicBackground />
        
        {/* Spotlights */}
        <div className="absolute top-0 left-1/4 w-32 h-[120vh] bg-white opacity-10 rotate-[20deg] blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-[120vh] bg-beast-pink opacity-10 rotate-[-20deg] blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex flex-col items-center animate-scale-in px-4">
            {/* Speech Bubble */}
            <div className="relative bg-white text-black p-6 md:p-8 rounded-3xl rounded-bl-none mb-4 md:mb-8 max-w-sm md:max-w-xl text-center shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-[bounce_1s_infinite]">
                 <h2 className="text-2xl md:text-5xl font-black italic uppercase tracking-tighter leading-tight">
                    {messages[introTextIndex]}
                 </h2>
                 <div className="absolute -bottom-4 left-8 w-0 h-0 border-l-[20px] border-l-transparent border-t-[20px] border-t-white border-r-[20px] border-r-transparent"></div>
            </div>

            {/* Mascot */}
            <div className="w-56 h-56 md:w-80 md:h-80 animate-[shake_2s_infinite]">
                <BeastMascotSVG className="w-full h-full drop-shadow-2xl" />
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN MENU (LANDING) ---
  return (
    <div 
        className="flex flex-col items-center justify-center h-full w-full p-4 text-center overflow-y-auto custom-scrollbar relative transition-opacity duration-1000"
        style={{ opacity }}
    >
      <DynamicBackground />

      {/* Settings Button */}
      <button 
        onClick={() => setShowSettings(true)}
        className="absolute top-6 right-6 z-40 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full border border-slate-600 transition-all hover:scale-110 shadow-lg group"
      >
        <Settings className="text-white group-hover:rotate-90 transition-transform duration-500" />
      </button>

      {/* Main Content Container - Mobile Optimized */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-6xl gap-8 lg:gap-16 z-10 mt-12 md:mt-0">
          
          {/* Left/Top: Logo */}
          <div className="relative group transform transition-transform hover:scale-105 duration-300">
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center relative">
                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter transform -rotate-12 translate-y-2 md:translate-y-4 z-10 mr-[-15px] md:mr-[-20px] bg-gradient-to-r from-beast-blue via-beast-pink to-beast-blue bg-[length:200%_auto] text-transparent bg-clip-text animate-gradient-x drop-shadow-sm text-shadow-lg">
                       MR
                    </h1>
                    
                    <div className="w-28 h-28 md:w-48 md:h-48 z-20 mx-[-8px] md:mx-[-10px] transform hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
                       <BeastMascotSVG className="w-full h-full" />
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter transform rotate-6 translate-y-4 md:translate-y-8 z-10 ml-[-15px] md:ml-[-20px] bg-gradient-to-r from-beast-blue via-beast-pink to-beast-blue bg-[length:200%_auto] text-transparent bg-clip-text animate-gradient-x drop-shadow-sm text-shadow-lg">
                       BEAST
                    </h1>
                </div>
                
                <h2 className="mt-6 md:mt-8 text-xl md:text-3xl font-black text-white bg-black/50 px-6 py-2 rounded-full border-2 border-beast-yellow shadow-[0_0_15px_rgba(250,204,21,0.5)] uppercase tracking-[0.2em] transform -skew-x-12">
                  Trivia Challenge
                </h2>
            </div>
          </div>

          {/* Right/Bottom: Actions */}
          <div className="w-full max-w-sm md:max-w-md animate-fade-in flex flex-col gap-6">
            {error && (
              <div className="text-red-100 bg-red-600/20 p-4 rounded-xl font-bold border border-red-500 backdrop-blur-md">
                {error}
              </div>
            )}

            {/* CTA Button: Pink & White */}
            <button
              onClick={handleEnterClick}
              className="w-full bg-beast-pink text-white font-black text-2xl md:text-3xl py-5 md:py-6 rounded-full border-b-8 border-pink-700 hover:bg-pink-500 hover:scale-105 hover:rotate-1 shadow-[0_0_50px_rgba(236,72,153,0.6)] transition-all uppercase tracking-widest flex items-center justify-center gap-3 group"
            >
              <PlayCircle size={28} className="group-hover:scale-125 transition-transform md:w-8 md:h-8" fill="currentColor" />
              Enter Studio
            </button>

            <button 
               onClick={handleDonateClick}
               className="text-beast-yellow text-xs md:text-sm font-black uppercase tracking-widest animate-bounce hover:scale-110 transition-transform flex items-center justify-center gap-2 bg-black/30 px-4 py-3 rounded-full border border-beast-yellow/30 hover:border-beast-yellow hover:bg-black/50"
             >
               <Heart size={16} fill="currentColor" /> Support the Dev
            </button>
          </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border-4 border-slate-700 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
            <button 
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
                <X size={24} />
            </button>
            
            <h2 className="text-2xl font-black uppercase text-white mb-8 flex items-center gap-2">
                <Settings className="text-beast-blue" /> Settings
            </h2>

            <div className="space-y-4">
                <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isMuted ? <VolumeX className="text-slate-400" /> : <Volume2 className="text-green-400" />}
                        <span className="font-bold text-lg">Sound Effects</span>
                    </div>
                    <button 
                        onClick={() => {
                            audioService.play('click');
                            onToggleMute();
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-colors ${!isMuted ? 'bg-green-500' : 'bg-slate-600'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${!isMuted ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </button>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
                Version 1.0.0 • Chaos Edition
            </div>
          </div>
        </div>
      )}

      {/* DONATION MODAL */}
      {showDonate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-scale-in">
          <div className="bg-gradient-to-br from-slate-900 to-beast-navy border-4 border-beast-yellow w-full max-w-md rounded-3xl p-8 shadow-[0_0_50px_rgba(250,204,21,0.2)] relative text-center">
            <button 
                onClick={() => setShowDonate(false)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
            >
                <X size={24} />
            </button>
            
            <div className="w-20 h-20 bg-beast-yellow rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce-short">
                <Heart size={40} className="text-black" fill="currentColor" />
            </div>

            <h2 className="text-3xl font-black uppercase text-white mb-4 italic tracking-tight">
                Fuel the Madness!
            </h2>
            
            <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
                Your support helps us build <span className="text-beast-blue font-bold">wilder games</span>, 
                <span className="text-beast-pink font-bold"> multiplayer modes</span>, and even bigger challenges!
            </p>

            <a 
                href="https://ko-fi.com/digitalghost8" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full bg-beast-yellow hover:bg-yellow-300 text-black font-black text-xl py-4 rounded-xl shadow-lg hover:scale-105 transition-all uppercase tracking-widest flex items-center justify-center gap-2 group"
            >
                <ExternalLink size={24} className="group-hover:rotate-45 transition-transform" />
                Donate on Ko-fi
            </a>
            
            <p className="mt-4 text-xs text-slate-500 font-bold uppercase tracking-widest">
                Every sub counts!
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default SplashScreen;