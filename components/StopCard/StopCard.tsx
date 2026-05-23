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
    stop: Stop
}

export default function StopCard({stop}: StopCardProps){
    return(
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.icon}>
                    {TYPE_ICONS[stop.type] ?? '📍'}
                </span>
                <div className={styles.meta}>
                    <h4 className={styles.name}>{stop.name}</h4>
                    <span className={styles.duration}>{stop.description}</span>
                </div>
            </div>

            <p className={styles.description}>{stop.description}</p>

            <div className={styles.tip}>
                <span className={styles.tipLabel}>Insider tip</span>
                <p>{stop.tip}</p>
            </div>
        </div>
    )

}