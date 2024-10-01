import { generateFractal } from '$lib/lib.js';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const result = await generateFractal(request);

        // Convert the Uint8ClampedArray to a regular array for JSON serialization
        const arrayBuffer = await result.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const regularArray = Array.from(uint8Array);

        return json(regularArray);
    } catch (error) {
        console.error('Error generating fractal:', error);
        return json({ error: 'Failed to generate fractal' }, { status: 500 });
    }
}