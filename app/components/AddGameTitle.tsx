import { useState } from 'react'

interface AddGameTitleProps {
  onAddGame: (game: string) => void
}

export default function AddGameTitle({ onAddGame }: AddGameTitleProps) {
  const [gameTitle, setGameTitle] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (gameTitle) {
      await fetch('/api/game-added', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: gameTitle }),
      })
      onAddGame(gameTitle)
      setGameTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={gameTitle}
        onChange={(e) => setGameTitle(e.target.value)}
        placeholder="Enter game title"
        className="pixel-input w-full"
      />
      <button type="submit" className="pixel-btn w-full">
        Add Game
      </button>
    </form>
  )
}

