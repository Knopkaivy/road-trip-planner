'use client'

import { useTripStore } from "@/store/useTripStore";
import TripForm from "../components/TripForm/TripForm";
import LoadingState from "@/components/LoadingState/LoadingState";
import ItineraryView from "@/components/ItineraryView/ItineraryView";

export default function Home() {
  const {itinerary, isLoading} = useTripStore()

if(isLoading)   return <LoadingState/>
  if(itinerary) return <ItineraryView/>
  return <TripForm/>

}
