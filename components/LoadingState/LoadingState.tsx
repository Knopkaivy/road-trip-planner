'use client'

import LoadingCard from '../LoadingCard/LoadingCard'
import styles from './LoadingState.module.scss'

export default function LoadingState(){
    return(
        <div className={styles.wrapper}>
            <LoadingCard/>
        </div>
    )
}