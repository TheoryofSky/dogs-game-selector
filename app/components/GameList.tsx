interface GameListProps {
  games: string[]
}

export default function GameList({ games }: GameListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-2 text-accent">Submitted Games:</h3>
      <ul className="list-disc list-inside space-y-2 bg-primary bg-opacity-50 p-4 rounded">
        {games.map((game) => (
          <li key={game} className="text-lg">{game}</li>
        ))}
      </ul>
    </div>
  )
}

