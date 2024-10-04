export interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
  advice: string;
  userAnswer?: string;
}

export interface InputFormProps {
  onQuestionsGenerated: (questions: Question[]) => void;
}

export interface QuizQuestionsProps {
  questions: Question[];
  onSubmit: (userAnswers: string[], score: number) => void;
}

export interface QuizResultsProps {
  score: number;
  questions: Question[];
  onRestart: () => void;
}