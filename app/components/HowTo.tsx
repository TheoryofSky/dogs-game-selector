import { useState } from 'react'

export default function HowTo() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-4">
      <button onClick={() => setIsOpen(!isOpen)} className="pixel-btn">
        How to Play
      </button>
      {isOpen && (
        <div className="mt-2 p-4 bg-gray-100 rounded">
          <h3 className="text-xl font-bold mb-2">Game Rules:</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>Join the waiting room and wait for your friends.</li>
            <li>Once everyone is ready, start the game.</li>
            <li>Take turns submitting game titles.</li>
            <li>In the veto round, each player can remove one game.</li>
            <li>Finally, rank the remaining games to decide what to play!</li>
          </ol>
        </div>
      )}
    </div>
  )
}

