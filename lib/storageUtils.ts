import { SavedTrip, Itinerary } from '@/types/trip'

const STORAGE_KEY = 'road_trip_saved'

export const getSavedTrips = (): SavedTrip[] =>{
    try{
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch{
        return []
    }
}

export const saveTrip = (itinerary: Itinerary): SavedTrip =>{
    const trips = getSavedTrips()

    const newTrip: SavedTrip = {
        id: crypto.randomUUID(),
        savedAt: new Date().toISOString(),
        label: `${itinerary.origin} → ${itinerary.destination}`,
        itinerary
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify([newTrip, ...trips]))
    return newTrip
}

export const deleteSavedTrip = (id: string): void =>{
    const trips: SavedTrip[] = getSavedTrips().filter(trip => trip.id !== id)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips))
}

export const formatSavedDate = (isoString: string): string =>{
    return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

export const formatItineraryText = (itinerary: Itinerary): string =>{
    const lines: string[] = []
    const divider = '─────────────────────────────'

    lines.push(`Road Trip: ${itinerary.origin} → ${itinerary.destination}`)
    lines.push(`${itinerary.totalDays} Days · ${itinerary.totalMiles} Miles · ${itinerary.vibe.charAt(0).toUpperCase() + itinerary.vibe.slice(1)} Vibe`)
    lines.push('')

    for (const day of itinerary.days){
        lines.push(divider)
        lines.push(`DAY ${day.day} — ${day.title}`)
        lines.push(`${day.from} → ${day.to} · ${day.miles} miles`)
        lines.push('')

        for(const stop of day.stops){
            lines.push(`  • ${stop.name} — ${stop.duration}`)
        }

        lines.push('')
        lines.push(`Overnight: ${day.overnight}`)
        lines.push('')
    }

    lines.push(divider)
    lines.push('')
    lines.push('Planned with AI Road Trip Planner')
    lines.push('https://road-trip-planner-teal.vercel.app')

    return lines.join('\n')
}