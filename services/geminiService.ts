import { GoogleGenAI } from "@google/genai";

// Assume API_KEY is set in the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export async function generateEquipmentInfo(equipmentName: string): Promise<string> {
  const prompt = `Provide a comprehensive guide for the gym equipment: "${equipmentName}". 
Include the following sections:
1.  **Primary Muscles Targeted:** List the main muscles worked.
2.  **Proper Technique:** Give a step-by-step guide on how to use the equipment correctly and safely.
3.  **Common Mistakes to Avoid:** List common errors people make and how to correct them.
4.  **Tips for Beginners:** Provide one or two helpful tips for someone new to this machine.

Format the response in clear, concise language suitable for gym-goers. Use markdown for formatting (bolding, lists).`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating equipment info:", error);
    return "Failed to generate information. Please try again.";
  }
}

export async function generateEquipmentImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '4:3',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image was generated.");
    } catch (error) {
        console.error("Error generating equipment image:", error);
        throw new Error("Failed to generate image. Please try again.");
    }
}
