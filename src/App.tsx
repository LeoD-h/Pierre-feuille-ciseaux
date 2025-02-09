import React, { useEffect, useState, useRef, useCallback } from 'react';
import './App.css';

enum Choices {
  ROCK = 'rock',
  PAPER = 'paper',
  SCISSORS = 'scissors',
}

const getComputerChoice = (): string => {
  const choices = Object.values(Choices);
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
};

const determineWinner = (user: string | null, computer: string | null): string => {
  if (!user || !computer) return 'Waiting for choices...';
  if (user === computer) return 'It\'s a tie!';
  if (
    (user === Choices.ROCK && computer === Choices.SCISSORS) ||
    (user === Choices.PAPER && computer === Choices.ROCK) ||
    (user === Choices.SCISSORS && computer === Choices.PAPER)
  ) {
    return 'You win!';
  }
  return 'You lose!';
};

const getImageUrl = (choice: string | null): string => {
  switch (choice) {
    case Choices.ROCK:
      return 'https://www.sculptures-bidal.com/photos/5/f/3/5/8/5f358a382e1c434cd9f12fd42ce70a9dada52b06.jpeg';
    case Choices.PAPER:
      return 'https://i0.wp.com/www.jardinsdugue.eu/wp-content/uploads/feuille-de-gingko.jpg';
    case Choices.SCISSORS:
      return 'https://www.kinetec.fr/wp-content/uploads/2024/01/M400000012-Ciseaux-courbes-01.jpg';
    default:
      return '';
  }
};

const App: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [hasCount, setHasCount] = useState(false);
  const [userChoice, setUserChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      setHasCount(true);
      const computerChoice = getComputerChoice();
      setComputerChoice(computerChoice);
      setResult(determineWinner(userChoice, computerChoice));
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, seconds, userChoice]);

  const handlePlay = useCallback((choice: string) => {
    if (isRunning) {
      setUserChoice(choice);
      setSelectedChoice(choice);
    }
  }, [isRunning]);

  const handleStart = useCallback(() => {
    setIsRunning(true);
    setSeconds(3);
    setHasCount(false);
    setUserChoice(null);
    setComputerChoice(null);
    setResult(null);
    setSelectedChoice(null);
  }, []);

  return (
    <div className='Container'>
      <div className='Interface'>
        <button onClick={handleStart} disabled={isRunning}>
          {hasCount ? 'Rejouer' : 'Start Game'}
        </button>
        {isRunning && <div className='Countdown'>{seconds}</div>}
        {hasCount && result && (
          <div className='Result'>
            <div className='Reveal'>
              <img src={getImageUrl(computerChoice)} alt={computerChoice || ""} />
              <div>/</div>
              <img src={getImageUrl(userChoice)} alt={userChoice || ""} />
            </div>
            <div>{result}</div>
          </div>
        )}
      </div>
      <div className='ChoixUser'>
        {Object.values(Choices).map((choice) => (
          <button
            key={choice}
            onClick={() => handlePlay(choice)}
            className={`${choice} ${selectedChoice === choice ? 'selected' : ''}`}
            disabled={!isRunning || hasCount}
          >
            <img src={getImageUrl(choice)} alt={choice} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;