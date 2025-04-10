import React, { useEffect, useState } from "react";
import "./GuessGhibli.css";

type ImagePair = {
  ghibli?: string;
  original: string;
  baseName: string;
  type: "ghibli" | "quiz";
};

const baseNames = [
  "question_2",
  "question_5",
  "question_10",
  "question_30",
  "question_250",
  "question_800",
  "question_4000",
  "question_future",
  "question_heat",
  "question_maine",
  "question_map",
  "question_number",
  "question_odd",
  "question_pomeranian",
  "question_react",
  "question_son",
  "salman",
  "bhaskar+vishnu+suresh",
  "ravi",
  "rashmika",
  "priyanka",
  "nana",
  "mahesh",
  "jeff",
  "hrithik",
  "bramhanandam",
  "bhaskar",
  "raju",
  "shravan",
  "vineela+laxmi+poojita",
];

const extensions = ["jpg", "jpeg", "png"];

const GuessGhibli: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [hasStarted, setHasStarted] = useState(false);
  const [imagePairs, setImagePairs] = useState<ImagePair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOriginal, setShowOriginal] = useState(false);
  const [timer, setTimer] = useState(40);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  const checkImage = (src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  };

  const findValidImage = async (baseName: string): Promise<string | null> => {
    for (const ext of extensions) {
      const url = `/images/${baseName}.${ext}`;
      const exists = await checkImage(url);
      if (exists) return url;
    }
    return null;
  };

  useEffect(() => {
    const loadImages = async () => {
      const pairs: ImagePair[] = [];

      for (const base of baseNames) {
        const ghibliImg = await findValidImage(`${base}_gibili`);
        const originalImg = await findValidImage(base);

        if (originalImg) {
          pairs.push({
            ghibli: ghibliImg || undefined,
            original: originalImg,
            baseName: base,
            type: ghibliImg ? "ghibli" : "quiz",
          });
        }
      }

      setImagePairs(pairs);
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (gameEnded || !hasStarted) return;

    const current = imagePairs[currentIndex];

    if (!showOriginal) {
      if (timer > 0) {
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
      } else {
        setShowOriginal(true);
      }
    } else {
      const timeout = setTimeout(() => {
        if (currentIndex + 1 >= imagePairs.length) {
          setGameEnded(true);
        } else {
          setCurrentIndex((prev) => prev + 1);
          setTimer(40);
          setAnswer("");
          setSubmitted(false);
          setShowOriginal(false);
        }
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [timer, showOriginal, currentIndex, imagePairs.length, gameEnded, hasStarted]);

  const handleSubmit = () => {
    setSubmitted(true);

    const current = imagePairs[currentIndex];
    const correctParts = current.baseName.toLowerCase().split("+").map((part) => part.trim());
    let userAnswer = answer.toLowerCase().trim();

    // Special handling for "question_" base names
    if (current.baseName.toLowerCase().startsWith("question_")) {
      const questionMatch = current.baseName.match(/question_(\w+)/i); // Match "question_" followed by word or number
      if (questionMatch && questionMatch[1]) {
        const correctAnswer = questionMatch[1]; // Extract the word or number (e.g., "maine" or "10")
        if (userAnswer === correctAnswer) {
          setScore((prev) => prev + 1);
          return; // Exit early if match found
        }
      }
    }

    // Fallback for other base names (e.g., names like "salman khan")
    if (correctParts.some((name) => userAnswer.includes(name))) {
      setScore((prev) => prev + 1);
    }
  };

  if (!hasStarted) {
    return (
      <div className="login-screen">
        <h2>🎨 Welcome to Guess the Ghibli!</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <button
          onClick={() => {
            if (userName.trim() !== "") setHasStarted(true);
          }}
        >
          Start Game
        </button>
      </div>
    );
  }

  if (imagePairs.length === 0) return <div className="loading">Loading...</div>;

  const current = imagePairs[currentIndex];

  return (
    <div className="guess-ghibli-container">
      <h1>{current.type === "ghibli" ? "Guess the Character (Ghibli Edition)" : "Quiz Mode"}</h1>
      <h2>Hello, {userName}! 👋</h2>

      {!gameEnded ? (
        <>
          <p className="timer">⏱️ Timer: {timer}s</p>
          <div className="image-container">
            {current.type === "ghibli" && !showOriginal && (
              <img src={current.ghibli} alt="Ghibli" className="image" />
            )}

            {current.type === "ghibli" && showOriginal && (
              <>
                <img src={current.ghibli} alt="Ghibli" className="image side-by-side" />
                <img src={current.original} alt="Original" className="image side-by-side" />
              </>
            )}

            {current.type === "quiz" && (
              <img src={current.original} alt="Quiz" className="quiz-image" />
            )}
          </div>

          {!showOriginal && (
            <div className="input-section">
              <input
                type="text"
                placeholder="Enter your guess"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={submitted}
              />
              <button onClick={handleSubmit} disabled={submitted}>
                Submit
              </button>
              {submitted && <p className="feedback">Answer submitted! Revealing soon...</p>}
            </div>
          )}

          {showOriginal && (
            <div className="result-section">
              <p>
                ✅ Correct Answer: <strong>
                  {current.baseName.toLowerCase().startsWith("question_")
                    ? current.baseName.match(/question_(\w+)/i)?.[1] || current.baseName
                    : current.baseName}
                </strong>
              </p>
              <p>
                📝 Your answer: <strong>{answer || "(No answer given)"}</strong>
              </p>
              <p>Current Score: {score}/{imagePairs.length}</p>
              <p>Next image in 1 second...</p>
            </div>
          )}
        </>
      ) : (
        <div className="result-final">
          <h2>🎉 Game Over, {userName}!</h2>
          <p>Your final score is:</p>
          <h3>
            {score} out of {imagePairs.length}
          </h3>
          <button
            onClick={() => {
              setHasStarted(false);
              setImagePairs([]);
              setCurrentIndex(0);
              setShowOriginal(false);
              setTimer(2);
              setAnswer("");
              setSubmitted(false);
              setScore(0);
              setGameEnded(false);
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GuessGhibli;