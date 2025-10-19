import './App.css'
import Keyboard from './components/Keyboard'
import Help from './components/Help'
import Grid from './components/Grid'
import { useState, useEffect } from 'react'

function App() {
  const [showAlert, setShowAlert] = useState(false);
  const [possibleWords, setPossibleWords] = useState<string[]>([]);

  const [gridTemplate, setGridTemplate] = useState(getEmptyGrid());

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
        setGridTemplate(prev => {
            const newGrid = [...prev];
            newGrid[tries] = getLetterStatus(currentGuess.toUpperCase(), solution).map((status, idx) => ({
              letter: currentGuess.toUpperCase()[idx],
              status: status
            }));
            return newGrid;
          }
        );
        setWordConfirmed(false);
        setTries(6);
        return;
      }
      
      if (currentGuess.toUpperCase() !== solution && tries === 6) {
        setGridTemplate(prev => {
            const newGrid = [...prev];
            newGrid[tries - 1] = getLetterStatus(currentGuess.toUpperCase(), solution).map((status, idx) => ({
              letter: currentGuess.toUpperCase()[idx],
              status: status
            }));
            return newGrid;
          }
        );
        setWordConfirmed(false);
        return;
      }
      setGridTemplate(prev => {
          const newGrid = [...prev];
          newGrid[tries] = getLetterStatus(currentGuess.toUpperCase(), solution).map((status, idx) => ({
            letter: currentGuess.toUpperCase()[idx],
            status: status
          }));
          return newGrid;
        }
      );
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

  function getEmptyGrid() {
    return Array.from({ length: 6 }, () =>
      Array.from({ length: 5 }, () => ({ letter: '', status: 'pending' }))
    );
  }

  function startNewGame() {
    setGridTemplate(getEmptyGrid());
    setCurrentGuess('');
    setTries(0);
    setWordConfirmed(false);
    setSolution(possibleWords[Math.floor(Math.random() * possibleWords.length)]);
  }

  useEffect(() => {
    setGridTemplate(prev => {
        const newGrid = [...prev];
        newGrid[tries] = currentGuess.split('').map((letter, idx) => ({
          letter: letter.toUpperCase(),
          status: 'pending'
        }));
        
        for (let i = currentGuess.length; i < 5; i++) {
          newGrid[tries][i] = { letter: '', status: 'pending' };
        }
        return newGrid;
      }
    );
  }, [currentGuess]);

  console.log(gridTemplate[0][0]);

  return (
    <>
      <div className="game-container h-[100%] display-flex flex-col justify-between items-center p-4">
        <div className="header h-[50px] flex justify-between items-center w-[100%] mb-4">
          <h1>Wordle</h1>
          <button className='help-button rounded-[50%] w-[40px] h-[40px] bg-gray-500 text-white text-[1.25em] hover:bg-white hover:text-black cursor-pointer' onClick={() => setShowHelp(prev => !prev)}>
            ?
          </button>
        </div>
        <Grid grid={gridTemplate} />
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
