import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import {TripFormData, Itinerary } from '@/types/trip'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: NextRequest){
    try{
        const body: TripFormData = await req.json()
        const {origin, destination, days, vibe} = body

        if(!origin || !destination || !days || !vibe){
            return NextResponse.json(
                {error: 'Missing required trip details'},
                {status: 400}
            )
        }

        let message
        try{

            message = await anthropic.messages.create({
                model: 'claude-sonnet-4-6',
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: buildPrompt(origin, destination, days, vibe)
                    }
                ]
            })
        } catch(claudeError){
            console.error('❌ Claude specific error:', claudeError)
            throw claudeError
        }

        const responseText = message.content.filter(block => block.type === 'text').map(block => block.text).join('')
        const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim()
        const itinerary: Itinerary = JSON.parse(cleanedResponse)
        
        return NextResponse.json(itinerary)
    } catch(error){
        console.error('❌ API route error:', error)
        return NextResponse.json(
            {error: 'Failed to generate itinerary'},
            {status: 500}
        )
    }
}

function buildPrompt(origin: string, destination: string, days: number, vibe: string): string {
      return `You are a road trip planning expert. Generate a detailed road trip itinerary.

        Trip details:
        - Origin: ${origin}
        - Destination: ${destination}
        - Duration: ${days} days
        - Travel vibe: ${vibe}

        Return ONLY a valid JSON object with NO additional text, explanation or markdown. 
        Use exactly this structure:

        {
        "origin": "${origin}",
        "destination": "${destination}",
        "totalDays": ${days},
        "totalMiles": <estimated total miles as number>,
        "vibe": "${vibe}",
        "days": [
            {
            "day": 1,
            "title": "<catchy title for the day>",
            "from": "<starting city>",
            "to": "<ending city>",
            "miles": <miles driven today as number>,
            "stops": [
                {
                "name": "<stop name>",
                "type": "<food|attraction|nature|music|rest|fuel|accommodation>",
                "description": "<1-2 sentence description>",
                "tip": "<one insider tip>",
                "duration": "<suggested time eg 1 hour>"
                }
            ],
            "overnight": "<where they sleep tonight>"
            }
        ]
        }

        Generate exactly ${days} day objects. Make stops specific, interesting and match the ${vibe} vibe.`
}