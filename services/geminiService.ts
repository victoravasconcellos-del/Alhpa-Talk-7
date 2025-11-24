import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../lib/supabase';
import { MessageAnalysis, CoachingRequest, DailyQuest } from '../types';

const getLocalAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return new GoogleGenAI({ apiKey: 'dummy' }); // Fallback to avoid crash
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = "Você é o AlphaBot, um coach de relacionamentos.";

export const analyzeScreenshot = async (base64Image: string): Promise<MessageAnalysis> => {
  try {
    const ai = getLocalAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [{ inlineData: { mimeType: 'image/png', data: base64Image } }, { text: "Analise este print." }]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidenceScore: { type: Type.NUMBER },
            subtext: { type: Type.STRING },
            feedback: { type: Type.STRING },
            suggestedReplies: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    if (response.text) return JSON.parse(response.text) as MessageAnalysis;
    throw new Error("EMPTY");
  } catch (error) {
    throw new Error("Erro na análise.");
  }
};

export const getCoachingAdvice = async (request: CoachingRequest): Promise<string> => {
  try {
    const ai = getLocalAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Ajuda: ${request.text} Objetivo: ${request.goal}`,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "Erro.";
  } catch (error) {
    return "Erro de conexão.";
  }
};

export const getDailyQuests = async (): Promise<DailyQuest[]> => {
  return [
      { id: '1', title: 'Use o Scanner IA', xpReward: 50, difficulty: 'EASY', completed: false },
      { id: '2', title: 'Acesse a Biblioteca', xpReward: 20, difficulty: 'EASY', completed: false },
      { id: '3', title: 'Use o Coach', xpReward: 50, difficulty: 'MEDIUM', completed: false }
  ];
}
