import React from 'react';
import { LifelineState } from '../types';
import { Users, Phone, Scissors } from 'lucide-react';
import { audioService } from '../services/audioService';

interface Props {
  lifelines: LifelineState;
  allowedLifelines: (keyof LifelineState)[];
  onUse: (type: keyof LifelineState) => void;
}

const LifelinePanel: React.FC<Props> = ({ lifelines, allowedLifelines, onUse }) => {
  
  const handleClick = (type: keyof LifelineState) => {
    onUse(type);
  }

  return (
    <div className="grid grid-cols-3 gap-3 md:gap-6 w-full max-w-3xl mx-auto">
      {/* Cut the Clip (50:50) */}
      <LifelineButton 
        icon={<Scissors className="w-5 h-5 md:w-8 md:h-8" />}
        label="CUT THE CLIP"
        available={lifelines.fiftyFifty}
        visible={allowedLifelines.includes('fiftyFifty')}
        onClick={() => handleClick('fiftyFifty')}
        color="bg-beast-pink"
      />
      
      {/* Call Editor (Phone a Friend) */}
      <LifelineButton 
        icon={<Phone className="w-5 h-5 md:w-8 md:h-8" />}
        label="CALL EDITOR"
        available={lifelines.phoneAFriend}
        visible={allowedLifelines.includes('phoneAFriend')}
        onClick={() => handleClick('phoneAFriend')}
        color="bg-beast-blue"
      />
      
      {/* Ask Comments (Audience) */}
      <LifelineButton 
        icon={<Users className="w-5 h-5 md:w-8 md:h-8" />}
        label="ASK COMMENTS"
        available={lifelines.askAudience}
        visible={allowedLifelines.includes('askAudience')}
        onClick={() => handleClick('askAudience')}
        color="bg-beast-yellow text-black"
      />
    </div>
  );
};

interface ButtonProps {
  icon: React.ReactNode;
  label: string;
  available: boolean;
  visible: boolean;
  onClick: () => void;
  color: string;
}

const LifelineButton: React.FC<ButtonProps> = ({ icon, label, available, visible, onClick, color }) => {
  if (!visible) {
      return (
          <div className="flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border-2 border-dashed border-gray-800 opacity-20">
             <div className="w-8 h-8 rounded-full bg-gray-800 mb-2"></div>
             <div className="h-2 w-16 bg-gray-800 rounded"></div>
          </div>
      );
  }

  return (
    <button
      onClick={onClick}
      disabled={!available}
      className={`
        relative flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border-b-4 border-black/30
        transition-all duration-200 active:border-b-0 active:translate-y-1
        ${available 
          ? `${color} hover:brightness-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]` 
          : 'bg-gray-800 text-gray-500 cursor-not-allowed border-none'}
         ${available && color.includes('text-black') ? 'text-black' : (available ? 'text-white' : '')}
      `}
    >
      <div className="mb-1 md:mb-2">{icon}</div>
      <span className={`text-[10px] md:text-sm font-black italic tracking-wider ${!available ? 'line-through decoration-2' : ''}`}>
        {label}
      </span>
      {!available && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
         </div>
      )}
    </button>
  );
};

export default LifelinePanel;