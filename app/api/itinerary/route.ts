import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import {TripFormData, Day, Itinerary, ItineraryMeta } from '@/types/trip'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
})

export async function POST(req: NextRequest) {
  try {
    const body: TripFormData = await req.json()
    const { origin, destination, days, vibe } = body

    if (!origin || !destination || !days || !vibe) {
      return NextResponse.json(
        { error: 'Missing required trip details' },
        { status: 400 }
      )
    }

    // Create a ReadableStream to send data to the client
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()

        try {
          // Use streaming API
          const response = await anthropic.messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 8096,
            messages: [
              {
                role: 'user',
                content: buildPrompt(origin, destination, days, vibe)
              }
            ]
          })

          let buffer = ''

          // Process each streamed chunk
          for await (const chunk of response) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              buffer += chunk.delta.text

              // Check if buffer contains complete JSON lines
              const lines = buffer.split('\n')

              // All lines except the last are complete
              // Last line may be incomplete — keep in buffer
              for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim()
                if (line.startsWith('{')) {
                  try {
                    // Validate it parses correctly
                    JSON.parse(line)
                    // Send to client
                    controller.enqueue(
                      encoder.encode(line + '\n')
                    )
                  } catch {
                    // Incomplete JSON — skip
                  }
                }
              }

              // Keep the incomplete last line in buffer
              buffer = lines[lines.length - 1]
            }
          }

          // Handle any remaining content in buffer
          const remaining = buffer.trim()
          if (remaining.startsWith('{')) {
            try {
              JSON.parse(remaining)
              controller.enqueue(
                encoder.encode(remaining + '\n')
              )
            } catch {
              console.error('❌ Final buffer parse failed:', remaining)
            }
          }

        } catch (error) {
          console.error('❌ Streaming error:', error)
          controller.error(error)
        } finally {
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      }
    })

  } catch (error) {
    console.error('❌ API route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate itinerary' },
      { status: 500 }
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

    CRITICAL FORMATTING RULES:
    - Return ONLY raw JSON lines, no markdown, no backticks, no explanation
    - Each line must be a complete, valid, self-contained JSON object
    - No commas between lines
    - No wrapping array or object
    - First character of each line must be {
    - Last character of each line must be }

    Return exactly ${days + 1} lines in this exact order:

    Line 1 — trip header:
    {"origin":"${origin}","destination":"${destination}","totalDays":${days},"totalMiles":<number>,"vibe":"${vibe}","originCoordinates":[<longitude>,<latitude>],"destinationCoordinates":[<longitude>,<latitude>]}

    Lines 2 to ${days + 1} — one per day:
    {"day":<number>,"title":"<catchy title>","from":"<city>","to":"<city>","miles":<number>,"overnight":"<city>","stops":[{"name":"<name>","type":"<food|attraction|nature|music|rest|fuel|accommodation>","description":"<1-2 sentences>","tip":"<insider tip>","duration":"<eg 1 hour>","stopCoordinates":[<longitude>,<latitude>]}]}

    Generate exactly ${days} day objects.
    Make stops specific, interesting and match the ${vibe} vibe.
    Include 4-6 stops per day.
    Coordinates must be accurate real-world longitude/latitude values.`
}