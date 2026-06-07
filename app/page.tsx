'use client'

import { useState, useEffect } from "react";
import { useTripStore } from "@/store/useTripStore";
import { getSavedTrips } from "@/lib/storageUtils";
import TripForm from "../components/TripForm/TripForm";
import LoadingState from "@/components/LoadingState/LoadingState";
import ItineraryView from "@/components/ItineraryView/ItineraryView";
import SavedTrips from "@/components/SavedTrips/SavedTrips";

type View = 'form' | 'saved'

export default function Home() {
  const {itinerary, isLoading, isStreaming} = useTripStore()
  const [view, setView] = useState<View>('form')
  const [hasSavedTrips, setHasSavedTrips] = useState(false)
  const [fromSaved, setFromSaved] = useState(false)

  const handlePlanAnotherTrip = () =>{
    setView('form')
    setFromSaved(false)
  }

  const refreshSaved = () =>{
    setHasSavedTrips(getSavedTrips().length > 0)
  }

  useEffect(()=>{
    refreshSaved()
  }, [])

  if(isLoading)   return <LoadingState/>
  if(isStreaming || itinerary) return <ItineraryView onPlanAnother={handlePlanAnotherTrip} onTripChange={refreshSaved} fromSaved={fromSaved} />
  if(view === 'saved') return <SavedTrips onNewTrip={()=> setView('form')} onTripChange={refreshSaved} onLoad={() => setFromSaved(true)} />

  return <TripForm hasSavedTrips={hasSavedTrips} onViewSaved={()=> setView('saved')} />
  
}
