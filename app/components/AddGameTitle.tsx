import { useState, useEffect } from 'react'

interface AddGameTitleProps {
  onAddGame: (game: string) => void
  currentPlayer: string
  totalGames: number
  maxGames: number
}

export default function AddGameTitle({ onAddGame, currentPlayer, totalGames, maxGames }: AddGameTitleProps) {
  const [gameTitle, setGameTitle] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (gameTitle.length > 2) {
        const response = await fetch(`/api/game-suggestions?query=${gameTitle}`)
        const data = await response.json()
        setSuggestions(data.suggestions)
      } else {
        setSuggestions([])
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [gameTitle])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (gameTitle && totalGames < maxGames) {
      await fetch('/api/game-added', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game: gameTitle }),
      })
      onAddGame(gameTitle)
      setGameTitle('')
      setSuggestions([])
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-accent text-center">Add Game Title</h2>
      <p className="text-center text-lg">
        {currentPlayer ? `${currentPlayer}'s turn` : 'Waiting for player...'}
      </p>
      <p className="text-center text-lg text-accent">
        {totalGames} / {maxGames} games submitted
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={gameTitle}
            onChange={(e) => setGameTitle(e.target.value)}
            placeholder="Enter game title"
            className="pixel-input w-full"
            disabled={totalGames >= maxGames}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-secondary border-2 border-primary rounded-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-primary cursor-pointer"
                  onClick={() => {
                    setGameTitle(suggestion)
                    setSuggestions([])
                  }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button 
          type="submit" 
          className="pixel-btn w-full" 
          disabled={totalGames >= maxGames}
        >
          {totalGames >= maxGames ? 'Max Games Reached' : 'Add Game'}
        </button>
      </form>
    </div>
  )
}

