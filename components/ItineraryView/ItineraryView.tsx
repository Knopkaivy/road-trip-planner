'use client'

import { useTripStore } from '@/store/useTripStore'
import DayCard from '../DayCard/DayCard'
import styles from './ItineraryView.module.scss'

export default function ItineraryView(){
    const {itinerary, reset} = useTripStore()

    if(!itinerary) return null

    return(
        <div className={styles.wrapper}>
            <div className={styles.hero}>
                <div className={styles.heroInner}>
                    <p className={styles.eyebrow}>Your Road Trip</p>
                    <h1 className={styles.title}>{itinerary.origin} → {itinerary.destination} </h1>

                    <div className={styles.stats}>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{itinerary.totalMiles}</span>
                            <span className={styles.statLabel}>Miles</span>
                        </div>
                        <div className={styles.divider}></div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{itinerary.days.reduce((acc, d)=> acc + d.stops.length, 0)}</span>
                            <span className={styles.statLabel}>Stops</span>
                        </div>

                        <div className={styles.divider}></div>
                        <div className={styles.stat}>
                            <span className={styles.statValue}>{itinerary.vibe.charAt(0).toUpperCase() + itinerary.vibe.slice(1)}</span>
                            <span className={styles.statLabel}>Vibe</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.days}>
                    {itinerary.days.map((day, index)=>(
                        <DayCard key={index} day={day}/>
                    ))}
                </div>

                <div className={styles.footer}>
                    <p>Got more ideas?</p>
                    <button className={styles.resetButton} onClick={reset}>Plan Another Trip</button>
                </div>
            </div>
        </div>
    )
}