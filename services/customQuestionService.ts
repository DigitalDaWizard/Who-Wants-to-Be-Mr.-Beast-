import { Question } from "../types";

const STORAGE_KEY = 'mr_beast_custom_questions';

export const getCustomQuestions = (): Question[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Question[];
  } catch (error) {
    console.error("Failed to load custom questions", error);
    return [];
  }
};

export const saveCustomQuestion = (question: Question): boolean => {
  try {
    const current = getCustomQuestions();
    const updated = [...current, question];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error("Failed to save custom question", error);
    return false;
  }
};