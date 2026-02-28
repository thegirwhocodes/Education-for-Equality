'use client';

import { useState } from 'react';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface ReadingQuizProps {
  passage: string;
  passageTitle: string;
  questions: Question[];
  standard: string;
}

export default function ReadingQuiz({ passage, passageTitle, questions, standard }: ReadingQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.correctIndex).length
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Passage */}
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600">
            Reading Assessment
          </span>
          <span className="text-xs text-gray-400">{standard}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">{passageTitle}</h3>
        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed bg-white rounded-lg p-4 border border-gray-100">
          <p className="italic">{passage}</p>
        </div>
      </div>

      {/* Questions */}
      <div className="p-6 space-y-6">
        {questions.map((q, qIdx) => {
          const selected = answers[qIdx];
          const isCorrect = submitted && selected === q.correctIndex;
          const isWrong = submitted && selected !== undefined && selected !== q.correctIndex;

          return (
            <div key={qIdx} className="space-y-3">
              <p className="font-medium text-gray-900">
                {qIdx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oIdx) => {
                  let borderColor = 'border-gray-200';
                  let bgColor = 'bg-white';
                  if (selected === oIdx && !submitted) {
                    borderColor = 'border-blue-400';
                    bgColor = 'bg-blue-50';
                  }
                  if (submitted && oIdx === q.correctIndex) {
                    borderColor = 'border-green-400';
                    bgColor = 'bg-green-50';
                  }
                  if (submitted && selected === oIdx && oIdx !== q.correctIndex) {
                    borderColor = 'border-red-400';
                    bgColor = 'bg-red-50';
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      disabled={submitted}
                      className={`w-full text-left px-4 py-3 rounded-lg border ${borderColor} ${bgColor} transition-all ${
                        !submitted ? 'hover:border-blue-300 hover:bg-blue-25 cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <span className="text-sm text-gray-700">{opt}</span>
                    </button>
                  );
                })}
              </div>
              {submitted && (isCorrect || isWrong) && (
                <p className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? 'Correct!' : `Not quite.`} {q.explanation}
                </p>
              )}
            </div>
          );
        })}

        {/* Submit / Results */}
        <div className="pt-4 border-t border-gray-100">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className={`btn-primary w-full sm:w-auto ${
                Object.keys(answers).length < questions.length ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Check Answers
            </button>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-lg font-semibold text-gray-900">
                  Score: {score} / {questions.length}
                </p>
                <p className="text-sm text-gray-500">
                  {score === questions.length
                    ? 'Excellent! You understood the passage perfectly.'
                    : score >= questions.length / 2
                    ? 'Good effort! Review the explanations to improve.'
                    : 'Keep practising! Try re-reading the passage and trying again.'}
                </p>
              </div>
              <button onClick={handleReset} className="btn-secondary">
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
