'use client'

import { useState, useEffect } from 'react'
import WaitingRoom from './components/WaitingRoom'
import HowTo from './components/HowTo'
import AddGameTitle from './components/AddGameTitle'
import GameList from './components/GameList'
import VetoRound from './components/VetoRound'
import FinalVoting from './components/FinalVoting'
import Pusher from 'pusher-js'

type GamePhase = 'waiting' | 'submitting' | 'vetoing' | 'voting'

export default function Home() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('waiting')
  const [players, setPlayers] = useState<string[]>([])
  const [games, setGames] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

    if (!pusherKey || !pusherCluster) {
      setError('Pusher configuration is missing. Please check your environment variables.')
      return
    }

    try {
      const pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      })

      const channel = pusher.subscribe('dogs-game')

      channel.bind('player-joined', (data: { player: string }) => {
        setPlayers((prevPlayers) => [...prevPlayers, data.player])
      })

      channel.bind('game-added', (data: { game: string }) => {
        setGames((prevGames) => [...prevGames, data.game])
      })

      channel.bind('game-vetoed', (data: { game: string }) => {
        setGames((prevGames) => prevGames.filter((game) => game !== data.game))
      })

      channel.bind('phase-change', (data: { phase: GamePhase }) => {
        setGamePhase(data.phase)
      })

      return () => {
        pusher.unsubscribe('dogs-game')
      }
    } catch (err) {
      setError('Failed to initialize Pusher. Please try again later.')
      console.error('Pusher initialization error:', err)
    }
  }, [])

  const renderCurrentPhase = () => {
    switch (gamePhase) {
      case 'waiting':
        return <WaitingRoom players={players} onStart={() => setGamePhase('submitting')} />
      case 'submitting':
        return (
          <>
            <AddGameTitle onAddGame={(game) => setGames([...games, game])} />
            <GameList games={games} />
          </>
        )
      case 'vetoing':
        return <VetoRound games={games} onVeto={(game) => setGames(games.filter((g) => g !== game))} />
      case 'voting':
        return <FinalVoting games={games} />
      default:
        return null
    }
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">D.O.G.S</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">D.O.G.S</h1>
      <HowTo />
      {renderCurrentPhase()}
    </main>
  )
}

