import mapboxgl from 'mapbox-gl'
import { Itinerary } from "@/types/trip";

export const addMarker = (
    map: mapboxgl.Map,
    coordinates: [number, number],
    el: HTMLElement,
    label: string,
    bounds: mapboxgl.LngLatBounds,
    markerEls: {el: HTMLElement, index: number}[],
    index: number
) =>{
    new mapboxgl.Marker({element: el})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup().setText(label))
    .addTo(map)
    bounds.extend(coordinates)
    markerEls.push({el, index})
}

export const buildRouteCoordinates = (itinerary: Itinerary): [number, number][] =>[
    itinerary?.originCoordinates, 
    ...itinerary?.days.flatMap(day => day.stops.map(stop => stop.stopCoordinates)),
    itinerary?.destinationCoordinates
]

export const createMarker = (color: string, size: 'sm' | 'lg' = 'sm') => {
  const el = document.createElement('div')
  const dimension = size === 'lg' ? '16px' : '10px'
  el.style.cssText = `
    width: ${dimension};
    height: ${dimension};
    border-radius: 50%;
    background: ${color};
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    cursor: pointer;
  `
  return el
}
