'use client'

import { useState } from "react"
import { useTripStore } from "@/store/useTripStore"
import { TripFormData } from "@/types/trip"
import styles from './TripForm.module.scss'

const VIBES = [
    {value: 'scenic', label: 'Scenic & Nature'},
    {value: 'foodie', label: 'Foodie Adventure'},
    {value: 'music', label: 'Music & Culture'},
    {value: 'history', label: 'History & Heritage'},
    {value: 'adventure', label: 'Off the Beaten Path'},
    {value: 'relaxed', label: 'Slow & Relaxed'},
]

export default function TripForm(){
    const {setFormData, setItinerary, 
        setLoading, 
        setError,  
        setStreamedMeta,
        addStreamedDay,
        setIsStreaming,
        finalizeItinerary, 
        isLoading
} = useTripStore()
    const [form, setForm] = useState<TripFormData>({
        origin: '',
        destination: '',
        days: 3,
        vibe: 'scenic'
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>){
        const {name, value} = e.target
        setForm(prev =>({...prev, [name]: name === 'days' ? Number(value) : value}))
    }

    async function handleSubmit(e: React.SubmitEvent){
        e.preventDefault()
        setError(null)
        setLoading(true)
        setFormData(form)

        try{
            const res = await fetch('/api/itinerary', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(form)
            })
            if(!res.ok) throw new Error('Failed to generate itinerary')
            if (!res.body) throw new Error('No stream body received')

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let buffer = ''
            let metaReceived = false

            setIsStreaming(true)
            setLoading(false)
            
            // Read stream chunk by chunk
            while (true) {
            const { done, value } = await reader.read()

            if (done) {
                // Handle any remaining content in buffer
                const remaining = buffer.trim()
                if (remaining.startsWith('{')) {
                try {
                    const day = JSON.parse(remaining)
                    addStreamedDay(day)
                } catch {
                    console.error('❌ Final buffer parse failed:', remaining)
                }
                }
                // Stream complete — assemble final itinerary
                finalizeItinerary()
                break
            }

            // Decode incoming chunk and add to buffer
            buffer += decoder.decode(value, { stream: true })

            // Process complete lines
            const lines = buffer.split('\n')

            // All lines except last are complete
            for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim()
                if (!line.startsWith('{')) continue

                try {
                const parsed = JSON.parse(line)

                if (!metaReceived) {
                    // First line is always meta
                    setStreamedMeta(parsed)
                    metaReceived = true
                } else {
                    // Subsequent lines are days
                    addStreamedDay(parsed)
                }
                } catch {
                console.error('❌ Line parse failed:', line)
                }
            }

            // Keep incomplete last line in buffer
            buffer = lines[lines.length - 1]
            }
        } catch(err){
            setError('Something went wtrong. Please try again.')
            setIsStreaming(false)
            setLoading(false)
            console.error(err)
        } 
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>Road Trip Planner</h1>
                <p className={styles.subtitle}>Tell us where you're headed and we'll plan the perfect route</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="origin">Starting From</label>
                        <input id="origin" name="origin" type="text" value={form.origin} onChange={handleChange} required placeholder="e.g. San Francisco, CA" />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="destination">Heading To</label>
                        <input id="destination" name="destination" type="text" value={form.destination} onChange={handleChange} required  placeholder="e.g. Seattle, WA"  />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="days">Number of Days</label>
                        <input id="days" name="days" type="number" min={1} max={14} value={form.days} onChange={handleChange} required />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="vibe">Trip Vibe</label>
                        <select id="vibe" name="vibe" value={form.vibe} onChange={handleChange} required >
                            {VIBES.map(v => (
                                <option key={v.value} value={v.value}>{v.label}</option>
                            ))}
                        </select>
                    </div>
                    <button className={styles.button} type="submit" disabled={isLoading}>{isLoading ? 'Planning your trip...' : 'Plan My Trip'}</button>
                </form>
            </div>
        </div>
    )
}