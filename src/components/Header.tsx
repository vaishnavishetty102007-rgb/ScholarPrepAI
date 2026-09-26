import React from 'react';
import { GraduationCap, Sparkles, BookOpen, Printer, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  onPrint?: () => void;
  hasActiveStudyAid?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, onPrint, hasActiveStudyAid }) => {
  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 font-sans">
                Scholar<span className="text-indigo-600">Prep</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Exam Aid
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal hidden sm:block">
              Transform study notes & images into structured mastery kits
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasActiveStudyAid && (
            <>
              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Print or Save as PDF"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden sm:inline">Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                title="New Material"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
                <span>New Topic</span>
              </button>
            </>
          )}

          <div className="hidden md:flex items-center text-xs text-slate-500 pl-2 border-l border-slate-200">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
            Strict Material Grounding
          </div>
        </div>
      </div>
    </header>
  );
};
