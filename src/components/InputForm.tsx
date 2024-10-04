import React, { useState } from 'react';
import axios from 'axios';
import { InputFormProps, Question } from '../types';
import { BookOpen, AlertTriangle } from 'lucide-react';

const InputForm: React.FC<InputFormProps> = ({ onQuestionsGenerated }) => {
  const [subject, setSubject] = useState('');
  const [proficiency, setProficiency] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proficiencyLevels = [
    'Elementary',
    'Beginner',
    'Intermediate',
    'Upper Intermediate',
    'Advanced',
    'Proficient',
    'Doctoral'
  ];

  const validateQuestions = (questions: any[]): questions is Question[] => {
    return questions.every(q => 
      q && 
      typeof q.text === 'string' && 
      Array.isArray(q.options) && 
      q.options.length === 4 &&
      q.options.every(option => typeof option === 'string') &&
      typeof q.correctAnswer === 'string' &&
      typeof q.advice === 'string'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const prompt = `Generate 10 multiple-choice questions about ${subject} at a ${proficiency} level. For each question, provide 4 options (A, B, C, D), the correct answer, and advice on how to remember and understand the concept. Format the response as a JSON array of objects with the following structure:

[
  {
    "text": "Question text here",
    "options": [
      "Option A",
      "Option B",
      "Option C",
      "Option D"
    ],
    "correctAnswer": "A",
    "advice": "Advice on how to remember and understand the concept"
  },
  ...
]

Ensure that the JSON is valid and can be parsed directly. Do not include any additional text or formatting outside of the JSON structure.`;

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-4",
        messages: [{
          role: "user",
          content: prompt
        }],
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const content = response.data.choices[0].message.content;
      let parsedQuestions;
      
      try {
        parsedQuestions = JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Failed to parse the response from the API. The response might not be in the correct JSON format.');
      }

      if (!Array.isArray(parsedQuestions) || !validateQuestions(parsedQuestions)) {
        throw new Error('Invalid response format from API. The questions do not match the expected structure.');
      }

      onQuestionsGenerated(parsedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-center mb-6">
        <BookOpen className="w-10 h-10 text-blue-500 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Quiz Generator</h1>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <AlertTriangle className="w-5 h-5 inline mr-2" />
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject/Field of Study</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="proficiency" className="block text-sm font-medium text-gray-700">Proficiency Level</label>
        <select
          id="proficiency"
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        >
          <option value="">Select a level</option>
          {proficiencyLevels.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
        <input
          type="password"
          id="apiKey"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
          placeholder="Enter your OpenAI API key"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        disabled={isLoading}
      >
        {isLoading ? 'Generating Questions...' : 'Generate Questions'}
      </button>
    </form>
  );
};

export default InputForm;