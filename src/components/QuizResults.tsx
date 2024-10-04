import React from 'react';
import { QuizResultsProps } from '../types';
import { Award, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

const QuizResults: React.FC<QuizResultsProps> = ({ score, questions, onRestart }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <Award className="w-10 h-10 text-yellow-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
      </div>
      <div className="text-center bg-blue-100 p-6 rounded-lg shadow-md">
        <p className="text-4xl font-bold text-blue-600 mb-2">Your Score: {score} / {questions.length}</p>
        <p className="text-xl text-blue-800">
          {score === questions.length ? "Perfect score! Excellent job!" :
           score >= questions.length * 0.8 ? "Great job! You're doing very well!" :
           score >= questions.length * 0.6 ? "Good effort! Keep studying to improve!" :
           "You can do better! Don't give up and keep learning!"}
        </p>
      </div>
      <div className="space-y-6">
        {questions.map((question, index) => {
          const userAnswerIndex = question.userAnswer ? question.userAnswer.charCodeAt(0) - 65 : -1;
          const userAnswer = userAnswerIndex >= 0 && userAnswerIndex < question.options.length
            ? question.options[userAnswerIndex]
            : 'No answer provided';
          
          const correctAnswerIndex = question.correctAnswer.charCodeAt(0) - 65;
          const correctAnswerText = question.options[correctAnswerIndex];
          
          const isCorrect = question.userAnswer === question.correctAnswer;

          return (
            <div key={index} className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex-grow">
                  <p className="font-semibold mb-2">{index + 1}. {question.text}</p>
                  <p className={`mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    Your answer: {userAnswer}
                  </p>
                  {!isCorrect && (
                    <p className="text-green-600 mb-2">Correct answer: {correctAnswerText}</p>
                  )}
                  <p className="text-gray-700 mt-2"><strong>Advice:</strong> {question.advice}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        onClick={onRestart}
        className="w-full mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        Start New Quiz
      </button>
    </div>
  );
};

export default QuizResults;