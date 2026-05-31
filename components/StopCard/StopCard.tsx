'use client'

import React, { useEffect, useRef, useState } from 'react'
import {useTripStore} from '@/store/useTripStore'
import {Stop} from '@/types/trip'
import {
  FoodIcon,
  AttractionIcon,
  NatureIcon,
  MusicIcon,
  RestIcon,
  FuelIcon,
  AccommodationIcon
} from '@/components/icons/StopIcons'
import { ChevronIcon } from '../icons/UIIcons'
import styles from './StopCard.module.scss'

const TYPE_ICONS: Record<string, React.ReactElement> = {
  food:          <FoodIcon />,
  attraction:    <AttractionIcon />,
  nature:        <NatureIcon />,
  music:         <MusicIcon />,
  rest:          <RestIcon />,
  fuel:          <FuelIcon />,
  accommodation: <AccommodationIcon />,
}

interface StopCardProps {
    stop: Stop,
    id: number,
    stopIndex: number,
    scrollContainerRef: React.RefObject<HTMLDivElement | null>
}



export default function StopCard({stop, id, stopIndex, scrollContainerRef}: StopCardProps){
    const [isExpanded, setIsExpanded] = useState<boolean>(id === 0 ? true : false)
    const { activeStopIndex, setActiveStopIndex } = useTripStore()
    const cardRef = useRef<HTMLDivElement | null>(null)

    useEffect(()=>{
        if(activeStopIndex === stopIndex && cardRef.current && scrollContainerRef?.current){
            
            const container = scrollContainerRef.current
            const card = cardRef.current
            
            const containerTop = container.getBoundingClientRect().top
            const cardTop = card.getBoundingClientRect().top
            const offset = cardTop - containerTop + container.scrollTop
            
            container.scrollTo({
                top: offset,
                behavior: 'smooth'
            })
            
            setIsExpanded(true)
        }
    }, [activeStopIndex])

    const toggleCollapsible = () =>{
        setIsExpanded(!isExpanded)
        if(activeStopIndex !== stopIndex) setActiveStopIndex(stopIndex)
    }

    return(
        <div ref={cardRef} className={`${styles.card} ${activeStopIndex === stopIndex ? styles.active : ''}`}>
            <div className={styles.header} onClick={toggleCollapsible} aria-expanded={isExpanded} >
                <span className={styles.icon}>
                    {TYPE_ICONS[stop.type] ?? <AttractionIcon />}
                </span>
                <div className={styles.meta}>
                    <h4 className={styles.name}>{stop.name}</h4>
                    <span className={styles.duration}>{stop.duration}</span>
                </div>
                <div className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}><ChevronIcon/></div>
            </div>

            <div className={`${styles.details} ${isExpanded ? styles.expanded : ''}`} aria-hidden={!isExpanded}>
                <div className={styles.inner}>
                    <p className={styles.description}>{stop.description}</p>
                    <div className={styles.tip}>
                        <span className={styles.tipLabel}>Insider tip</span>
                        <p>{stop.tip}</p>
                    </div>
                </div>
            </div>
        </div>
    )

}