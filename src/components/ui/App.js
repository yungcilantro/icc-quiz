// A simple React app for a multiple choice quiz with results
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const questions = [
  {
    question: "Who prepares the statement of special inspections?",
    options: ["The building official", "The contractor", "The registered design professional (RDP)", "The project architect"],
    answer: 2
  },
  {
    question: "What does \"fire resistance rating\" indicate?",
    options: ["The maximum height a building can reach", "The duration a building element can withstand a fire exposure", "The type of materials used in construction", "The cost estimation of fire protection systems"],
    answer: 1
  },
  {
    question: "What role does \"firewatch\" serve on construction sites?",
    options: ["It ensures compliance with design plans", "It serves as a measure for swimming pool safety", "It monitors and addresses fire hazards", "It is a plan for waste material removal"],
    answer: 2
  },
  // ... 182 more questions loaded in the same structure
];

function downloadResults(results, correctCount, total) {
  const lines = [
    `Score: ${correctCount}/${total} (${Math.round((correctCount / total) * 100)}%)`,
    '',
    ...results.map((q, i) => {
      const user = q.options[q.userAnswer] || 'No answer';
      const correct = q.options[q.correctAnswer];
      const status = q.userAnswer === q.correctAnswer ? 'Correct' : `Incorrect — Correct: ${correct}`;
      return `Q${i + 1}: ${q.question}\nYour answer: ${user}\n${status}\n`;
    })
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'quiz-results.txt';
  a.click();
}

export default function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (index) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const correctCount = selectedAnswers.filter((a, i) => a === questions[i].answer).length;
  const percentage = Math.round((correctCount / questions.length) * 100);
  const detailedResults = questions.map((q, i) => ({
    question: q.question,
    options: q.options,
    userAnswer: selectedAnswers[i],
    correctAnswer: q.answer
  }));

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {!showResults ? (
          <Card className="bg-white shadow-lg rounded-xl">
            <CardContent className="space-y-6 p-8">
              <div className="text-sm text-gray-500">Question {currentQuestion + 1} of {questions.length}</div>
              <h2 className="text-2xl font-bold text-gray-800">{questions[currentQuestion].question}</h2>
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option, i) => (
                  <Button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-blue-50"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <div className="pt-4">
                <Button onClick={() => downloadResults(detailedResults, correctCount, questions.length)} variant="outline">
                  Download Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white shadow-lg rounded-xl">
            <CardContent className="space-y-6 p-8">
              <h2 className="text-2xl font-bold text-gray-800">Results</h2>
              <p className="text-lg text-gray-700">Your score: {correctCount} out of {questions.length} ({percentage}%)</p>
              <div className="space-y-3">
                {questions.map((q, i) => (
                  <div key={i} className="border p-3 rounded bg-gray-50">
                    <p className="font-semibold">Q{i + 1}: {q.question}</p>
                    <p>Your answer: {q.options[selectedAnswers[i]]}</p>
                    {selectedAnswers[i] !== q.answer && (
                      <p className="text-red-500">Correct answer: {q.options[q.answer]}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-4">
                <Button onClick={() => downloadResults(detailedResults, correctCount, questions.length)} variant="outline">
                  Download Results
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
