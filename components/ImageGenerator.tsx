import React, { useState, useEffect } from 'react';
import { generateEquipmentImage } from '../services/geminiService';

interface ImageGeneratorProps {
    equipmentName: string;
    characterDescription: string;
    onImageGenerated: (imageUrl: string) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ equipmentName, characterDescription, onImageGenerated }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        let newPrompt: string;
        if (characterDescription) {
            newPrompt = `A high-quality, photorealistic image of ${characterDescription} using a ${equipmentName} in a modern gym. The scene should be dominated by the color theme #ef4442 (a vibrant red). Centered, dynamic shot.`;
        } else {
            newPrompt = `A high-quality, photorealistic image of a ${equipmentName} in a modern, well-lit gym. The scene should prominently feature the color #ef4442 (a vibrant red). Centered shot, no people.`;
        }
        setPrompt(newPrompt);
    }, [equipmentName, characterDescription]);


    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        try {
            const imageUrl = await generateEquipmentImage(prompt);
            onImageGenerated(imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const inputClasses = "bg-gray-800/50 p-3 rounded-md w-full border border-white/10 focus:border-red-500 focus:ring-red-500 transition-colors";
    const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

    return (
        <div>
            <label htmlFor="image-prompt" className={labelClasses}>Image Generation Prompt</label>
            <textarea
                id="image-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={inputClasses}
                rows={4}
            />
            <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="mt-3 w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors disabled:bg-gray-600"
            >
                {isLoading ? (
                    <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        <span>Generating...</span>
                    </>
                ) : (
                    'Generate New Image'
                )}
            </button>
            {error && <p className="text-red-400 mt-2 text-center text-sm">{error}</p>}
        </div>
    );
};

export default ImageGenerator;