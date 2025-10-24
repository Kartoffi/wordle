import './App.css'
import Help from './components/Help'
import GameArea from './components/GameArea'
import { useState, useEffect } from 'react'

function App() {

  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    setShowHelp(true)
  }, [])

  return (
    <>
      <GameArea />
      {showHelp && (
        <Help setShowHelp={setShowHelp} />
      )}
    </>
  )
}

export default App
