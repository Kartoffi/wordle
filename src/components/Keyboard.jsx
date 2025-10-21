import '../Keyboard.css';

const Keyboard = ({ currentGuess, setCurrentGuess, setWordConfirmed }) => {

  const rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Back']
  ];

  return (
    <div className="keyboard">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="keyboard-row">
          {row.map((key) => (
            <button key={key} className="key" onClick={async () => {
              if (currentGuess.length === 5 && key !== 'Back' && key !== 'Enter') {
                return;
              }

              if (currentGuess.length !== 5 && key === 'Enter') {
                return;
              }

              if (key === 'Back' && currentGuess.length > 0) {
                setCurrentGuess(currentGuess.slice(0, -1));
              }

              if (key === 'Enter' && currentGuess.length === 5) {
                setWordConfirmed(true);
              }

              if (key !== 'Back' && key !== 'Enter' && currentGuess.length < 5) {
                setCurrentGuess(currentGuess + key);
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