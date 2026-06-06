import {create} from 'zustand'
import { TripFormData, Day, Itinerary, ItineraryMeta } from '../types/trip'

interface TripStore {
    formData: TripFormData | null,
    itinerary: Itinerary | null,
    isLoading: boolean,
    error: string | null,
    activeStopIndex: number | null,
    theme: 'dark' | 'light',
    streamedMeta: ItineraryMeta | null,
    streamedDays: Day[],
    isStreaming: boolean

    setFormData: (data: TripFormData | null) => void,
    setItinerary: (itinerary: Itinerary | null) => void,
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    setActiveStopIndex: (index: number | null) => void,
    setTheme: (theme: 'dark' | 'light') => void,
    setStreamedMeta: (streamedMeta: ItineraryMeta) => void,
    addStreamedDay: (streamedDay: Day) => void,
    setIsStreaming: (isStreaming: boolean) => void,

    finalizeItinerary: () => void,
    reset: () => void,
}

export const useTripStore = create<TripStore>((set, get) =>({
    formData: null,
    itinerary: null,
    isLoading: false,
    error: null,
    activeStopIndex: null,
    theme: 'light',
    streamedMeta: null,
    streamedDays: [],
    isStreaming: false,

    setFormData: (data) => set({formData: data}),
    setItinerary: (itinerary) => set({itinerary}),
    setLoading: (loading) => set({isLoading: loading}),
    setError: (error) => set({error}),
    setActiveStopIndex: (index) => set({activeStopIndex: index}),
    setTheme: (theme) => set({theme}),
    setStreamedMeta: (streamedMeta) => set({streamedMeta}),
    addStreamedDay: (streamedDay) => set((state) => ({
        streamedDays: [...state.streamedDays, streamedDay]
    })),
    setIsStreaming: (isStreaming) => set({isStreaming}),

    finalizeItinerary: () => {
        const {streamedMeta, streamedDays} = get()
        if(!streamedMeta) return
        set({
            itinerary: {...streamedMeta, days: streamedDays},
            isStreaming: false,
            isLoading: false
        })
    },
    reset: () => set({
        formData: null, 
        itinerary: null, 
        isLoading: false, 
        error: null, 
        activeStopIndex: null,
        streamedMeta: null,
        streamedDays: [],
        isStreaming: false
    },)
}))