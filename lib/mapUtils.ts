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
): mapboxgl.Popup =>{
  const popup = new mapboxgl.Popup().setText(label)
    new mapboxgl.Marker({element: el})
    .setLngLat(coordinates)
    .setPopup(popup)
    .addTo(map)
    bounds.extend(coordinates)
    markerEls.push({el, index})
    return popup
}

const buildRouteCoordinates = (itinerary: Itinerary): [number, number][] =>[
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

export const generateRouteLayer = (map: mapboxgl.Map ,itinerary: Itinerary, color: string) =>{

    if (map.getLayer('route')) map.removeLayer('route')
    if (map.getSource('route')) map.removeSource('route')

    map.addSource('route', {
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

    map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': color,
            'line-width': 3,
        }
    })
}