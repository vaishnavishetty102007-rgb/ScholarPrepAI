import React, { useState } from 'react';
import { KeyConcept } from '../types';
import { Lightbulb, Volume2, VolumeX, Copy, Check, Sparkles, BookMarked } from 'lucide-react';

interface KeyConceptsSectionProps {
  concepts: KeyConcept[];
}

export const KeyConceptsSection: React.FC<KeyConceptsSectionProps> = ({ concepts }) => {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSpeak = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      if (speakingIndex === index) {
        window.speechSynthesis.cancel();
        setSpeakingIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);

      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-lg">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Key Concepts & Summaries
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                {concepts.length} Core Concepts
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Extracted 3–5 core concepts explained in 2–3 concise sentences in plain language
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Plain language explanations</span>
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((item, index) => (
          <div
            key={index}
            className="group relative bg-white border border-slate-200/90 hover:border-amber-400/80 rounded-2xl p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
          >
            <div>
              {/* Concept Badge & Actions */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-50 text-amber-700 font-bold text-xs border border-amber-200/60">
                    {index + 1}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {item.concept}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => handleSpeak(`${item.concept}. ${item.summary}`, index)}
                    title={speakingIndex === index ? 'Stop audio' : 'Listen with text-to-speech'}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      speakingIndex === index
                        ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100 border-transparent'
                    }`}
                  >
                    {speakingIndex === index ? (
                      <VolumeX className="w-4 h-4 text-amber-700" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(`${item.concept}: ${item.summary}`, index)}
                    title="Copy concept"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-transparent transition-colors cursor-pointer"
                  >
                    {copiedIndex === index ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2-3 Sentences Summary */}
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                {item.summary}
              </p>
            </div>

            {/* Key Takeaway / Memory Hook */}
            {item.keyTakeaway && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-amber-900 bg-amber-50/60 rounded-xl p-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <span className="font-semibold text-amber-800">Key takeaway: </span>
                  <span>{item.keyTakeaway}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
