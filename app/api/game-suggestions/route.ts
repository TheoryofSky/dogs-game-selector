import { NextResponse } from 'next/server'

const STEAM_API_KEY = process.env.STEAM_API_KEY

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(`http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=${STEAM_API_KEY}`)
    const data = await response.json()

    const suggestions = data.applist.apps
      .filter((app: any) => app.name.toLowerCase().includes(query.toLowerCase()))
      .map((app: any) => app.name)
      .slice(0, 5)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching game suggestions:', error)
    return NextResponse.json({ error: 'Failed to fetch game suggestions' }, { status: 500 })
  }
}

