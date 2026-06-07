export type StopType = 
  | 'food'
  | 'attraction'
  | 'nature'
  | 'music'
  | 'rest'
  | 'fuel'
  | 'accommodation'

export interface Stop {
  name: string
  type: StopType
  description: string
  tip: string
  duration: string,
  stopCoordinates: [number, number]
}

export interface Day {
  day: number
  title: string
  from: string
  to: string
  miles: number
  stops: Stop[]
  overnight: string
}

export interface ItineraryMeta {
  origin: string
  destination: string
  totalDays: number
  totalMiles: number
  vibe: string
  originCoordinates: [number, number]
  destinationCoordinates: [number, number]
}

export interface Itinerary extends ItineraryMeta {
  days: Day[]
}

export interface TripFormData {
  origin: string
  destination: string
  days: number
  vibe: string
}

export interface SavedTrip {
  id: string,
  savedAt: string,
  label: string,
  itinerary: Itinerary
}