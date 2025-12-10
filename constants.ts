import { LifelineState, DifficultyLevel, GameConfig } from './types';

export const SUBS_LADDER = [
  100,      // Q1
  500,      // Q2
  1000,     // Q3
  2500,     // Q4
  5000,     // Q5 [Checkpoint 1]
  10000,    // Q6
  25000,    // Q7
  50000,    // Q8 [Easy End]
  100000,   // Q9
  250000,   // Q10 [Checkpoint 2]
  500000,   // Q11
  1000000,  // Q12 [Medium End]
  2000000,  // Q13
  5000000,  // Q14
  10000000  // Q15 [Hard/Impossible End]
];

export const INITIAL_LIFELINES: LifelineState = {
  fiftyFifty: true,
  phoneAFriend: true,
  askAudience: true
};

export const DIFFICULTY_CONFIGS: Record<DifficultyLevel, GameConfig> = {
  EASY: {
    label: "EASY",
    questionCount: 8,
    timeLimit: 60,
    allowedLifelines: ['fiftyFifty', 'phoneAFriend', 'askAudience'],
    friendAccuracy: 0.8,
    description: "8 Qs • 60s Timer • All Lifelines"
  },
  MEDIUM: {
    label: "MEDIUM",
    questionCount: 12,
    timeLimit: 45,
    allowedLifelines: ['fiftyFifty', 'phoneAFriend', 'askAudience'],
    friendAccuracy: 0.6,
    description: "12 Qs • 45s Timer • All Lifelines"
  },
  HARD: {
    label: "HARD",
    questionCount: 15,
    timeLimit: 30,
    allowedLifelines: ['fiftyFifty', 'phoneAFriend'],
    friendAccuracy: 0.4,
    description: "15 Qs • 30s Timer • No Comments"
  },
  IMPOSSIBLE: {
    label: "IMPOSSIBLE",
    questionCount: 15,
    timeLimit: 20,
    allowedLifelines: ['fiftyFifty'],
    friendAccuracy: 0, // No AI help effectively
    description: "15 Qs • 20s Timer • Only Cut Clip"
  }
};

// Base prompt - will be augmented in service
export const TRIVIA_PROMPT_BASE = `
You are the game engine for a high-energy "Mr. Beast" style trivia game.
Generate trivia questions with increasing difficulty.
Return ONLY valid JSON.
`;