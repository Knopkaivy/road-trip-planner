import {create} from 'zustand'
import { TripFormData, Itinerary } from '../types/trip'

interface TripStore {
    formData: TripFormData | null,
    itinerary: Itinerary | null,
    isLoading: boolean,
    error: string | null,
    activeStopIndex: number | null,

    setFormData: (data: TripFormData | null) => void,
    setItinerary: (itinerary: Itinerary | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    setActiveStopIndex: (index: number | null) => void,
    reset: () => void,
}

export const useTripStore = create<TripStore>(set =>({
    formData: null,
    itinerary: null,
    isLoading: false,
    error: null,
    activeStopIndex: null,

    setFormData: (data) => set({formData: data}),
    setItinerary: (itinerary) => set({itinerary}),
    setLoading: (loading) => set({isLoading: loading}),
    setError: (error) => set({error}),
    setActiveStopIndex: (index) => set({activeStopIndex: index}),
    reset: () => set({formData: null, itinerary: null, isLoading: false, error: null, activeStopIndex: null},)
}))