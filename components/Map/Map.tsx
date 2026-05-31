'use client'

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import { useTripStore } from '@/store/useTripStore'
import { addMarker, buildRouteCoordinates, createMarker } from '@/lib/mapUtils'
import 'mapbox-gl/dist/mapbox-gl.css'
import './Map.scss'
import styles from './Map.module.scss'


const DEFAULT_MAP_CENTER: [number, number] = [-98.5795, 39.8283]

export default function Map(){

    const {itinerary, activeStopIndex, setActiveStopIndex} = useTripStore()
    const mapRef = useRef<mapboxgl.Map | null>(null)
    const popupRefs = useRef<mapboxgl.Popup[]>([])
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const markerRefs = useRef<{el: HTMLElement, index: number}[]>([])
    
    const getMapCenter = (): [number, number] =>{
        if(!itinerary) return DEFAULT_MAP_CENTER

        return [(itinerary.originCoordinates[0] + itinerary.destinationCoordinates[0]) / 2,
                (itinerary.originCoordinates[1] + itinerary.destinationCoordinates[1]) / 2]
    }


    useEffect(()=>{
        if(!mapContainerRef.current) return

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
        if (!token) throw new Error('Mapbox token is missing from .env.local')
        
        mapboxgl.accessToken = token

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: getMapCenter(),
            zoom: 5
        })
        
        mapRef.current.on('load', () => {
            mapRef.current?.resize()
            if (!itinerary || !mapRef.current) return

            const bounds = new mapboxgl.LngLatBounds()
            const markerEls: { el: HTMLElement, index: number }[] = []
            markerRefs.current = markerEls

            const originEl = createMarker('#22c55e', 'lg')
            const originPopup = addMarker(mapRef.current, itinerary.originCoordinates, originEl, itinerary.origin, bounds, markerEls, 0)
            popupRefs.current.push(originPopup)

            let i = 1
            for (const day of itinerary.days) {
                for (const stop of day.stops) {
                    const index = i
                    const stopEl = createMarker('#ffffff', 'sm')
                    const stopPopup = addMarker(mapRef.current, stop.stopCoordinates, stopEl, stop.name, bounds, markerEls, index)
                    popupRefs.current.push(stopPopup)
                    stopEl.addEventListener('click', () =>{
                        setActiveStopIndex(index)
                    })
                    i++
                }
            }

            const destEl = createMarker('#e94560', 'lg')
            const destPopup = addMarker(mapRef.current, itinerary.destinationCoordinates, destEl, itinerary.destination, bounds, markerEls, i)
            popupRefs.current.push(destPopup)

            bounds.extend(itinerary.destinationCoordinates)

            mapRef.current.fitBounds(bounds, {
                padding: 60,
                maxZoom: 12
            })

            mapRef.current.addSource('route', {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: buildRouteCoordinates(itinerary)
                    }
                }
            })

            mapRef.current.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#e94560',
                    'line-width': 3,
                }
            })
        })
        
        return () => {
            mapRef.current?.remove()
        }
    },[])

    const flyToStop = (stopIndex: number) =>{
        if (!mapRef.current || !itinerary) return
        const allStops = itinerary.days.flatMap(day => day.stops)
        const activeStop = allStops[stopIndex]

        if(activeStop){
            mapRef.current.flyTo({
                center: activeStop.stopCoordinates,
                duration: 1000
            })
        }
    }

    const updateActiveMarker = () =>{
            markerRefs.current.forEach(({el, index})=>{
            const isActive = index === activeStopIndex
            el.style.width = isActive ? '18px' : '10px'
            el.style.height = isActive ? '18px' : '10px'
            el.style.background = isActive ? '#e94560' : '#ffffff'
            el.style.zIndex = isActive ? '10' : '1'
        })
    }

    const updateActivePopup = (stopIndex: number) =>{
        if (!mapRef.current) return

        popupRefs.current.forEach(popup => popup.remove())

        const activePopup = popupRefs.current[stopIndex]
        if(activePopup) activePopup.addTo(mapRef.current)
    }

    useEffect(()=>{

        if (activeStopIndex === null || !mapRef.current || !itinerary) return

        updateActiveMarker()
        updateActivePopup(activeStopIndex)
        flyToStop(activeStopIndex - 1)

    }, [activeStopIndex])

    return (
        <>
            <div id='map-container' ref={mapContainerRef} className={styles.mapWrapper}/>
        </>
    )
}