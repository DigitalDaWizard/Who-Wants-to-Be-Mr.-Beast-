import React, { useState } from 'react';
import { X, Check, Save, Plus } from 'lucide-react';
import { Question } from '../types';
import { saveCustomQuestion } from '../services/customQuestionService';
import { audioService } from '../services/audioService';

interface Props {
  onClose: () => void;
}

const CATEGORIES = [
  "YouTube Chaos",
  "Charity or Clickbait",
  "Insane Challenges",
  "Beast History",
  "Custom"
];

const QuestionEditorModal: React.FC<Props> = ({ onClose }) => {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  const handleOptionChange = (idx: number, val: string) => {
    const newOpts = [...options];
    newOpts[idx] = val;
    setOptions(newOpts);
  };

  const handleSave = () => {
    // Validation
    if (!questionText.trim()) return;
    if (options.some(opt => !opt.trim())) return;

    audioService.play('click');
    const newQuestion: Question = {
      questionText,
      options,
      correctAnswerIndex: correctIndex,
      difficulty,
      category
    };

    const success = saveCustomQuestion(newQuestion);
    if (success) {
      audioService.play('correct');
      setShowToast(true);
      // Reset form slightly to allow rapid entry, or close? 
      // User likely wants to add multiple. Let's clear fields.
      setTimeout(() => {
          setShowToast(false);
          setQuestionText('');
          setOptions(['', '', '', '']);
          setCorrectIndex(0);
      }, 1500);
    } else {
        audioService.play('wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border-4 border-beast-pink w-full max-w-2xl rounded-3xl relative flex flex-col shadow-2xl animate-fade-in my-8">
        
        {/* Header */}
        <div className="bg-slate-800 p-6 rounded-t-2xl border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-2xl font-black italic uppercase text-white tracking-wider flex items-center gap-2">
               <Plus className="text-beast-pink" /> Create Chaos Question
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
               <X className="text-gray-400 hover:text-white" />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar max-h-[70vh]">
            
            {/* Question Text */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-beast-blue uppercase tracking-widest">Question Text</label>
                <textarea 
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="e.g. How many cars did we blow up?"
                    className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl p-4 text-white focus:border-beast-yellow focus:outline-none transition-colors font-bold"
                    rows={3}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl p-3 text-white focus:border-beast-yellow outline-none font-bold"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Difficulty</label>
                    <select 
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                        className="w-full bg-slate-950 border-2 border-slate-700 rounded-xl p-3 text-white focus:border-beast-yellow outline-none font-bold"
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
            </div>

            {/* Answers */}
            <div className="space-y-4">
                <label className="text-sm font-bold text-beast-pink uppercase tracking-widest">Answer Options</label>
                <div className="grid grid-cols-1 gap-3">
                    {options.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <button 
                                onClick={() => {
                                    audioService.play('click');
                                    setCorrectIndex(idx);
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-black transition-all ${
                                    correctIndex === idx 
                                    ? 'bg-green-500 border-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.6)]' 
                                    : 'border-slate-600 text-slate-600 hover:border-gray-400'
                                }`}
                            >
                                {String.fromCharCode(65 + idx)}
                            </button>
                            <input 
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                className={`flex-1 bg-slate-950 border-2 rounded-xl p-3 text-white focus:outline-none transition-colors font-semibold ${
                                    correctIndex === idx ? 'border-green-500/50' : 'border-slate-700 focus:border-beast-pink'
                                }`}
                            />
                            {correctIndex === idx && <Check className="text-green-500" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 p-6 rounded-b-2xl border-t border-slate-700 flex justify-end gap-4">
            <button 
                onClick={onClose}
                className="px-6 py-3 font-bold text-gray-400 hover:text-white transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleSave}
                className="px-8 py-3 bg-beast-green-gradient bg-green-500 hover:bg-green-400 text-black font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
                <Save size={20} /> Add Question
            </button>
        </div>

        {/* Toast Notification */}
        {showToast && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 animate-bounce-short z-50">
                <Check size={20} /> QUESTION SAVED!
            </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditorModal;