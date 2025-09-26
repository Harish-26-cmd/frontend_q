
import { GoogleGenAI } from '@google/genai';
import type { Queue } from '../types';

let ai: GoogleGenAI | null = null;
try {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error) {
    console.error("Failed to initialize GoogleGenAI. AI predictions will be disabled.", error);
}


/**
 * Simulates an AI model predicting the wait time for a queue.
 * @param queue The queue for which to predict the wait time.
 * @returns The predicted wait time in minutes.
 */
export const predictWaitTime = async (queue: Queue): Promise<number> => {
  const peopleWaiting = queue.people.length;
  const avgTime = queue.averageServiceTimeMinutes;
  
  // Simple prediction: linear multiplication, used as a fallback.
  const simplePrediction = Math.max(0, peopleWaiting * avgTime);

  if (!ai) {
    // AI service is not available, return the simple prediction after a small delay.
    await new Promise(res => setTimeout(res, 150));
    return simplePrediction;
  }
  
  try {
    const prompt = `
        You are a sophisticated AI model for a queue management system called Q-Free.
        Your task is to predict the estimated wait time in minutes for a specific queue for a NEW person joining.
        Analyze the following queue data and provide a single integer number representing the estimated wait time in minutes.
        Do not provide any explanation, just the number.

        Queue Data:
        - Queue Name: "${queue.name}"
        - People currently waiting: ${queue.people.length}
        - Average service time per person: ${queue.averageServiceTimeMinutes} minutes
        - Person currently being served: ${queue.currentlyServing ? 'Yes, one person is being served right now.' : 'No, the service point is free.'}

        Consider these factors in your prediction:
        - The base wait time is the number of people waiting multiplied by the average service time.
        - If someone is currently being served, a new person has to wait for them to finish first, in addition to everyone else in the line.
        - High traffic queues (like 'Emergency Room' or 'Customer Support') or long service time queues (like 'Passport Services') might have slightly longer effective wait times due to overhead or context switching.
        
        Based on this, what is the estimated wait time in minutes for a new person joining the queue?
        Respond with only an integer. For example: 25
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const predictedTimeText = response.text.trim();
    const predictedTime = parseInt(predictedTimeText, 10);

    if (!isNaN(predictedTime)) {
        return Math.max(0, predictedTime);
    }
    
    // Fallback if parsing fails
    console.warn(`AI prediction parsing failed. Response was: "${predictedTimeText}". Falling back to simple prediction.`);
    return simplePrediction;

  } catch (error) {
    console.error("AI prediction failed, using simple prediction.", error);
    return simplePrediction;
  }
};
