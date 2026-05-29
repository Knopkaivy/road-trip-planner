'use client'

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import styles from './Map.module.scss'

export default function Map(){

    const mapRef = useRef<mapboxgl.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(()=>{
        if(!mapContainerRef.current) return

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        if (!token) throw new Error('Mapbox token is missing from .env.local')
        mapboxgl.accessToken = token

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [-71.06776, 42.35816],
            zoom: 9
        })

          mapRef.current.on('load', () => {
            mapRef.current?.resize()
        })
        
        return () => {
            mapRef.current?.remove()
        }
    },[])

    return (
        <>
            <div id='map-container' ref={mapContainerRef} className={styles.mapWrapper}/>
        </>
    )
}