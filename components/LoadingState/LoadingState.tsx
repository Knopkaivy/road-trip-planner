'use client'

import styles from './LoadingState.module.scss'

const MESSAGES = [
  'Scouting the best scenic routes...',
  'Finding hidden roadside gems...',
  'Checking out local food spots...',
  'Plotting the perfect stops...',
  'Almost ready to hit the road...',
]

export default function LoadingState(){
    return(
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <span className={styles.car}>🚗</span>
                    <div className={styles.road}>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                        <div className={styles.line}></div>
                    </div>
                </div>

                <h2 className={styles.title}>Planning your road trip</h2>

                <div className={styles.messages}>
                    {MESSAGES.map((msg, index) => (
                        <p className={styles.message} key={index} style={{animationDelay: `${index * 1.2}s`}}>{msg}</p>
                    ))}
                </div>
                <div className={styles.dots}>
                    <span style={{animationDelay: '0s'}}></span>
                    <span style={{animationDelay: '0.2s'}}></span>
                    <span style={{animationDelay: '0.4s'}}></span>
                </div>
            </div>
        </div>
    )
}