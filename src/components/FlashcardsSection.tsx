import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import {
  Layers,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  Clock,
  Sparkles,
  LayoutGrid,
  Code,
  Copy,
  Check,
  Maximize2
} from 'lucide-react';

interface FlashcardsSectionProps {
  flashcards: Flashcard[];
}

export const FlashcardsSection: React.FC<FlashcardsSectionProps> = ({ flashcards }) => {
  const [cards, setCards] = useState<Flashcard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState<'study' | 'grid' | 'json'>('study');
  const [copiedJSON, setCopiedJSON] = useState(false);

  // Mastery state tracking: set of card indices marked as mastered
  const [masteredSet, setMasteredSet] = useState<Set<number>>(new Set());

  useEffect(() => {
    setCards(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredSet(new Set());
  }, [flashcards]);

  const currentCard = cards[currentIndex] || cards[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setMasteredSet(new Set());
  };

  const toggleMastered = (index: number) => {
    setMasteredSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(flashcards, null, 2));
    setCopiedJSON(true);
    setTimeout(() => setCopiedJSON(false), 2000);
  };

  // Keyboard navigation for power studying (spacebar flips, arrow keys navigate)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'study') return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, isFlipped, cards.length]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-800 flex items-center justify-center font-bold text-lg">
            3
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Flashcard Set
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 font-semibold">
                {cards.length} Cards (5–10 Constraint)
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Clean JSON array parsed into 3D interactive flashcards strictly from material
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('study')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'study'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Study Mode</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>All Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'json'
                ? 'bg-white text-violet-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>JSON Format</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE STUDY MODE (3D FLIP CARD) */}
      {viewMode === 'study' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Progress & Controls Header */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">
                Card {currentIndex + 1} of {cards.length}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-medium">
                {masteredSet.size} Mastered
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                title="Shuffle Flashcards"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 transition-all duration-300 ease-out"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            />
          </div>

          {/* 3D Flashcard Container with Flip Animation */}
          <div
            onClick={handleFlip}
            className="group relative h-80 sm:h-96 w-full cursor-pointer perspective-1000 select-none"
            role="button"
            tabIndex={0}
          >
            <div
              className={`w-full h-full duration-500 transform-style-3d relative transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-white border-2 border-slate-200/90 hover:border-violet-400 p-8 flex flex-col justify-between shadow-md hover:shadow-lg backface-hidden transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-200/60">
                    Front • Question or Term
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click or Space to flip</span>
                  </div>
                </div>

                <div className="my-auto text-center px-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {currentCard.front}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                  <span>Prompt / Term</span>
                  <span className="text-violet-600 font-medium group-hover:underline">
                    Reveal Answer &rarr;
                  </span>
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white p-8 flex flex-col justify-between shadow-md rotate-y-180 backface-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-white/10 text-violet-200 border border-white/10">
                    Back • Definition or Answer
                  </span>
                  <div className="flex items-center gap-1 text-xs text-violet-200">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Click to flip back</span>
                  </div>
                </div>

                <div className="my-auto text-center px-4">
                  <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                    {currentCard.back}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-violet-300 pt-4 border-t border-white/10">
                  <span>Definition / Answer</span>
                  <span className="text-violet-200 font-semibold">&larr; Back to Term</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={() => toggleMastered(currentIndex)}
              className={`py-3 px-5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                masteredSet.has(currentIndex)
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{masteredSet.has(currentIndex) ? 'Mastered!' : 'Mark Mastered'}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 text-[10px]">Space</kbd> to flip, and <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 text-[10px]">&larr;</kbd> <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-700 text-[10px]">&rarr;</kbd> to navigate cards.
          </p>
        </div>
      )}

      {/* VIEW 2: GRID VIEW (ALL CARDS AT A GLANCE) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-violet-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-200/50">
                    Card #{idx + 1}
                  </span>
                  {masteredSet.has(idx) && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Mastered
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900 leading-snug">
                  {card.front}
                </h4>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Answer:
                </span>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {card.back}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: CLEAN JSON FORMAT VIEW */}
      {viewMode === 'json' && (
        <div className="bg-slate-900 rounded-2xl p-6 text-slate-200 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-slate-400 font-sans text-xs">
              Clean JSON Array Format (Exact Schema Specification)
            </span>
            <button
              type="button"
              onClick={handleCopyJSON}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-sans text-slate-200 transition-colors cursor-pointer"
            >
              {copiedJSON ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedJSON ? 'Copied JSON!' : 'Copy JSON'}</span>
            </button>
          </div>

          <pre className="overflow-x-auto p-2 text-emerald-400 leading-relaxed max-h-96">
            {JSON.stringify(flashcards, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
