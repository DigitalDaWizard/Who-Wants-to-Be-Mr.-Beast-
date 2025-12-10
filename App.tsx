import React, { useState, useCallback, useEffect } from 'react';
import { Question, ScreenState, LifelineState, DifficultyLevel } from './types';
import { generateQuestions } from './services/geminiService';
import { INITIAL_LIFELINES, SUBS_LADDER, DIFFICULTY_CONFIGS } from './constants';
import { audioService } from './services/audioService';
import SplashScreen from './components/SplashScreen';
import DifficultyScreen from './components/DifficultyScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import VictoryScreen from './components/VictoryScreen';
import { Volume2, VolumeX } from 'lucide-react';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenState>('SPLASH');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [lifelines, setLifelines] = useState<LifelineState>(INITIAL_LIFELINES);
  const [winnings, setWinnings] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // New state for difficulty
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('EASY');

  // Initialize Audio
  useEffect(() => {
    audioService.preload();
  }, []);

  useEffect(() => {
    audioService.setMute(isMuted);
  }, [isMuted]);

  const playSound = useCallback((type: 'intro' | 'correct' | 'wrong' | 'win' | 'tension' | 'click' | 'checkpoint' | 'tick' | 'lifeline' | 'bg') => {
    if (type === 'win') audioService.play('victory');
    else audioService.play(type);
  }, []);

  const goToDifficultySelection = () => {
    setScreen('DIFFICULTY');
  };

  const startGame = async (selectedDifficulty: DifficultyLevel) => {
    playSound('click');
    setIsLoading(true);
    setError(null);
    setDifficulty(selectedDifficulty);

    try {
      const questionsNeeded = DIFFICULTY_CONFIGS[selectedDifficulty].questionCount;
      const fetchedQuestions = await generateQuestions(selectedDifficulty);
      
      setQuestions(fetchedQuestions);
      setCurrentQuestionIndex(0);
      setWinnings(0);
      setLifelines({
        fiftyFifty: true,
        phoneAFriend: true,
        askAudience: true
      });
      
      // Stop ambient, Play Intro
      audioService.stop('bg');
      audioService.play('intro');

      // Short delay for intro to hit before showing game
      setTimeout(() => {
        setScreen('GAME');
        setIsLoading(false); // Done loading
      }, 2000); 

    } catch (err) {
      setError("Failed to generate questions. Please try again.");
      setIsLoading(false);
    }
  };

  const handleAnswer = (selectedIndex: number) => {
    const currentQ = questions[currentQuestionIndex];
    
    // Note: Sounds and delays are now handled in GameScreen. 
    // This function runs AFTER the reveal animation completes.
    
    if (selectedIndex === currentQ.correctAnswerIndex) {
      // Correct
      const newWinnings = SUBS_LADDER[currentQuestionIndex];
      setWinnings(newWinnings);

      // Checkpoint Sound
      if (newWinnings === 5000 || newWinnings === 250000) {
        playSound('checkpoint');
      }
      
      if (currentQuestionIndex + 1 >= questions.length) {
        audioService.stop('tension');
        setScreen('VICTORY');
        playSound('win');
      } else {
         setCurrentQuestionIndex(prev => prev + 1);
      }
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
      audioService.stop('tension');
      // No need to play 'wrong' sound here, GameScreen played it.
      
      // Calculate guaranteed subs (checkpoints)
      let guaranteed = 0;
      if (winnings >= 250000) guaranteed = 250000;
      else if (winnings >= 5000) guaranteed = 5000;
      
      setWinnings(guaranteed);
      setScreen('GAME_OVER');
  };

  const useLifeline = (type: keyof LifelineState) => {
    setLifelines(prev => ({ ...prev, [type]: false }));
  };

  const resetGame = () => {
    playSound('click');
    audioService.stopAll();
    audioService.play('bg');
    setScreen('SPLASH');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setWinnings(0);
    setError(null);
    setIsLoading(false);
  };

  // Derived state for Game Over info
  const currentQ = questions[currentQuestionIndex];
  const correctAnswerText = currentQ ? currentQ.options[currentQ.correctAnswerIndex] : "";

  return (
    <div className="min-h-screen bg-beast-navy text-white flex flex-col items-center justify-center overflow-hidden relative selection:bg-beast-pink selection:text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-beast-blue rounded-full filter blur-[128px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-beast-pink rounded-full filter blur-[128px] mix-blend-screen animate-pulse"></div>
      </div>

      {/* Mute Button (Hidden on Splash as it has its own settings) */}
      {screen !== 'SPLASH' && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-colors"
        >
          {isMuted ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
        </button>
      )}

      {/* Screen Routing */}
      <div className="z-10 w-full max-w-7xl h-full flex flex-col">
        {screen === 'SPLASH' && (
          <SplashScreen 
            onEnter={goToDifficultySelection} 
            isLoading={false}
            error={null} 
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
          />
        )}
        
        {screen === 'DIFFICULTY' && (
           <DifficultyScreen 
              onSelectDifficulty={startGame}
              onBack={() => setScreen('SPLASH')}
              isLoading={isLoading}
           />
        )}
        
        {screen === 'GAME' && questions.length > 0 && (
          <GameScreen 
            question={questions[currentQuestionIndex]}
            currentLevel={currentQuestionIndex}
            winnings={winnings}
            lifelines={lifelines}
            onAnswer={handleAnswer}
            onUseLifeline={useLifeline}
            onTimeOut={handleGameOver}
            config={DIFFICULTY_CONFIGS[difficulty]}
          />
        )}

        {screen === 'GAME_OVER' && (
          <GameOverScreen 
            winnings={winnings} 
            onRestart={resetGame} 
            correctAnswer={correctAnswerText}
          />
        )}

        {screen === 'VICTORY' && (
          <VictoryScreen winnings={winnings} onRestart={resetGame} />
        )}
      </div>
    </div>
  );
};

export default App;