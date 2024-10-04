import React, { useState } from 'react';
import InputForm from './components/InputForm';
import QuizQuestions from './components/QuizQuestions';
import QuizResults from './components/QuizResults';
import { Question } from './types';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState<'input' | 'quiz' | 'results'>('input');
  const [score, setScore] = useState(0);

  const handleQuestionsGenerated = (generatedQuestions: Question[]) => {
    setQuestions(generatedQuestions);
    setCurrentStep('quiz');
  };

  const handleQuizSubmit = (userAnswers: string[], userScore: number) => {
    const updatedQuestions = questions.map((q, index) => ({
      ...q,
      userAnswer: userAnswers[index]
    }));
    setQuestions(updatedQuestions);
    setScore(userScore);
    setCurrentStep('results');
  };

  const handleRestart = () => {
    setQuestions([]);
    setScore(0);
    setCurrentStep('input');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        {currentStep === 'input' && <InputForm onQuestionsGenerated={handleQuestionsGenerated} />}
        {currentStep === 'quiz' && <QuizQuestions questions={questions} onSubmit={handleQuizSubmit} />}
        {currentStep === 'results' && <QuizResults score={score} questions={questions} onRestart={handleRestart} />}
      </div>
    </div>
  );
}

export default App;