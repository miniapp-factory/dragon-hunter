"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

interface Question {
  text: string;
  options: { label: string; animal: Animal }[];
}

const questions: Question[] = [
  {
    text: "What is your favorite type of food?",
    options: [
      { label: "Fish", animal: "cat" },
      { label: "Bones", animal: "dog" },
      { label: "Berries", animal: "fox" },
      { label: "Seeds", animal: "hamster" },
      { label: "Grass", animal: "horse" },
    ],
  },
  {
    text: "How do you prefer to spend your free time?",
    options: [
      { label: "Sleeping", animal: "cat" },
      { label: "Playing fetch", animal: "dog" },
      { label: "Hunting", animal: "fox" },
      { label: "Storing food", animal: "hamster" },
      { label: "Running", animal: "horse" },
    ],
  },
  {
    text: "What is your personality like?",
    options: [
      { label: "Independent", animal: "cat" },
      { label: "Friendly", animal: "dog" },
      { label: "Clever", animal: "fox" },
      { label: "Curious", animal: "hamster" },
      { label: "Strong", animal: "horse" },
    ],
  },
  {
    text: "Which environment do you thrive in?",
    options: [
      { label: "Indoor", animal: "cat" },
      { label: "Outdoor", animal: "dog" },
      { label: "Forest", animal: "fox" },
      { label: "Cage", animal: "hamster" },
      { label: "Pasture", animal: "horse" },
    ],
  },
  {
    text: "What is your favorite activity?",
    options: [
      { label: "Purring", animal: "cat" },
      { label: "Barking", animal: "dog" },
      { label: "Sneaking", animal: "fox" },
      { label: "Running in wheels", animal: "hamster" },
      { label: "Galloping", animal: "horse" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Animal[]>([]);
  const [result, setResult] = useState<Animal | null>(null);

  const handleAnswer = (animal: Animal) => {
    const newAnswers = [...answers, animal];
    setAnswers(newAnswers);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const scores: Record<Animal, number> = {
        cat: 0,
        dog: 0,
        fox: 0,
        hamster: 0,
        horse: 0,
      };
      newAnswers.forEach((a) => {
        scores[a] += 1;
      });
      const maxScore = Math.max(...Object.values(scores));
      const topAnimals = Object.entries(scores)
        .filter(([, s]) => s === maxScore)
        .map(([a]) => a as Animal);
      setResult(topAnimals[0]); // pick first in case of tie
    }
  };

  const resetQuiz = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Your animal match: {result}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <img
            src={`/${result}.png`}
            alt={result}
            width={512}
            height={512}
            className="rounded-md"
          />
          <Share text={`I am most similar to a ${result}! ${url}`} />
          <Button variant="outline" onClick={resetQuiz}>
            Retake Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }

  const shuffledOptions = shuffleArray(questions[current].options);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          Question {current + 1} of {questions.length}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{questions[current].text}</p>
        <div className="flex flex-col gap-2">
          {shuffledOptions.map((opt) => (
            <Button
              key={opt.label}
              onClick={() => handleAnswer(opt.animal)}
              className="w-full justify-start"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
