import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from '../lib/supabase';
import { MessageAnalysis, CoachingRequest, DailyQuest } from '../types';

// Helper to get initialized client safely (Client-side Fallback)
const getLocalAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY not configured");
  }
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
Você é o AlphaBot, um coach de relacionamentos, carisma e comunicação social de elite para homens.
Sua personalidade é confiante, direta, levemente "alpha", mas respeitosa e inteligente.
Você usa psicologia comportamental para ajudar homens a melhorarem suas habilidades sociais.
Seja conciso e prático. Evite clichês.
`;

export const analyzeScreenshot = async (base64Image: string): Promise<MessageAnalysis> => {
  try {
    const ai = getLocalAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', 
              data: base64Image
            }
          },
          {
            text: "Analise este print de conversa. Identifique o subtexto, o nível de interesse da outra pessoa e o que eu devo responder para aumentar a atração ou manter a conversa fluindo."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidenceScore: { type: Type.NUMBER, description: "Score from 0 to 100 on how well the conversation is going." },
            subtext: { type: Type.STRING, description: "What is actually being said between the lines." },
            feedback: { type: Type.STRING, description: "Critical analysis of the situation." },
            suggestedReplies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 distinct options for reply."
            }
          }
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (candidate?.finishReason === 'SAFETY') throw new Error("SAFETY_BLOCK");
    
    if (response.text) {
      return JSON.parse(response.text) as MessageAnalysis;
    }
    
    throw new Error("EMPTY_RESPONSE");
  } catch (error: any) {
    console.error("Error analyzing screenshot:", error);
    
    if (error.message === "SAFETY_BLOCK") {
        throw new Error("Conteúdo bloqueado pelos filtros de segurança.");
    }
    if (error.message === "API_KEY not configured") {
        throw new Error("Chave de API não configurada.");
    }
    
    throw new Error("Não foi possível analisar a imagem. Tente novamente.");
  }
};

export const getCoachingAdvice = async (request: CoachingRequest): Promise<string> => {
  try {
    const ai = getLocalAiClient();
    const prompt = `
      O usuário quer enviar a seguinte mensagem: "${request.text}".
      Objetivo da mensagem: ${request.goal}.
      Contexto (opcional): ${request.context || "Nenhum contexto fornecido."}
      
      Por favor:
      1. Melhore a mensagem para atingir o objetivo.
      2. Explique brevemente por que a nova versão é melhor.
      3. Dê mais 2 alternativas.
      
      Retorne a resposta em formato Markdown bem formatado.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });

    if (response.candidates?.[0]?.finishReason === 'SAFETY') {
        return "⚠️ **Alerta de Segurança:** Conteúdo sinalizado como impróprio.";
    }

    return response.text || "Erro ao gerar conselho.";
  } catch (error: any) {
    console.error("Error getting coaching advice:", error);
    return "Erro de conexão: Não foi possível contatar o coach.";
  }
};

export const getDailyQuests = async (): Promise<DailyQuest[]> => {
  const today = new Date().toDateString();
  const cached = localStorage.getItem('alpha_daily_quests');
  const cachedDate = localStorage.getItem('alpha_daily_quests_date');

  if (cached && cachedDate === today) {
    return JSON.parse(cached);
  }

  const dayOfMonth = new Date().getDate();
  
  const easyQuests = [
      { title: 'Acesse a Biblioteca de Frases', xp: 20 },
      { title: 'Visite seu Perfil', xp: 20 },
      { title: 'Copie uma frase da Biblioteca', xp: 20 },
      { title: 'Abra o Scanner IA', xp: 20 }
  ];

  const mediumQuests = [
      { title: 'Faça uma análise no Scanner IA', xp: 50 },
      { title: 'Use o Coach para criar uma mensagem', xp: 50 },
      { title: 'Pesquise uma categoria na Biblioteca', xp: 50 }
  ];

  const hardQuests = [
      { title: 'Use o modo "Sedutor" no Coach', xp: 100 },
      { title: 'Complete 3 dias de Streak (Entre amanhã)', xp: 100 }, 
      { title: 'Tire um print e analise a confiança', xp: 100 },
      { title: 'Use o modo "Direto" no Coach', xp: 100 }
  ];

  const selectedEasy = easyQuests[dayOfMonth % easyQuests.length];
  const selectedMedium = mediumQuests[dayOfMonth % mediumQuests.length];
  const selectedHard = hardQuests[dayOfMonth % hardQuests.length];

  const newQuests: DailyQuest[] = [
      {
          id: `q-${Date.now()}-1`,
          title: selectedEasy.title,
          difficulty: 'EASY',
          xpReward: selectedEasy.xp,
          completed: false
      },
      {
          id: `q-${Date.now()}-2`,
          title: selectedMedium.title,
          difficulty: 'MEDIUM',
          xpReward: selectedMedium.xp,
          completed: false
      },
      {
          id: `q-${Date.now()}-3`,
          title: selectedHard.title,
          difficulty: 'HARD',
          xpReward: selectedHard.xp,
          completed: false
      }
  ];

  localStorage.setItem('alpha_daily_quests', JSON.stringify(newQuests));
  localStorage.setItem('alpha_daily_quests_date', today);

  return newQuests;
}
