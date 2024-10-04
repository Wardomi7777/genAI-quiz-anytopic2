import React, { useState } from 'react';
import { QuizQuestionsProps, Question } from '../types';
import { CheckCircle, AlertTriangle } from 'lucide-react';

const QuizQuestions: React.FC<QuizQuestionsProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [error, setError] = useState<string | null>(null);

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const score = answers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    
    onSubmit(answers, score);
  };

  // Check if questions are valid
  const areQuestionsValid = questions.every(question => 
    question && 
    typeof question.text === 'string' && 
    Array.isArray(question.options) && 
    question.options.length === 4 &&
    typeof question.correctAnswer === 'string' &&
    typeof question.advice === 'string'
  );

  if (!areQuestionsValid) {
    return (
      <div className="text-center p-6 bg-red-100 rounded-lg">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">Error: Invalid Questions Data</h2>
        <p className="text-red-600">
          The questions data is not in the expected format. Please try generating the questions again.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-500 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Quiz Questions</h2>
      </div>
      {questions.map((question, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-4">{index + 1}. {question.text}</p>
          <div className="space-y-2">
            {question.options.map((option, optionIndex) => (
              <label key={optionIndex} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={String.fromCharCode(65 + optionIndex)}
                  checked={answers[index] === String.fromCharCode(65 + optionIndex)}
                  onChange={() => handleAnswerChange(index, String.fromCharCode(65 + optionIndex))}
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Submit Answers
      </button>
    </form>
  );
};

export default QuizQuestions;