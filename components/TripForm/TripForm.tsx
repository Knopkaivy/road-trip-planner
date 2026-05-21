'use client'

import { useState } from "react"
import { useTripStore } from "@/store/useTripStore"
import { TripFormData } from "@/types/trip"
import styles from './TripForm.module.scss'

const VIBES = [
    {value: 'scenic', label: '🏔️ Scenic & Nature'},
    {value: 'foodie', label: '🍖 Foodie Adventure'},
    {value: 'music', label: '🎵 Music & Culture'},
    {value: 'history', label: '🏛️ History & Heritage'},
    {value: 'adventure', label: '🧗 Off the Beaten Path'},
    {value: 'relaxed', label: '😎 Slow & Relaxed'},
]

export default function TripForm(){
    const {setFormData, setItinerary, setLoading, setError, isLoading} = useTripStore()
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
            
                const itinerary = await res.json()
                setItinerary(itinerary)
        } catch(err){
            setError('Something went wtrong. Please try again.')
            console.error(err)
        } finally{
            setLoading(false)
        }
    }

    return(
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.title}>🚗 Road Trip Planner</h1>
                <p className={styles.subtitle}>Tell us where you're headed and we'll plan the perfect route</p>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.field}>
                        <label htmlFor="origin">Starting From</label>
                        <input id="origin" name="origin" type="text" value={form.origin} onChange={handleChange} required />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="destination">Heading To</label>
                        <input id="destination" name="destination" type="text" value={form.destination} onChange={handleChange} required />
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
                    <button className={styles.button} type="submit" disabled={isLoading}>{isLoading ? 'Planning your trip...' : 'Plan My Trip 🗺️'}</button>
                </form>
            </div>
        </div>
    )
}