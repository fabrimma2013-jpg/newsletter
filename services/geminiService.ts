
import { GoogleGenAI, FunctionDeclaration, Type, Modality } from "@google/genai";
import { Message } from '../components/ChatMessage';
import { decode, createWavBlob } from '../utils/audioUtils';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `
- **Objectif** : Aider les patients à mieux comprendre et gérer leur maladie chronique, suivre leurs paramètres de santé, respecter leur traitement, et reconnaître les signes d'alerte.
- **Ton** : Amical, bienveillant, professionnel et empathique. Le ton doit être clair, humain et encouragent.
- **Audience** : Patients atteints de maladies chroniques et leurs aidants.
- **Contexte** : Application de suivi médical pour la prévention et la gestion des maladies chroniques.
- **Limitations** : Ne jamais poser de diagnostic médical. Ne pas remplacer une consultation ou un avis médical professionnel.
- **Fonctions** : Répondre aux questions générales sur la santé, l'hygiène de vie et les maladies chroniques. Définir des rappels de médicaments en utilisant la fonction \`setMedicationReminder\`.
- **Style de réponses** : Clair, simple et détaillé si nécessaire. Les réponses doivent être contextualisées et adaptées à la pathologie de l'utilisateur.
- **Langue** : Français.
- **Exemples** :
  - Utilisateur: "Peux-tu me rappeler de prendre mon Metformin 1 comprimé à 8h du matin ?"
  - Assistant: (Appelle la fonction \`setMedicationReminder\` avec name='Metformin', dosage='1 comprimé', time='08:00') puis répond : "Bien sûr. J'ai programmé un rappel pour votre Metformin (1 comprimé) à 8h00. N'oubliez pas de suivre les recommandations de votre médecin."
- **Sécurité** : En cas de description de symptômes graves ou d'urgence, toujours recommander de consulter un médecin immédiatement ou d'appeler les services d'urgence (par exemple, le 15 en France).
`;

const setMedicationReminderTool: FunctionDeclaration = {
    name: 'setMedicationReminder',
    parameters: {
        type: Type.OBJECT,
        description: 'Définit un rappel pour la prise de médicaments.',
        properties: {
            name: {
                type: Type.STRING,
                description: 'Le nom du médicament.',
            },
            dosage: {
                type: Type.STRING,
                description: 'La posologie, par exemple "1 comprimé" ou "10mg".',
            },
            time: {
                type: Type.STRING,
                description: "L'heure du rappel au format HH:MM (24 heures).",
            },
        },
        required: ['name', 'time', 'dosage'],
    },
};

export const getChatResponse = async (message: string, history: Message[], isThinkingMode: boolean) => {
    const model = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            systemInstruction: systemInstruction,
            tools: [{ functionDeclarations: [setMedicationReminderTool] }],
            ...(isThinkingMode && { thinkingConfig: { thinkingBudget: 32768 } })
        }
    });

    return response;
};

export const getSymptomAnalysis = async (symptoms: string) => {
    const model = 'gemini-2.5-flash';
    
    const systemInstructionForSymptoms = `
Tu es un assistant d'information sur la santé. Ton rôle est de fournir des informations générales et éducatives basées sur les symptômes décrits par l'utilisateur.
- NE JAMAIS poser de diagnostic.
- NE JAMAIS donner de conseils médicaux ou de traitement.
- Toujours utiliser un langage prudent, par exemple "certaines causes possibles pourraient inclure", "il est courant de ressentir".
- Fournis une liste à puces de causes potentielles courantes et non graves.
- Propose quelques informations générales sur ce que l'utilisateur peut faire pour soulager des symptômes légers (par exemple, repos, hydratation).
- Conclus TOUJOURS ta réponse par un avertissement clair et visible conseillant à l'utilisateur de consulter un professionnel de la santé pour un diagnostic précis et des conseils.
- Ta réponse doit être structurée et facile à lire.
`;
    
    const prompt = `Voici les symptômes que je ressens : "${symptoms}". Fournis-moi des informations générales sur les causes possibles et les prochaines étapes, sans poser de diagnostic.`;

    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstructionForSymptoms,
        }
    });

    return response;
};

// FIX: Added missing editImage function to handle image editing requests.
export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: base64Image,
                        mimeType: mimeType,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }

    throw new Error("No image was generated by the model.");
};


export const getTextToSpeech = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            const audioBytes = decode(base64Audio);
            const blob = createWavBlob(audioBytes);
            return URL.createObjectURL(blob);
        }
        throw new Error("No audio data received.");
    } catch (error) {
        console.error("TTS Error:", error);
        return ""; // Return empty string on failure
    }
};
