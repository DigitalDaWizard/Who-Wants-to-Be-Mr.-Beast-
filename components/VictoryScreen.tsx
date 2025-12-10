import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Share2, Star } from 'lucide-react';

interface Props {
  winnings: number;
  onRestart: () => void;
}

const VictoryScreen: React.FC<Props> = ({ winnings, onRestart }) => {
  const [displaySubs, setDisplaySubs] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Fireworks / Confetti
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // 2. Counting Animation
    let start = 0;
    const end = winnings;
    if (start === end) return;

    // Use a slightly ease-out approach conceptually or just linear
    const totalDuration = 2000;
    const incrementTime = 20; // update every 20ms
    const step = Math.ceil(end / (totalDuration / incrementTime));

    const timer = setInterval(() => {
        start += step;
        if (start > end) {
            start = end;
            clearInterval(timer);
        }
        setDisplaySubs(start);
    }, incrementTime);

    return () => {
        clearInterval(interval);
        clearInterval(timer);
    };
  }, [winnings]);

  const formatSubs = (val: number) => {
    if (val >= 1000000) {
        const m = (val / 1000000).toFixed(1).replace('.0', '');
        return `${m}M`;
    }
    if (val >= 1000) {
        const k = (val / 1000).toFixed(1).replace('.0', '');
        return `${k}K`;
    }
    return val.toString();
  };

  const handleShare = () => {
      const text = `I just became the next Mr. Beast with ${formatSubs(winnings)} Subs! 🏆 Can you beat me? #MrBeastChallenge`;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6 relative overflow-hidden bg-beast-navy">
        {/* Background glow */}
        <div className="absolute inset-0 bg-beast-gold opacity-10 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none"></div>
        <div className="absolute top-10 left-10 text-beast-yellow animate-bounce-short opacity-50"><Star size={40} /></div>
        <div className="absolute bottom-10 right-10 text-beast-pink animate-bounce-short opacity-50" style={{ animationDelay: '0.5s'}}><Star size={60} /></div>
        
      <div className="z-10 flex flex-col items-center w-full max-w-4xl">
        <div className="bg-beast-gold p-6 rounded-full mb-6 shadow-[0_0_50px_rgba(255,215,0,0.8)] animate-bounce-short">
             <Trophy size={64} className="text-black" />
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-beast-gold to-yellow-200 text-shadow-lg tracking-tighter uppercase mb-4 leading-tight">
          YOU'RE THE NEXT<br/>MR. BEAST!
        </h1>
        
        <p className="text-xl md:text-2xl text-beast-teal font-bold mb-8 uppercase tracking-widest">
            YOU BROKE THE ALGORITHM!
        </p>

        <div className="bg-black/60 backdrop-blur-md p-10 rounded-3xl border-4 border-beast-gold shadow-2xl mb-12 transform hover:scale-105 transition-transform duration-500 w-full md:w-auto">
          <div className="text-6xl md:text-9xl font-black text-white text-shadow-lg tracking-tight tabular-nums">
            {formatSubs(displaySubs)} <span className="text-3xl text-beast-gold">SUBS</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            <button
            onClick={onRestart}
            className="bg-beast-blue text-white px-10 py-5 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-blue-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(14,165,233,0.6)] transition-all shadow-lg"
            >
            PLAY AGAIN
            </button>
            
            <button
            onClick={handleShare}
            className="bg-beast-pink text-white px-10 py-5 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-pink-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all shadow-lg flex items-center justify-center gap-3"
            >
             <Share2 /> {copied ? "COPIED!" : "SHARE"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;