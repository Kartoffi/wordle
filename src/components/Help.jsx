const Help = ({ setShowHelp}) => {
  return (
    <div className="help-window absolute top-0 left-0 bg-white w-[100%] h-[100%] text-center p-8">
        <button className='absolute right-4 top-4 rounded-[50%] w-[40px] h-[40px] bg-gray-500 text-white hover:bg-white hover:text-black cursor-pointer' onClick={ () => setShowHelp(false)}>
        X
        </button>
        <h2 className="text-2xl font-bold mt-20 mb-8">HOW TO PLAY</h2>
        <p>Guess the WORDLE in <b>six tries.</b></p>
        <p>Each guess must be a <b>valid five-letter word</b>. Hit the enter button to submit.</p>
        <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
        <h3 className="text-xl font-bold mt-8 mb-4">Examples</h3>
        <div className="examples">
        <div className="example">
            <div className="letter-container correct">
            <div className="letter correct">W</div>
            </div>
            <p>The letter W is in the word and in the <b> correct </b>spot.</p>
        </div>
        <div className="example">
            <div className="letter-container misplaced">
            <div className="letter misplaced">I</div>
            </div>
            <p>The letter I is in the word but in the <b>wrong</b> spot.</p>
        </div>
        <div className="example">
            <div className="letter-container false">
            <div className="letter false">U</div>
            </div>
            <p>The letter U <b>is not in the word</b> in any spot.</p>
        </div>
        </div>
    </div>
  );
};

export default Help;