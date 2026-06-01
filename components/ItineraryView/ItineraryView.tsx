'use client'

import { useState, useRef, useEffect } from 'react'
import { useTripStore } from '@/store/useTripStore'
import Map from '../Map/Map'
import DayCard from '../DayCard/DayCard'
import { ChevronIcon } from '../icons/UIIcons'
import styles from './ItineraryView.module.scss'

const MOBILE_MAX_WIDTH = 480
const MOBILE_MAP_HEIGHT = 300

export default function ItineraryView(){
    const {itinerary, reset} = useTripStore()
    const [isExpanded, setIsExpanded] = useState<boolean>(true)
    const contentLeftRef = useRef<HTMLDivElement | null>(null)
    const contentRightRef = useRef<HTMLDivElement | null >(null)
    const headingRef = useRef<HTMLDivElement | null >(null)

    useEffect(() => {
        updateHeight(true)
    }, [])

    useEffect(()=>{
        const handleResize = () =>{
            if(!contentRightRef.current) return
            contentRightRef.current.style.height = ''
            setIsExpanded(true)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const toggleCollapsible = () =>{
        const newState = !isExpanded
        setIsExpanded(newState)
        updateHeight(newState)
    }

    const updateHeight = (expanded: boolean) =>{
        if(!contentRightRef.current || !headingRef.current) return
        if(window.innerWidth > MOBILE_MAX_WIDTH) return
        const headingHeight = headingRef.current.getBoundingClientRect().height
        if(expanded){
            contentRightRef.current.style.height = `${headingHeight + MOBILE_MAP_HEIGHT}px`
        } else {
            contentRightRef.current.style.height = `${headingHeight +10}px`
        }
    }

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
                            <span className={styles.statValue}>{itinerary.vibe}</span>
                            <span className={styles.statLabel}>Vibe</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.content}>
                <div ref={contentLeftRef} className={styles.contentLeft}>
                    <div className={styles.days}>
                        {(()=>{
                            let stopIndex = 1
                            return itinerary.days.map((day, dayIndex)=>{
                                const startIndex = stopIndex
                                stopIndex += day.stops.length
                                return (
                                    <DayCard key={dayIndex} day={day} startStopIndex={startIndex} scrollContainerRef={contentLeftRef}/>
                                )
                            })
                        })()}
                    </div>
                </div>

                <div ref={contentRightRef} className={styles.contentRight}>
                    <div ref={headingRef} className={styles.collapsibleMobileHeading} onClick={toggleCollapsible} aria-expanded={isExpanded}>
                        <span>{`${ isExpanded ? 'Hide' : 'Show'} Map`}</span>
                        <div className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}><ChevronIcon/></div>
                    </div>
                    <div className={`${styles.collapsibleMobile} ${isExpanded ? styles.expanded : ''}`} aria-hidden={!isExpanded}>
                        <Map/>
                    </div>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.resetButton} onClick={reset}>Plan Another Trip</button>
            </div>
        </div>
    )
}