import './App.css'
import Keyboard from './components/Keyboard'
import Help from './components/Help'
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [guesses, setGuesses] = useState<string[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [possibleWords, setPossibleWords] = useState<string[]>([]);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    async function loadWords() {
      const response = await fetch('/words.txt');
      const text = await response.text();
      const words = text
        .split(/\r?\n/)
        .map(word => word.trim().toUpperCase())
        .filter(word => word.length === 5)
        .filter(Boolean);
      setPossibleWords(words);
    }
    loadWords();
  }, []);

  const [solution, setSolution] = useState('ERROR');

  useEffect(() => {
    if (possibleWords.length > 0) {
      setSolution(possibleWords[Math.floor(Math.random() * possibleWords.length)]);
    }
  }, [possibleWords]);

  const [currentGuess, setCurrentGuess] = useState('');
  const [tries, setTries] = useState(0);
  const [wordConfirmed, setWordConfirmed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (wordConfirmed) {
      if (currentGuess.toUpperCase() === solution) {
        setGuesses(prev => [...prev, currentGuess.toUpperCase()]);
        setWordConfirmed(false);
        setTries(6);
        return;
      }
      
      if (currentGuess.toUpperCase() !== solution && tries === 6) {
        setGuesses(prev => [...prev, currentGuess.toUpperCase()]);
        setWordConfirmed(false);
        return;
      }
      setGuesses(prev => [...prev, currentGuess.toUpperCase()]);
      setWordConfirmed(false);
      setTries(prev => prev + 1);
      setCurrentGuess('');
    }
  }, [wordConfirmed]);

  function getLetterStatus(word: string, solution: string) {
    return word.split('').map((letter, idx) => {
      if (solution[idx] === letter) {
        return 'correct';
      } else if (solution.includes(letter)) {
        return 'misplaced';
      } else {
        return 'false';
      }
    });
  }

  async function startNewGame() {
    setGuesses([]);
    setCurrentGuess('');
    setTries(0);
    setWordConfirmed(false);
    setSolution(possibleWords[Math.floor(Math.random() * possibleWords.length)]);
  }

  return (
    <>
      <div className="game-container h-[100%] display-flex flex-col justify-between items-center p-4">
        <div className="header h-[50px] flex justify-between items-center w-[100%] mb-4">
          <h1>Wordle</h1>
          <button className='help-button rounded-[50%] w-[40px] h-[40px] bg-gray-500 text-white text-[1.25em] hover:bg-white hover:text-black cursor-pointer' onClick={() => setShowHelp(prev => !prev)}>
            ?
          </button>
        </div>
        <div className="grid">
          {
            Array.from({ length: 6 }).map((_, i) => {
              if (i === tries) {
                return (
                  <div key={i} className="word">
                    {currentGuess.split('').map((letter, idx) => (
                      <div className="letter-container pending" key={idx}>
                        <div className="letter pending">{letter}</div>
                      </div>
                    ))}
                    {Array.from({ length: 5 - currentGuess.length }).map((_, idx) => (
                      <div className="letter-container pending" key={idx + currentGuess.length}>
                        <div className="letter pending"></div>
                      </div>
                    ))}
                  </div>
                );
              } else if (i < guesses.length) {
                const letterStatuses = getLetterStatus(guesses[i], solution);
                return (
                  <div key={i} className="word">
                    {guesses[i].split('').map((letter, idx) => (
                      <div className={`letter-container ${letterStatuses[idx]}`} key={idx}>
                        <div className={`letter ${letterStatuses[idx]}`}>{letter}</div>
                      </div>
                    ))}
                  </div>
                );
              } else {
                // Render empty row for unused guesses
                return (
                  <div key={i} className="word">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <div className="letter-container pending" key={idx}>
                        <div className="letter pending"></div>
                      </div>
                    ))}
                  </div>
                );
              }
            })
          }
        </div>
        <div className={`alert ${showAlert ? 'alert-show' : ''}`}>
          Not a valid word. Please try again.
        </div>
        {tries < 6 && (
          <Keyboard currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} setWordConfirmed={setWordConfirmed} setShowAlert={setShowAlert}/>
        )}
        {tries === 6 && (
          <>
            {currentGuess.toUpperCase() !== solution && (
              <p><b>Game Over!</b> The word was <b>{solution.toLowerCase()}.</b></p>
            )}
            {currentGuess.toUpperCase() === solution && (
              <p><b>Congratulations!</b> You guessed the word!</p>
            )}
            <button onClick={startNewGame}>NEW GAME</button>
          </>
        )}
      </div>
      {showHelp && (
        <Help setShowHelp={setShowHelp} />
      )}
    </>
  )
}

export default App
