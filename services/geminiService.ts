import { GoogleGenAI } from "@google/genai";
import { MessageAnalysis, CoachingRequest, DailyQuest } from '../types';

const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || 'dummy' });

export const analyzeScreenshot = async (base64: string): Promise<MessageAnalysis> => {
  try {
    const ai = getClient();
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [{ inlineData: { mimeType: 'image/png', data: base64 } }, { text: "Analise." }] }
    });
    return JSON.parse(res.text || '{}') as MessageAnalysis;
  } catch (e) { throw new Error("Erro na IA"); }
};

export const getCoachingAdvice = async (req: CoachingRequest): Promise<string> => {
  try {
    const ai = getClient();
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Ajude: ${req.text} Objetivo: ${req.goal}`
    });
    return res.text || "Erro";
  } catch (e) { return "Erro de conexão"; }
};

export const getDailyQuests = async (): Promise<DailyQuest[]> => {
  return [
      { id: '1', title: 'Teste 1', xpReward: 10, difficulty: 'EASY', completed: false },
      { id: '2', title: 'Teste 2', xpReward: 20, difficulty: 'MEDIUM', completed: false },
      { id: '3', title: 'Teste 3', xpReward: 30, difficulty: 'HARD', completed: false }
  ];
};
