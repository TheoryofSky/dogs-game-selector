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

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
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