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

export interface Itinerary {
  origin: string,
  originCoordinates: [number, number],
  destination: string
  destinationCoordinates: [number, number],
  totalDays: number
  totalMiles: number
  vibe: string
  days: Day[]
}

export interface TripFormData {
  origin: string
  destination: string
  days: number
  vibe: string
}