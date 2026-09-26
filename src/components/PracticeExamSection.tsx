import React, { useState } from 'react';
import { PracticeExam, AnswerEvaluation } from '../types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff,
  Send,
  Check,
  AlertTriangle,
  Lightbulb,
  FileQuestion
} from 'lucide-react';

interface PracticeExamSectionProps {
  practiceExam: PracticeExam;
}

export const PracticeExamSection: React.FC<PracticeExamSectionProps> = ({ practiceExam }) => {
  const { mcq, shortAnswer, conceptualApplication } = practiceExam;

  // MCQ State
  const [selectedMCQOption, setSelectedMCQOption] = useState<number | null>(null);
  const [hasSubmittedMCQ, setHasSubmittedMCQ] = useState(false);

  // Short Answer State
  const [studentShortAnswer, setStudentShortAnswer] = useState('');
  const [showModelShortAnswer, setShowModelShortAnswer] = useState(false);
  const [evaluatingShortAnswer, setEvaluatingShortAnswer] = useState(false);
  const [shortAnswerFeedback, setShortAnswerFeedback] = useState<AnswerEvaluation | null>(null);

  // Conceptual Application State
  const [studentConceptualAnswer, setStudentConceptualAnswer] = useState('');
  const [showConceptualAnswer, setShowConceptualAnswer] = useState(false);
  const [evaluatingConceptual, setEvaluatingConceptual] = useState(false);
  const [conceptualFeedback, setConceptualFeedback] = useState<AnswerEvaluation | null>(null);

  // Handle MCQ
  const handleSelectMCQ = (index: number) => {
    if (!hasSubmittedMCQ) {
      setSelectedMCQOption(index);
    }
  };

  const handleCheckMCQ = () => {
    if (selectedMCQOption !== null) {
      setHasSubmittedMCQ(true);
    }
  };

  const handleResetMCQ = () => {
    setSelectedMCQOption(null);
    setHasSubmittedMCQ(false);
  };

  // Evaluate Short Answer
  const handleEvaluateShortAnswer = async () => {
    if (!studentShortAnswer.trim() || evaluatingShortAnswer) return;
    setEvaluatingShortAnswer(true);
    try {
      const res = await fetch('/api/study-aid/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: shortAnswer.question,
          sampleAnswer: shortAnswer.sampleHighScoringAnswer,
          studentAnswer: studentShortAnswer,
          rubricPoints: shortAnswer.rubricPoints,
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setShortAnswerFeedback(data.evaluation);
        setShowModelShortAnswer(true);
      }
    } catch (err) {
      console.error('Failed to evaluate answer:', err);
    } finally {
      setEvaluatingShortAnswer(false);
    }
  };

  // Evaluate Conceptual Answer
  const handleEvaluateConceptual = async () => {
    if (!studentConceptualAnswer.trim() || evaluatingConceptual) return;
    setEvaluatingConceptual(true);
    try {
      const res = await fetch('/api/study-aid/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: `${conceptualApplication.scenario} - ${conceptualApplication.question}`,
          sampleAnswer: conceptualApplication.sampleAnswer,
          studentAnswer: studentConceptualAnswer,
        }),
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setConceptualFeedback(data.evaluation);
        setShowConceptualAnswer(true);
      }
    } catch (err) {
      console.error('Failed to evaluate conceptual answer:', err);
    } finally {
      setEvaluatingConceptual(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Practice Exam Questions
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                3 Distinct Types
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Grounded strictly in source material: MCQ, Short Answer, and Conceptual Application
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <FileQuestion className="w-3.5 h-3.5 text-indigo-600" />
          <span>Interactive Self-Assessment</span>
        </div>
      </div>

      {/* QUESTION 1: MULTIPLE CHOICE QUESTION (MCQ) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Question 1 • MCQ
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Multiple Choice (4 Options)
            </span>
          </div>

          {hasSubmittedMCQ && (
            <button
              type="button"
              onClick={handleResetMCQ}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Question</span>
            </button>
          )}
        </div>

        {/* MCQ Question Prompt */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5 leading-snug">
          {mcq.question}
        </h3>

        {/* 4 Options */}
        <div className="space-y-3 mb-5">
          {mcq.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = selectedMCQOption === idx;
            const isCorrect = idx === mcq.correctAnswerIndex;

            let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';

            if (hasSubmittedMCQ) {
              if (isCorrect) {
                optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-500/20';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'border-rose-400 bg-rose-50 text-rose-950 ring-2 ring-rose-400/20';
              } else {
                optionStyle = 'border-slate-200 bg-slate-50/60 text-slate-500 opacity-70';
              }
            } else if (isSelected) {
              optionStyle = 'border-indigo-600 bg-indigo-50/60 text-indigo-950 ring-2 ring-indigo-500/20';
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasSubmittedMCQ}
                onClick={() => handleSelectMCQ(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer disabled:cursor-default ${optionStyle}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    hasSubmittedMCQ && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : hasSubmittedMCQ && isSelected && !isCorrect
                      ? 'bg-rose-600 text-white'
                      : isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {letter}
                </span>

                <div className="flex-1 text-sm font-medium pt-0.5 leading-relaxed">
                  {opt}
                </div>

                {hasSubmittedMCQ && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                )}
                {hasSubmittedMCQ && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action / Check Answer */}
        {!hasSubmittedMCQ ? (
          <div className="flex justify-end">
            <button
              type="button"
              disabled={selectedMCQOption === null}
              onClick={handleCheckMCQ}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedMCQOption === null
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              Check Answer
            </button>
          </div>
        ) : (
          /* MCQ Explanation */
          <div
            className={`p-4 rounded-xl border text-sm leading-relaxed ${
              selectedMCQOption === mcq.correctAnswerIndex
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1.5">
              {selectedMCQOption === mcq.correctAnswerIndex ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-800">Correct! Option {String.fromCharCode(65 + mcq.correctAnswerIndex)}</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span className="text-rose-800">Incorrect. The correct answer is Option {String.fromCharCode(65 + mcq.correctAnswerIndex)}</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700">
              <span className="font-semibold text-slate-900">Explanation: </span>
              {mcq.explanation}
            </p>
          </div>
        )}
      </div>

      {/* QUESTION 2: SHORT ANSWER QUESTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-violet-50 text-violet-700 border border-violet-200/60">
              Question 2 • Short Answer
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Sample High-Scoring Answer
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowModelShortAnswer(!showModelShortAnswer)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {showModelShortAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showModelShortAnswer ? 'Hide Sample Answer' : 'Reveal Sample Answer'}</span>
          </button>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-snug">
          {shortAnswer.question}
        </h3>

        {/* Student Response Area */}
        <div className="space-y-3 mb-4">
          <label className="text-xs font-medium text-slate-600 flex items-center justify-between">
            <span>Your Practice Response:</span>
            <span className="text-slate-400">Type your answer to self-evaluate</span>
          </label>
          <textarea
            value={studentShortAnswer}
            onChange={(e) => setStudentShortAnswer(e.target.value)}
            placeholder="Write your answer here in 2 to 4 sentences as you would on an exam..."
            rows={4}
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-violet-500 focus:ring-3 focus:ring-violet-100 text-sm text-slate-800 placeholder-slate-400 font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!studentShortAnswer.trim() || evaluatingShortAnswer}
              onClick={handleEvaluateShortAnswer}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                !studentShortAnswer.trim() || evaluatingShortAnswer
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 text-white shadow-xs'
              }`}
            >
              {evaluatingShortAnswer ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Grading Response...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Evaluate My Answer with AI Tutor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Tutor Feedback Card if evaluated */}
        {shortAnswerFeedback && (
          <div className="mb-4 p-4 rounded-xl bg-violet-50/70 border border-violet-200 text-xs sm:text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-violet-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-600" />
                Tutor Feedback
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-violet-200/80 text-violet-900 text-xs">
                {shortAnswerFeedback.scoreEstimate}
              </span>
            </div>

            {shortAnswerFeedback.strengths?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Key Strengths: </span>
                <ul className="list-disc list-inside mt-1 text-slate-700 space-y-0.5">
                  {shortAnswerFeedback.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {shortAnswerFeedback.areasToImprove?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Areas to Sharpen: </span>
                <ul className="list-disc list-inside mt-1 text-slate-700 space-y-0.5">
                  {shortAnswerFeedback.areasToImprove.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="pt-1 text-violet-900 font-medium italic border-t border-violet-200/60">
              "{shortAnswerFeedback.tutorAdvice}"
            </p>
          </div>
        )}

        {/* Sample High-Scoring Answer */}
        {showModelShortAnswer && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Sample High-Scoring Answer (Directly from Source Material):</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal bg-white p-3.5 rounded-lg border border-slate-200/80">
              {shortAnswer.sampleHighScoringAnswer}
            </p>

            {shortAnswer.rubricPoints && shortAnswer.rubricPoints.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Key points an exam grader looks for:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {shortAnswer.rubricPoints.map((pt, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* QUESTION 3: CONCEPTUAL APPLICATION QUESTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Question 3 • Conceptual Application
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Real-World Scenario Application
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowConceptualAnswer(!showConceptualAnswer)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            {showConceptualAnswer ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showConceptualAnswer ? 'Hide Application Answer' : 'Reveal Model Application'}</span>
          </button>
        </div>

        {/* Real-World Scenario Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-600" />
            <span>Scenario Context:</span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed italic">
            "{conceptualApplication.scenario}"
          </p>
        </div>

        {/* The Application Question */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-snug">
          {conceptualApplication.question}
        </h3>

        {/* Student Response Area */}
        <div className="space-y-3 mb-4">
          <textarea
            value={studentConceptualAnswer}
            onChange={(e) => setStudentConceptualAnswer(e.target.value)}
            placeholder="How would you apply the concept to solve or explain this scenario?"
            rows={4}
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100 text-sm text-slate-800 placeholder-slate-400 font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={!studentConceptualAnswer.trim() || evaluatingConceptual}
              onClick={handleEvaluateConceptual}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                !studentConceptualAnswer.trim() || evaluatingConceptual
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
              }`}
            >
              {evaluatingConceptual ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Grading Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Evaluate Application with AI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Tutor Feedback Card if evaluated */}
        {conceptualFeedback && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Application Analysis
              </span>
              <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-200 text-emerald-900 text-xs">
                {conceptualFeedback.scoreEstimate}
              </span>
            </div>

            {conceptualFeedback.strengths?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Strengths in Application: </span>
                <ul className="list-disc list-inside mt-1 text-slate-700 space-y-0.5">
                  {conceptualFeedback.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {conceptualFeedback.areasToImprove?.length > 0 && (
              <div>
                <span className="font-semibold text-slate-800">Conceptual Nuances Missed: </span>
                <ul className="list-disc list-inside mt-1 text-slate-700 space-y-0.5">
                  {conceptualFeedback.areasToImprove.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="pt-1 text-emerald-900 font-medium italic border-t border-emerald-200/60">
              "{conceptualFeedback.tutorAdvice}"
            </p>
          </div>
        )}

        {/* Conceptual Model Answer */}
        {showConceptualAnswer && (
          <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Sample High-Scoring Application Answer:</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed bg-white p-3.5 rounded-lg border border-emerald-100">
              {conceptualApplication.sampleAnswer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
