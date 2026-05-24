'use client'
import { useState } from 'react'
import {Stop} from '@/types/trip'
import styles from './StopCard.module.scss'

const TYPE_ICONS: Record<string, string> = {
  food:          '🍽️',
  attraction:    '🌉',
  nature:        '🌳',
  music:         '🎵',
  rest:          '⏸️',
  fuel:          '⛽',
  accommodation: '🏕️',
}

interface StopCardProps {
    stop: Stop,
    id: number,
}

const ChevronIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export default function StopCard({stop, id}: StopCardProps){
    const [isExpanded, setIsExpanded] = useState<boolean>(id === 0 ? true : false)

    const toggleCollapsible = () =>{
        setIsExpanded(!isExpanded)
    }

    return(
        <div className={styles.card}>
            <div className={styles.header} onClick={toggleCollapsible} aria-expanded={isExpanded} >
                <span className={styles.icon}>
                    {TYPE_ICONS[stop.type] ?? '📍'}
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