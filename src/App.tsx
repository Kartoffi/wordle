import './App.css'

const currentGame = [
  [
    { letter: 'W', status: 'false' },
    { letter: 'W', status: 'false' },
    { letter: 'W', status: 'false' },
    { letter: 'W', status: 'false' },
    { letter: 'W', status: 'false' }
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

function App() {
  return (
    <>
      <h1>Wordle</h1>
      <div className="grid">
        {currentGame.map((word, wordIndex) => (
          <div key={wordIndex} className="word">
            {word.map((letterObj, letterIndex) => (
              <div className={`letter-container ${letterObj.status}`} key={letterIndex}>
                <div className={`letter ${letterObj.status}`}>{letterObj.letter}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
