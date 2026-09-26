import React, { useState } from 'react';
import { StudyAidResponse } from '../types';
import { Download, Copy, Check, Printer, FileText, Sparkles, BookOpen } from 'lucide-react';

interface FullStudyGuideViewProps {
  studyAid: StudyAidResponse;
  onPrint: () => void;
}

export const FullStudyGuideView: React.FC<FullStudyGuideViewProps> = ({ studyAid, onPrint }) => {
  const [copiedMd, setCopiedMd] = useState(false);

  const generateMarkdown = () => {
    let md = `# ${studyAid.title}\n\n`;
    md += `*Difficulty Level: ${studyAid.difficulty.toUpperCase()}*\n\n`;

    md += `## 1. Key Concepts & Summaries\n\n`;
    studyAid.keyConcepts.forEach((c, idx) => {
      md += `### ${idx + 1}. ${c.concept}\n${c.summary}\n`;
      if (c.keyTakeaway) md += `*Takeaway: ${c.keyTakeaway}*\n\n`;
    });

    md += `\n## 2. Practice Exam Questions\n\n`;
    md += `### Multiple Choice Question (MCQ)\n**Question:** ${studyAid.practiceExam.mcq.question}\n\n`;
    studyAid.practiceExam.mcq.options.forEach((opt, idx) => {
      const letter = String.fromCharCode(65 + idx);
      const isCorrect = idx === studyAid.practiceExam.mcq.correctAnswerIndex;
      md += `- [${letter}] ${opt}${isCorrect ? ' *(Correct)*' : ''}\n`;
    });
    md += `\n**Explanation:** ${studyAid.practiceExam.mcq.explanation}\n\n`;

    md += `### Short Answer Question\n**Question:** ${studyAid.practiceExam.shortAnswer.question}\n\n`;
    md += `**Sample High-Scoring Answer:**\n${studyAid.practiceExam.shortAnswer.sampleHighScoringAnswer}\n\n`;

    md += `### Conceptual Application Question\n`;
    md += `**Scenario:** ${studyAid.practiceExam.conceptualApplication.scenario}\n\n`;
    md += `**Question:** ${studyAid.practiceExam.conceptualApplication.question}\n\n`;
    md += `**Sample Application Answer:**\n${studyAid.practiceExam.conceptualApplication.sampleAnswer}\n\n`;

    md += `## 3. Flashcard Set (JSON Format)\n\n`;
    md += '```json\n' + JSON.stringify(studyAid.flashcards, null, 2) + '\n```\n';

    return md;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const md = generateMarkdown();
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${studyAid.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_study_guide.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8 printable-guide">
      {/* Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
              Exam Study Kit • {studyAid.difficulty.toUpperCase()}
            </span>
            <span className="text-xs text-slate-400">
              Strictly Source-Grounded
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {studyAid.title}
          </h1>
        </div>

        <div className="flex items-center gap-2 no-print">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {copiedMd ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copiedMd ? 'Copied' : 'Copy Guide'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save .MD</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: KEY CONCEPTS & SUMMARIES */}
      <section className="space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
            1
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Key Concepts & Summaries
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studyAid.keyConcepts.map((c, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-amber-100 text-amber-800 text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                {c.concept}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {c.summary}
              </p>
              {c.keyTakeaway && (
                <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-md font-medium">
                  Takeaway: {c.keyTakeaway}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: PRACTICE EXAM QUESTIONS */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center">
            2
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Practice Exam Questions
          </h2>
        </div>

        {/* MCQ */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
              Multiple Choice Question (MCQ)
            </span>
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            {studyAid.practiceExam.mcq.question}
          </h3>
          <div className="space-y-1.5 pl-2">
            {studyAid.practiceExam.mcq.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isCorrect = idx === studyAid.practiceExam.mcq.correctAnswerIndex;
              return (
                <div
                  key={idx}
                  className={`text-xs sm:text-sm p-2 rounded-lg flex items-start gap-2 ${
                    isCorrect
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200'
                      : 'text-slate-700'
                  }`}
                >
                  <span className="font-bold w-5 shrink-0">{letter}.</span>
                  <span>{opt}</span>
                  {isCorrect && (
                    <span className="ml-auto text-xs text-emerald-700 font-bold shrink-0">
                      [Correct Answer]
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
            <span className="font-semibold text-slate-800">Explanation: </span>
            {studyAid.practiceExam.mcq.explanation}
          </div>
        </div>

        {/* Short Answer */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-violet-100 text-violet-800">
              Short Answer Question
            </span>
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            {studyAid.practiceExam.shortAnswer.question}
          </h3>
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <span className="font-bold block text-violet-900 mb-1">
              Sample High-Scoring Answer:
            </span>
            {studyAid.practiceExam.shortAnswer.sampleHighScoringAnswer}
          </div>
        </div>

        {/* Conceptual Application */}
        <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Conceptual Application Question
            </span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950 italic">
            Scenario: "{studyAid.practiceExam.conceptualApplication.scenario}"
          </div>
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            {studyAid.practiceExam.conceptualApplication.question}
          </h3>
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <span className="font-bold block text-emerald-900 mb-1">
              Sample Application Answer:
            </span>
            {studyAid.practiceExam.conceptualApplication.sampleAnswer}
          </div>
        </div>
      </section>

      {/* SECTION 3: FLASHCARD SET (JSON FORMAT) */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-800 font-bold text-xs flex items-center justify-center">
            3
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Flashcard Set (JSON Format)
          </h2>
        </div>

        <div className="bg-slate-900 rounded-xl p-5 text-emerald-400 font-mono text-xs overflow-x-auto">
          <pre>{JSON.stringify(studyAid.flashcards, null, 2)}</pre>
        </div>
      </section>
    </div>
  );
};
