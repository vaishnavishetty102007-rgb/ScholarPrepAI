export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface KeyConcept {
  concept: string;
  summary: string;
  keyTakeaway?: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ShortAnswerQuestion {
  question: string;
  sampleHighScoringAnswer: string;
  rubricPoints?: string[];
}

export interface ConceptualApplicationQuestion {
  scenario: string;
  question: string;
  sampleAnswer: string;
}

export interface PracticeExam {
  mcq: MCQQuestion;
  shortAnswer: ShortAnswerQuestion;
  conceptualApplication: ConceptualApplicationQuestion;
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface StudyAidResponse {
  title: string;
  difficulty: DifficultyLevel;
  keyConcepts: KeyConcept[];
  practiceExam: PracticeExam;
  flashcards: Flashcard[];
}

export interface AnswerEvaluation {
  scoreEstimate: string;
  strengths: string[];
  areasToImprove: string[];
  tutorAdvice: string;
}
