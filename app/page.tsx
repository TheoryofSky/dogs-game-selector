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
  const [currentPlayer, setCurrentPlayer] = useState<string>('')

  useEffect(() => {
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

    if (!pusherKey || !pusherCluster) {
      console.error('Pusher configuration is missing. Key:', pusherKey, 'Cluster:', pusherCluster)
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

      channel.bind('current-player', (data: { player: string }) => {
        setCurrentPlayer(data.player)
      })

      return () => {
        pusher.unsubscribe('dogs-game')
      }
    } catch (err) {
      console.error('Pusher initialization error:', err)
      setError('Failed to initialize Pusher. Please try again later.')
    }
  }, [])

  const changeGamePhase = async (newPhase: GamePhase) => {
    try {
      await fetch('/api/phase-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase }),
      })
      setGamePhase(newPhase)
    } catch (err) {
      console.error('Failed to change game phase:', err)
      setError('Failed to change game phase. Please try again.')
    }
  }

  const renderCurrentPhase = () => {
    switch (gamePhase) {
      case 'waiting':
        return (
          <>
            <WaitingRoom players={players} onStart={() => changeGamePhase('submitting')} />
            <HowTo />
          </>
        )
      case 'submitting':
        return (
          <>
            <AddGameTitle 
              onAddGame={(game) => setGames([...games, game])} 
              currentPlayer={currentPlayer}
              totalGames={games.length}
              maxGames={4}
            />
            <GameList games={games} />
            {games.length === 4 && (
              <button onClick={() => changeGamePhase('vetoing')} className="pixel-btn mt-4 w-full">
                Move to Veto Round
              </button>
            )}
          </>
        )
      case 'vetoing':
        return (
          <>
            <VetoRound games={games} onVeto={(game) => setGames(games.filter((g) => g !== game))} />
            <button onClick={() => changeGamePhase('voting')} className="pixel-btn mt-4 w-full">
              Move to Final Voting
            </button>
          </>
        )
      case 'voting':
        return <FinalVoting games={games} />
      default:
        return null
    }
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4 pixel-bg">
        <div className="pixel-card w-full max-w-md">
          <h1 className="pixel-title">D.O.G.S</h1>
          <div className="bg-accent bg-opacity-20 border border-accent text-white px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 pixel-bg">
      <div className="pixel-card w-full max-w-2xl">
        <h1 className="pixel-title">D.O.G.S</h1>
        {renderCurrentPhase()}
      </div>
    </main>
  )
}

