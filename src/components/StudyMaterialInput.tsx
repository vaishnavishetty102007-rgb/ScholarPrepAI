import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileCode,
  Zap
} from 'lucide-react';
import { DifficultyLevel } from '../types';
import { SAMPLE_MATERIALS, SampleMaterial } from '../data/sampleMaterials';

interface StudyMaterialInputProps {
  onGenerate: (payload: {
    text?: string;
    image?: { mimeType: string; data: string; name?: string };
    difficulty: DifficultyLevel;
  }) => void;
  isLoading: boolean;
}

export const StudyMaterialInput: React.FC<StudyMaterialInputProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('medium');
  const [uploadedImage, setUploadedImage] = useState<{
    file: File;
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setImageError(null);
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setImageError('Image size exceeds 15MB. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
      setUploadedImage({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64Data,
        mimeType: file.type,
      });
      setActiveTab('image');
    };
    reader.onerror = () => {
      setImageError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
      setUploadedImage(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = (sample: SampleMaterial) => {
    setTextInput(sample.content);
    setActiveTab('text');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (activeTab === 'image') {
      if (!uploadedImage) {
        setImageError('Please upload an image of your study material or switch to text tab.');
        return;
      }
      onGenerate({
        image: {
          mimeType: uploadedImage.mimeType,
          data: uploadedImage.base64,
          name: uploadedImage.file.name,
        },
        text: textInput.trim() ? textInput.trim() : undefined,
        difficulty: selectedDifficulty,
      });
    } else {
      if (!textInput.trim()) {
        return;
      }
      onGenerate({
        text: textInput.trim(),
        difficulty: selectedDifficulty,
      });
    }
  };

  const hasContent = (activeTab === 'image' && !!uploadedImage) || (activeTab === 'text' && !!textInput.trim());

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Intro Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-b from-indigo-50/50 to-white border-b border-slate-100">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100/70 text-indigo-800 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Academic Tutor & Exam Preparation Assistant
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-sans">
            Transform Study Material into Interactive Exam Aids
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Upload document images (lecture slides, textbook pages, handwritten notes) or paste raw text.
            ScholarPrep extracts <span className="font-semibold text-slate-800">3–5 Core Concepts</span>, generates <span className="font-semibold text-slate-800">3 Strict Practice Questions</span> (MCQ, Short Answer, Conceptual Scenario), and builds an <span className="font-semibold text-slate-800">Interactive Flashcard Deck (5–10 cards)</span>.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
        {/* Source Material Tabs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Step 1: Provide Source Material
            </label>
            <span className="text-xs text-slate-400">Strictly grounded in your input only</span>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Notes or Text</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'image'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Document Image</span>
              {uploadedImage && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Text Input Tab */}
          {activeTab === 'text' && (
            <div className="space-y-3">
              <div className="relative">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your lecture notes, textbook excerpt, study guide summary, or research paper findings here..."
                  rows={8}
                  className="w-full p-4 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-3 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 transition-all font-sans leading-relaxed resize-y"
                  disabled={isLoading}
                />
                {textInput && (
                  <button
                    type="button"
                    onClick={() => setTextInput('')}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 text-xs font-medium cursor-pointer"
                  >
                    Clear text
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>{textInput ? `${textInput.trim().split(/\s+/).filter(Boolean).length} words • ${textInput.length} characters` : '0 words'}</span>
                
                {/* Preset Samples */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-400 font-medium">Try high-yield preset:</span>
                  {SAMPLE_MATERIALS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadSample(sample)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 rounded-md text-slate-700 transition-colors cursor-pointer"
                    >
                      {sample.title.split('&')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Image Upload Tab */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/jpg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {!uploadedImage ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Click to upload or drag & drop document image
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm">
                    Upload textbook pages, handwritten notes, lecture slide photos, or cheat sheets (PNG, JPG, WEBP up to 15MB)
                  </p>
                </div>
              ) : (
                <div className="relative border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0 flex items-center justify-center">
                    <img
                      src={uploadedImage.previewUrl}
                      alt="Uploaded study material"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Ready for Parsing
                      </span>
                      <span className="text-xs text-slate-400">
                        {(uploadedImage.file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 truncate">
                      {uploadedImage.file.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      ScholarPrep will analyze this image directly in the backend and formulate grounded study aids.
                    </p>
                    <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium underline cursor-pointer"
                      >
                        Replace Image
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {imageError && (
                <div className="flex items-center gap-2 p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Difficulty Toggle (Radio Buttons) */}
        <div className="pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span>Step 2: Question Difficulty Level</span>
              <span className="text-indigo-600 text-xs font-semibold">(Radio Button Control)</span>
            </label>
            <span className="text-xs text-slate-400">Calibrates exam questions</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Easy */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                selectedDifficulty === 'easy'
                  ? 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Easy
                </span>
                <input
                  type="radio"
                  name="difficulty"
                  value="easy"
                  checked={selectedDifficulty === 'easy'}
                  onChange={() => setSelectedDifficulty('easy')}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Foundational recall, direct definitions, and straightforward principles.
              </p>
            </label>

            {/* Medium */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                selectedDifficulty === 'medium'
                  ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                  Medium
                </span>
                <input
                  type="radio"
                  name="difficulty"
                  value="medium"
                  checked={selectedDifficulty === 'medium'}
                  onChange={() => setSelectedDifficulty('medium')}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Standard exam rigor, conceptual distinctions, and analytical reasoning.
              </p>
            </label>

            {/* Hard */}
            <label
              className={`relative flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                selectedDifficulty === 'hard'
                  ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  Hard
                </span>
                <input
                  type="radio"
                  name="difficulty"
                  value="hard"
                  checked={selectedDifficulty === 'hard'}
                  onChange={() => setSelectedDifficulty('hard')}
                  className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300"
                />
              </div>
              <p className="text-xs text-slate-600 leading-normal">
                Higher-order synthesis, subtle nuances, and tricky distractors.
              </p>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={!hasContent || isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              !hasContent || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing Material & Formulating Study Kit...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate Interactive Study Aid</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
