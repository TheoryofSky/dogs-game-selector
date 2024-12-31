import { useState } from 'react'

interface WaitingRoomProps {
  players: string[]
  onStart: () => void
}

export default function WaitingRoom({ players, onStart }: WaitingRoomProps) {
  const [playerName, setPlayerName] = useState('')

  const handleJoin = async () => {
    if (playerName) {
      await fetch('/api/player-joined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: playerName }),
      })
      setPlayerName('')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-accent">Waiting Room</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          className="pixel-input flex-grow"
        />
        <button onClick={handleJoin} className="pixel-btn">
          Join
        </button>
      </div>
      <ul className="list-disc list-inside space-y-2 bg-primary bg-opacity-50 p-4 rounded">
        {players.map((player) => (
          <li key={player} className="text-lg">{player}</li>
        ))}
      </ul>
      {players.length > 1 && (
        <button onClick={onStart} className="pixel-btn w-full">
          Start Game
        </button>
      )}
    </div>
  )
}

