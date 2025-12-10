export interface Question {
  questionText: string;
  options: string[];
  correctAnswerIndex: number; // 0-3
  difficulty: 'easy' | 'medium' | 'hard';
  category?: string;
}

export interface LifelineState {
  fiftyFifty: boolean;
  phoneAFriend: boolean;
  askAudience: boolean;
}

export type ScreenState = 'SPLASH' | 'DIFFICULTY' | 'GAME' | 'GAME_OVER' | 'VICTORY';

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD' | 'IMPOSSIBLE';

export interface GameConfig {
  label: string;
  questionCount: number;
  timeLimit: number; // seconds
  allowedLifelines: (keyof LifelineState)[];
  friendAccuracy: number; // 0 to 1
  description: string;
}

export interface GameState {
  currentLevel: number; // 0 to 14
  winnings: number;
  isGameOver: boolean;
}