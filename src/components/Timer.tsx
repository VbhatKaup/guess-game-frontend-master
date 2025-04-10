import React, { useEffect, useState } from 'react';

type TimerProps = {
  seconds: number;
  onTimeUp: () => void;
};

const Timer: React.FC<TimerProps> = ({ seconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onTimeUp]);

  return <h2>Time Left: {timeLeft}s</h2>;
};

export default Timer;
