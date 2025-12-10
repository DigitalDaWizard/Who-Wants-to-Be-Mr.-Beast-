import { Question, DifficultyLevel } from "../types";
import { TRIVIA_PROMPT_BASE, DIFFICULTY_CONFIGS } from "../constants";
import { getCustomQuestions } from "./customQuestionService";

// Define Puter globally for TypeScript (since it's loaded via script tag)
declare global {
  interface Window {
    puter: any;
  }
}

export const generateQuestions = async (difficulty: DifficultyLevel): Promise<Question[]> => {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const count = config.questionCount;

  // 1. Fetch Custom Questions from Local Storage
  const allCustomQuestions = getCustomQuestions();
  
  // Filter custom questions to match difficulty
  let matchingCustomQs: Question[] = [];
  
  if (difficulty === 'EASY') {
     matchingCustomQs = allCustomQuestions.filter(q => q.difficulty === 'easy');
  } else if (difficulty === 'MEDIUM') {
     matchingCustomQs = allCustomQuestions.filter(q => q.difficulty === 'medium' || q.difficulty === 'easy');
  } else if (difficulty === 'HARD') {
     matchingCustomQs = allCustomQuestions.filter(q => q.difficulty === 'hard' || q.difficulty === 'medium');
  } else {
     // Impossible: take everything, preferably hard
     matchingCustomQs = allCustomQuestions.filter(q => q.difficulty === 'hard');
  }
  
  // Shuffle custom questions
  matchingCustomQs = matchingCustomQs.sort(() => 0.5 - Math.random());
  
  // 2. Fetch AI Questions
  let aiQuestions: Question[] = [];
  
  // Only call API if we still need questions
  if (matchingCustomQs.length < count) {
      const needed = count - matchingCustomQs.length;
      let promptDetail = "";
      
      if (difficulty === 'EASY') {
          promptDetail = `Generate ${needed} questions. Questions 1-4 Easy, 5-8 Medium. Topics: Viral trends, Pop Culture, General Knowledge.`;
      } else if (difficulty === 'MEDIUM') {
          promptDetail = `Generate ${needed} questions. Questions 1-4 Easy, 5-8 Medium, 9-12 Hard. Topics: History, Science, Geography.`;
      } else if (difficulty === 'HARD') {
          promptDetail = `Generate ${needed} questions. Questions 1-5 Easy/Medium, 6-10 Hard, 11-15 Very Hard. Topics: Obscure facts, Specific dates, Complex logic.`;
      } else {
          // Impossible
          promptDetail = `Generate ${needed} questions. Start Medium, quickly ramping to Extremely Hard and Obscure. Topics: Deep Science, Ancient History, Niche Internet Culture.`;
      }

      try {
          if (!window.puter) {
            console.warn("Puter.js not loaded. Returning mock data.");
            throw new Error("Puter not found");
          }

          const fullPrompt = `${TRIVIA_PROMPT_BASE} ${promptDetail} Return only a raw JSON array of objects.`;
          
          const response = await window.puter.ai.chat(fullPrompt);
          
          if (response) {
             // Cleanup Markdown code blocks if Puter adds them
             const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
             aiQuestions = JSON.parse(cleanJson) as Question[];
          }
      } catch (error) {
          console.error("Error fetching questions via Puter:", error);
          aiQuestions = mockQuestions;
      }
  }

  // 3. Merge
  // Strategy: Prepend custom questions to ensure they are seen, fill rest with AI/Mock
  const merged = [...matchingCustomQs, ...aiQuestions];
  
  // Ensure we return exactly 'count' questions (or fewer if we don't have enough, but duplicate mock if needed)
  if (merged.length < count) {
      // Not enough questions, pad with mocks
      const needed = count - merged.length;
      return [...merged, ...mockQuestions.slice(0, needed)];
  }
  
  return merged.slice(0, count);
};

const mockQuestions: Question[] = [
  { questionText: "What represents the letter 'M' in Roman Numerals?", options: ["100", "500", "1000", "1000000"], correctAnswerIndex: 2, difficulty: 'easy', category: "General Knowledge" },
  { questionText: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correctAnswerIndex: 1, difficulty: 'easy', category: "Science" },
  { questionText: "How many bones do sharks have?", options: ["0", "206", "54", "1000"], correctAnswerIndex: 0, difficulty: 'easy', category: "Science" },
  { questionText: "What is the capital of France?", options: ["London", "Berlin", "Madrid", "Paris"], correctAnswerIndex: 3, difficulty: 'easy', category: "Geography" },
  { questionText: "Which chemical element has the symbol 'O'?", options: ["Gold", "Silver", "Oxygen", "Osmium"], correctAnswerIndex: 2, difficulty: 'easy', category: "Science" },
  { questionText: "In what year did the Titanic sink?", options: ["1910", "1912", "1915", "1920"], correctAnswerIndex: 1, difficulty: 'medium', category: "History" },
  { questionText: "What is the largest internal organ in the human body?", options: ["Heart", "Lungs", "Brain", "Liver"], correctAnswerIndex: 3, difficulty: 'medium', category: "Science" },
  { questionText: "Who painted the Mona Lisa?", options: ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"], correctAnswerIndex: 2, difficulty: 'medium', category: "Art" },
  { questionText: "What represents the speed of light?", options: ["e", "c", "v", "lambda"], correctAnswerIndex: 1, difficulty: 'medium', category: "Physics" },
  { questionText: "Which country gifted the Statue of Liberty to the USA?", options: ["France", "UK", "Germany", "Spain"], correctAnswerIndex: 0, difficulty: 'medium', category: "History" },
  { questionText: "What is the only mammal capable of true flight?", options: ["Flying Squirrel", "Bat", "Sugar Glider", "Colugo"], correctAnswerIndex: 1, difficulty: 'hard', category: "Biology" },
  { questionText: "What is the rarest blood type?", options: ["O-", "AB-", "B-", "AB+"], correctAnswerIndex: 1, difficulty: 'hard', category: "Science" },
  { questionText: "Who was the first woman to win a Nobel Prize?", options: ["Marie Curie", "Mother Teresa", "Rosalind Franklin", "Jane Addams"], correctAnswerIndex: 0, difficulty: 'hard', category: "History" },
  { questionText: "What year was the World Wide Web invented?", options: ["1983", "1989", "1991", "1995"], correctAnswerIndex: 1, difficulty: 'hard', category: "Technology" },
  { questionText: "Which element has the highest melting point?", options: ["Carbon", "Tungsten", "Titanium", "Platinum"], correctAnswerIndex: 1, difficulty: 'hard', category: "Chemistry" }
];