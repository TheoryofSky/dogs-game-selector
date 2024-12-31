interface GameListProps {
  games: string[]
}

export default function GameList({ games }: GameListProps) {
  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-2">Submitted Games:</h3>
      <ul className="list-disc list-inside">
        {games.map((game) => (
          <li key={game}>{game}</li>
        ))}
      </ul>
    </div>
  )
}

