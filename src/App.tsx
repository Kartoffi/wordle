import './App.css'
import Keyboard from './components/Keyboard'
import Help from './components/Help'
import { useState, useEffect } from 'react'
import axios from 'axios'

type Cell = { letter: string; status: 'pending' | 'correct' | 'misplaced' | 'false' };
type GameState = Cell[][];

const baseGame: GameState = [
  [
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' }
  ],
  [
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' }
  ],
  [
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' }
  ],
  [
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' }
  ],
  [
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' }
  ],
  [
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' },
    { letter: '', status: 'pending' }
  ]
];


const initialGame: GameState = baseGame.map(row => row.map(cell => ({ ...cell })));

function App() {
  const [lettersNotInWord, setLettersNotInWord] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchWord = async () => {
    try {
      const response = await axios.get('https://random-word-api.herokuapp.com/word?length=5&lang=en');
      return response.data[0].toUpperCase();
    } catch (error) {
      console.error('Error fetching word:', error);
      setErrorMessage('Error fetching word');
      return 'ERROR';
    }
  }

  const [solution, setSolution] = useState('ERROR');
  useEffect(() => {
    const getWord = async () => {
      const word = await fetchWord();
      setSolution(word);
    }
    getWord();
  }, []);
  const [gameState, setGameState] = useState(initialGame);
  const [currentWord, setCurrentWord] = useState('');
  const [tries, setTries] = useState(0);
  const [wordConfirmed, setWordConfirmed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (wordConfirmed) {
      if (currentWord.toUpperCase() === solution) {
        alert('Congratulations! You guessed the word!');
        setTries(6);
      }

      if (currentWord.toUpperCase() !== solution && tries === 6) {
        alert(`Game Over! The word was ${solution}.`);
      }

      if (currentWord.toUpperCase() !== solution && tries < 6) {
        setGameState(prevGameState => {
          const newGameState = prevGameState.map((row, idx) => {
            if (idx === tries) {
              return row.map((cell, index) => {
                const letter = currentWord[index] || '';
                let status: Cell['status'] = 'false';

                // WIP: implement logic where a letter is in the word but was already guessed and there are no more instances of that letter in the solution
                if (solution.includes(letter))

                // WIP: implement logic where a letter is in the word but was also already guessed but there is still one or more instances of that letter in the solution which where also not guessed yet

                if (!solution.includes(letter)) {
                  setLettersNotInWord(prev => {
                    if (!prev.includes(letter) && letter !== '') {
                      return [...prev, letter];
                    }
                    return prev;
                  });
                }

                if (letter === solution[index]) {
                  status = 'correct';
                } else if (solution.includes(letter)) {
                  status = 'misplaced';
                }

                return { letter, status };
              });
            } else {
              return row;
            }
          });
          return newGameState;
        });
      }

      setWordConfirmed(false);
      setTries(prev => prev + 1);
      setCurrentWord('');
    }
  }, [wordConfirmed]);

  useEffect(() => {
    setGameState(prevGameState => {
      const newGameState = prevGameState.map((row, idx) =>
        idx === tries
          ? row.map((cell, index) => ({
              letter: currentWord[index] || '',
              status: 'pending' as Cell['status'],
            }))
          : row
      );
      return newGameState;
    });
  }, [currentWord]);

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
          {gameState.map((word, wordIndex) => (
            <div key={wordIndex} className="word">
              {word.map((letterObj, letterIndex) => (
                <div className={`letter-container ${letterObj.status}`} key={letterIndex}>
                  <div className={`letter ${letterObj.status}`}>{letterObj.letter}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
        {tries < 6 && (
          <Keyboard currentWord={currentWord} setCurrentWord={setCurrentWord} setWordConfirmed={setWordConfirmed} lettersNotInWord={lettersNotInWord} />
        )}
      </div>
      {showHelp && (
        <Help setShowHelp={setShowHelp} />
      )}
    </>
  )
}

export default App
