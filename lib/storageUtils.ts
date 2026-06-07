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