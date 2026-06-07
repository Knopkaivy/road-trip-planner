'use client'

import { useState, useEffect } from 'react'
import { useTripStore } from '@/store/useTripStore'
import { getSavedTrips, deleteSavedTrip, formatSavedDate } from '@/lib/storageUtils'
import { SavedTrip } from '@/types/trip'
import styles from '@/components/SavedTrips/SavedTrips.module.scss'

interface SavedTripsProps {
    onNewTrip: () => void,
    onTripChange: () => void,
    onLoad: () => void
}

export default function SavedTrips({onNewTrip, onTripChange, onLoad}: SavedTripsProps){
    const {setItinerary} = useTripStore()
    const [trips, setTrips] = useState<SavedTrip[]>([])

    useEffect(()=>{
        setTrips(getSavedTrips())
    }, [])

    const handleLoad = (trip: SavedTrip) =>{
        setItinerary(trip.itinerary)
        onLoad() 
    }

    const handleDelete = (id: string) =>{
        deleteSavedTrip(id)
        const updated = getSavedTrips()
        setTrips(updated)
        onTripChange()
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.hero}>
                <div className={styles.heroInner}>
                    <h1 className={styles.title}>Your Saved Trips</h1>
                    <button className={styles.newTripButton} onClick={onNewTrip} >Plan New Trip</button>
                </div>
            </div>

            <div className={styles.inner}>
                <div className={styles.list}>
                    {trips.map(trip =>(
                        <div className={styles.card} key={trip.id} >
                            <div className={styles.cardMain} onClick={() => handleLoad(trip)} >
                                <div className={styles.cardInfo}>
                                    <h3 className={styles.cardLabel}>{trip.label}</h3>
                                    <div className={styles.cardMeta}>
                                        <span>{trip.itinerary.totalDays} days</span>
                                        <span className={styles.dot}>·</span>
                                        <span>{trip.itinerary.totalMiles} miles</span>
                                        <span className={styles.dot}>·</span>
                                        <span className={styles.vibe}>{trip.itinerary.vibe}</span>
                                    </div>
                                    <span className={styles.date}>
                                        Saved {formatSavedDate(trip.savedAt)}
                                    </span>
                                </div>
                                <div className={styles.cardArrow}>→</div>
                            </div>
                            <button className={styles.deleteButton} onClick={() => handleDelete(trip.id)} aria-label='Delete trip' >✕</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}