'use client'
import React, { useState } from 'react'
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
}



export default function StopCard({stop, id}: StopCardProps){
    const [isExpanded, setIsExpanded] = useState<boolean>(id === 0 ? true : false)

    const toggleCollapsible = () =>{
        setIsExpanded(!isExpanded)
    }

    return(
        <div className={styles.card}>
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