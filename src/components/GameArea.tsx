import '../GameArea.css'
import Keyboard from './Keyboard'
import Grid from './Grid'
import { useState, useEffect } from 'react'

const GameArea = () => {

    const [possibleWords, setPossibleWords] = useState<string[]>([]);

    const [gridTemplate, setGridTemplate] = useState(getEmptyGrid());

    useEffect(() => {
        fetch('/words_en.txt')
            .then(res => res.text())
            .then(text => {
            const words = text
                .split(/\r?\n/)
                .map(w => w.trim().toUpperCase())
                .filter(w => w.length === 5);
            setPossibleWords(words);
            });
    }, []);


    const [solution, setSolution] = useState('ERROR');

    function getLettersWithPositions(word: string) {
        const wordArray = word.split('');
        const amountOfAppearancesInWord: { letter: string; positions: number[] }[] = [];

        wordArray.forEach(letter => {
            const positions = [];

            for (let i = 0; i < word.length; i++) {
                if (word[i] === letter) {
                    positions.push(i);
                }
            }

            if (! amountOfAppearancesInWord.find(item => item.letter === letter)) {
                amountOfAppearancesInWord.push({letter, positions});
            }
        });

        return amountOfAppearancesInWord;
    }

    
    useEffect(() => {
        if (possibleWords.length > 0) {
            setSolution(possibleWords[Math.floor(Math.random() * possibleWords.length)]);
        }
    }, [possibleWords]);

    const [currentGuess, setCurrentGuess] = useState('');
    const [tries, setTries] = useState(0);
    const [wordConfirmed, setWordConfirmed] = useState(false);

    useEffect(() => {
        if (!wordConfirmed) return;

        if (currentGuess.toUpperCase() === solution) {
            setGridTemplate(prev => {
                const newGrid = [...prev];
                newGrid[tries] = getLetterStatus(currentGuess.toUpperCase(), solution).map((status, idx) => ({
                    letter: currentGuess.toUpperCase()[idx],
                    status: status
                }));
                return newGrid;   
            });
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
        });
        setWordConfirmed(false);
        setTries(prev => prev + 1);
        setCurrentGuess('');
    }, [wordConfirmed]);

    function letterIsContainedInWord(letter: string, word: { letter: string; positions: number[] }[]) {
        if (word.find(l => l.letter === letter)) return true;

        return false;
    }

    function letterIsInCorrectSpot(letter: string, spot: number, solution: { letter: string; positions: number[] }) {
        if ((letter !== solution?.letter) || ! solution.positions.includes(spot)) return false;

        return true;
    }

    function allOfLetterPositionsGuessed(word: { letter: string; positions: number[] }, solution: { letter: string; positions: number[] }) {
        if(solution.positions.every(pos => word.positions.includes(pos))) {
            return true;
        }

        return false;
    }

    function getLetterStatus(word: string, solution: string) {
        const wordObject = getLettersWithPositions(word);
        const solutionObject = getLettersWithPositions(solution);

        return word.split('').map((letter, idx) => {
            const letterInWord = wordObject.find(l => l.letter === letter);
            const letterInSolution = solutionObject.find(l => l.letter === letter);
            if (letterIsInCorrectSpot(letter, idx, letterInSolution!)) {
                return 'correct';
            }
            if (letterIsContainedInWord(letter, solutionObject)) {
                if (allOfLetterPositionsGuessed(letterInWord!, letterInSolution!)) {
                    return 'false';
                } else {
                    return 'misplaced';
                }
            }
            
            return 'false';
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
        });
    }, [currentGuess]);


  return (
    <div className="game-container">
        <div className="header">
            <h1>Wordle</h1>
            <button className='help-button' onClick={() => setShowHelp(prev => !prev)}>
            ?
            </button>
        </div>
        <Grid grid={gridTemplate} />
        {tries < 6 && (
            <Keyboard currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} setWordConfirmed={setWordConfirmed}/>
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
  )
}

export default GameArea