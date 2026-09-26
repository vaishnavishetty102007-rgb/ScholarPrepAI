import React, { useState } from 'react';
import { Header } from './components/Header';
import { StudyMaterialInput } from './components/StudyMaterialInput';
import { KeyConceptsSection } from './components/KeyConceptsSection';
import { PracticeExamSection } from './components/PracticeExamSection';
import { FlashcardsSection } from './components/FlashcardsSection';
import { FullStudyGuideView } from './components/FullStudyGuideView';
import { StudyAidResponse, DifficultyLevel } from './types';
import {
  Lightbulb,
  FileQuestion,
  Layers,
  FileText,
  AlertCircle,
  RefreshCw,
  Sparkles,
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  SlidersHorizontal
} from 'lucide-react';

export default function App() {
  const [studyAid, setStudyAid] = useState<StudyAidResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'concepts' | 'practice' | 'flashcards' | 'full'>('concepts');

  // Keep track of the last submitted payload for quick difficulty re-generation
  const [lastPayload, setLastPayload] = useState<{
    text?: string;
    image?: { mimeType: string; data: string; name?: string };
    difficulty: DifficultyLevel;
  } | null>(null);

  const loadingSteps = [
    'Transcribing & reading study material...',
    'Extracting 3–5 core concepts & plain-language summaries...',
    'Formulating practice exam questions (MCQ, Short Answer, Conceptual Scenario)...',
    'Synthesizing 5–10 flashcards in clean JSON array format...',
  ];

  const handleGenerate = async (payload: {
    text?: string;
    image?: { mimeType: string; data: string; name?: string };
    difficulty: DifficultyLevel;
  }) => {
    setIsLoading(true);
    setError(null);
    setLastPayload(payload);
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
    }, 2200);

    try {
      const response = await fetch('/api/study-aid/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      clearInterval(stepInterval);

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to generate study aid. Please try again.');
      }

      setStudyAid(result.data);
      setActiveTab('concepts');
    } catch (err: any) {
      console.error('Error generating study aid:', err);
      setError(err?.message || 'An unexpected error occurred while communicating with the server.');
    } finally {
      clearInterval(stepInterval);
      setIsLoading(false);
    }
  };

  const handleRegenerateWithDifficulty = (newDifficulty: DifficultyLevel) => {
    if (!lastPayload) return;
    handleGenerate({
      ...lastPayload,
      difficulty: newDifficulty,
    });
  };

  const handlePrint = () => {
    setActiveTab('full');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleReset = () => {
    setStudyAid(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header
        onReset={handleReset}
        onPrint={handlePrint}
        hasActiveStudyAid={!!studyAid}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-rose-900">Processing Error</h4>
              <p className="mt-0.5 text-rose-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* LOADING STATE INDICATOR */}
        {isLoading && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm my-8 space-y-6">
            <div className="relative w-16 h-16 mx-auto">
              <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
              <GraduationCap className="w-7 h-7 text-indigo-600 absolute inset-0 m-auto" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">
                Exam Preparation Assistant at Work
              </h3>
              <p className="text-sm text-indigo-700 font-medium animate-pulse">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>

            <p className="text-xs text-slate-400">
              Applying academic distillation and exam question generation constraints...
            </p>
          </div>
        )}

        {/* MATERIAL INPUT VIEW (when no study aid is active or during loading) */}
        {!studyAid && !isLoading && (
          <div className="space-y-8">
            <StudyMaterialInput onGenerate={handleGenerate} isLoading={isLoading} />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Key Concepts & Summaries
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3–5 core concepts distilled into 2–3 concise sentences using plain, accessible language and auditory read-aloud.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Practice Exam Questions
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Multiple Choice Question (MCQ), Short Answer with high-scoring sample answer, and Conceptual Application Scenario.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-bold text-sm text-slate-900">
                  Interactive Flashcard Deck
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Between 5 and 10 clean JSON flashcards featuring interactive 3D flips, shuffle, and mastery progress tracking.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE STUDY AID DASHBOARD VIEW */}
        {studyAid && !isLoading && (
          <div className="space-y-6">
            {/* Top Bar: Topic Title + Difficulty Calibrator */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                    Topic Study Guide
                  </span>
                  <span className="text-xs text-slate-400">Strictly Source Grounded</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {studyAid.title}
                </h1>
              </div>

              {/* Difficulty Switcher (Radio button style toggle) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Difficulty:</span>
                </span>

                <div className="inline-flex p-1 bg-slate-100 rounded-xl">
                  {(['easy', 'medium', 'hard'] as DifficultyLevel[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleRegenerateWithDifficulty(level)}
                      className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                        studyAid.difficulty === level
                          ? level === 'easy'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : level === 'medium'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-rose-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto no-print">
              <button
                type="button"
                onClick={() => setActiveTab('concepts')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'concepts'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>1. Key Concepts</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {studyAid.keyConcepts.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('practice')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'practice'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileQuestion className="w-4 h-4 text-indigo-600" />
                <span>2. Practice Exam</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                  3 Questions
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('flashcards')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'flashcards'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-violet-600" />
                <span>3. Flashcard Deck</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-violet-100 text-violet-800">
                  {studyAid.flashcards.length} Cards
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('full')}
                className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'full'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Full Study Sheet</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="pt-2">
              {activeTab === 'concepts' && (
                <KeyConceptsSection concepts={studyAid.keyConcepts} />
              )}

              {activeTab === 'practice' && (
                <PracticeExamSection practiceExam={studyAid.practiceExam} />
              )}

              {activeTab === 'flashcards' && (
                <FlashcardsSection flashcards={studyAid.flashcards} />
              )}

              {activeTab === 'full' && (
                <FullStudyGuideView studyAid={studyAid} onPrint={handlePrint} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>ScholarPrep AI • Academic Exam Preparation Assistant</span>
          </p>
          <p className="text-slate-400">
            Strict Material Grounding • Active Retrieval Practice • Zero Hallucination Policy
          </p>
        </div>
      </footer>
    </div>
  );
}
