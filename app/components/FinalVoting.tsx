'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'

interface FinalVotingProps {
  games: string[]
}

export default function FinalVoting({ games }: FinalVotingProps) {
  const [rankedGames, setRankedGames] = useState(games)

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(rankedGames)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setRankedGames(items)
  }

  const handleSubmitVotes = async () => {
    await fetch('/api/final-votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rankedGames }),
    })
    // Handle the response, e.g., show results or move to the next phase
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Final Voting</h2>
      <p>Drag and drop the games to rank them in order of preference.</p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="games">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {rankedGames.map((game, index) => (
                <Draggable key={game} draggableId={game} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 bg-gray-100 rounded"
                    >
                      {game}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleSubmitVotes} className="pixel-btn">
        Submit Votes
      </button>
    </div>
  )
}
