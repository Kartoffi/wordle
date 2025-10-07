import React from 'react'

const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Back']
];

const Keyboard = ({ currentWord, setCurrentWord, setWordConfirmed, lettersNotInWord }) => {
  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button key={key} className={`key ${lettersNotInWord.includes(key) ? 'inactive' : ''}`} onClick={() => {
              if (currentWord.length === 5 && key !== 'Back' && key !== 'Enter') {
                return;
              }

              if (currentWord.length !== 5 && key === 'Enter') {
                return;
              }

              if (key === 'Back' && currentWord.length > 0) {
                setCurrentWord(currentWord.slice(0, -1));
              }

              if (key === 'Enter' && currentWord.length === 5) {
                setWordConfirmed(true);
              }

              if (key !== 'Back' && key !== 'Enter' && currentWord.length < 5) {
                setCurrentWord(currentWord + key);
              }
            }}>
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

export default Keyboard