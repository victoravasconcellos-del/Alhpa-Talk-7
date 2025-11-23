export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  COACH = 'COACH',
  LIBRARY = 'LIBRARY',
  PROFILE = 'PROFILE',
  PREMIUM = 'PREMIUM',
  SETTINGS = 'SETTINGS'
}

export interface UserStats {
  level: number;
  xp: number;
  maxXp: number;
  streak: number;
  tokens: number;
  isPremium: boolean;
  name: string;
  avatarUrl?: string;
  dailyScans: number;
  dailyCoachUses: number;
  usageDate: string;
}

export interface MessageAnalysis {
  confidenceScore: number;
  subtext: string;
  suggestedReplies: string[];
  feedback: string;
}

export interface AnalysisHistoryItem {
  id: string;
  timestamp: number;
  imageBase64: string;
  result: MessageAnalysis;
}

export interface CoachingRequest {
  text: string;
  goal: 'flirty' | 'direct' | 'funny' | 'mysterious' | 'intellectual';
  context?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  xpReward: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  completed: boolean;
}
