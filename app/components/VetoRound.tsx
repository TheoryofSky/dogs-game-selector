'use client'

interface VetoRoundProps {
  games: string[]
  onVeto: (game: string) => void
}

export default function VetoRound({ games, onVeto }: VetoRoundProps) {
  const handleVeto = async (game: string) => {
    await fetch('/api/game-vetoed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game }),
    })
    onVeto(game)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Veto Round</h2>
      <p>Each player can remove one game from the list.</p>
      <ul className="space-y-2">
        {games.map((game) => (
          <li key={game} className="flex justify-between items-center">
            <span>{game}</span>
            <button onClick={() => handleVeto(game)} className="pixel-btn bg-red-500 hover:bg-red-600">
              Veto
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}