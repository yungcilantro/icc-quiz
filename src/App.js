
import { useState } from 'react';
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

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
  }
];

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
  const detailedResults = questions.map((q, i) => ({
    question: q.question,
    options: q.options,
    userAnswer: selectedAnswers[i],
    correctAnswer: q.answer
  }));

  return (
    <div className="max-w-xl mx-auto p-4">
      {!showResults ? (
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">{questions[currentQuestion].question}</h2>
            {questions[currentQuestion].options.map((option, i) => (
              <Button key={i} onClick={() => handleAnswer(i)} className="w-full text-left">
                {option}
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="text-xl font-semibold">Results</h2>
            <p>Your score: {correctCount} out of {questions.length} ({Math.round((correctCount / questions.length) * 100)}%)</p>
            <div className="space-y-2">
              {questions.map((q, i) => (
                <div key={i} className="border p-2 rounded">
                  <p className="font-medium">Q{i + 1}: {q.question}</p>
                  <p>Your answer: {q.options[selectedAnswers[i]]}</p>
                  {selectedAnswers[i] !== q.answer && (
                    <p className="text-red-500">Correct answer: {q.options[q.answer]}</p>
                  )}
                </div>
              ))}
            </div>
            <Button onClick={() => downloadResults(detailedResults, correctCount, questions.length)} className="mt-4">Download Results</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
