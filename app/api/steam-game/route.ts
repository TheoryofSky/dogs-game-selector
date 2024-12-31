import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const gameTitle = searchParams.get('title')

  if (!gameTitle) {
    return NextResponse.json({ error: 'Game title is required' }, { status: 400 })
  }

  try {
    const steamApiKey = process.env.STEAM_API_KEY
    const response = await fetch(`http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${steamApiKey}`)
    const data = await response.json()

    const game = data.applist.apps.find((app: any) => app.name.toLowerCase() === gameTitle.toLowerCase())

    if (game) {
      const gameDetailsResponse = await fetch(`http://store.steampowered.com/api/appdetails?appids=${game.appid}`)
      const gameDetails = await gameDetailsResponse.json()

      return NextResponse.json(gameDetails[game.appid].data)
    } else {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }
  } catch (error) {
    console.error('Error fetching game details:', error)
    return NextResponse.json({ error: 'Failed to fetch game details' }, { status: 500 })
  }
}