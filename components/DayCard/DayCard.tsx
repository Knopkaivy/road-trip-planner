import {Day} from '@/types/trip'
import StopCard from '../StopCard/StopCard'
import styles from './DayCard.module.scss'

interface DayCardProps {
    day: Day
}

export default function DayCard({day}: DayCardProps){
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.dayBadge}>Day {day.day}</div>
                <h3 className={styles.title}>{day.title}</h3>
            </div>

            <div className={styles.route}>
                <div className={styles.routePoint}>
                    <span className={styles.dot}></span>
                    <span>{day.from}</span>
                </div>
                <div className={styles.routeLine}></div>
                <div className={styles.routePoint}>
                    <span className={styles.dot} data-end="true"></span>
                    <span>{day.to}</span>
                </div>
                <div className={styles.miles}>{day.miles} miles</div>
            </div>

            <div className={styles.stops}>
                {day.stops.map((stop, index) =>(
                    <StopCard key={index} stop={stop} />
                ))}
            </div>

            <div className={styles.overnight}>Overnight in <strong>{day.overnight}</strong></div>
        </div>


    )
}