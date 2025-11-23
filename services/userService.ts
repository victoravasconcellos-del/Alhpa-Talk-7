import { supabase } from '../lib/supabase';
import { UserStats, DailyQuest } from '../types';

export const INITIAL_STATS: UserStats = {
  level: 1,
  xp: 0,
  maxXp: 100,
  streak: 1,
  tokens: 5,
  isPremium: false,
  name: "Agente",
  dailyScans: 0,
  dailyCoachUses: 0,
  usageDate: new Date().toISOString().split('T')[0]
};

export const getUserProfile = async (userId: string): Promise<UserStats | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;

  const today = new Date().toISOString().split('T')[0];
  let currentStats: UserStats = {
    level: data.level,
    xp: data.xp,
    maxXp: data.max_xp,
    streak: data.streak,
    tokens: data.tokens,
    isPremium: data.is_premium,
    name: data.name,
    avatarUrl: data.avatar_url,
    dailyScans: data.daily_scans || 0,
    dailyCoachUses: data.daily_coach_uses || 0,
    usageDate: data.usage_date || today
  };

  if (currentStats.usageDate !== today) {
    currentStats.dailyScans = 0;
    currentStats.dailyCoachUses = 0;
    currentStats.usageDate = today;
    await updateUserStats(userId, { dailyScans: 0, dailyCoachUses: 0, usageDate: today });
  }

  return currentStats;
};

export const createUserProfile = async (userId: string, email: string, name: string) => {
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('profiles').insert([{ 
    id: userId, email, name, level: 1, xp: 0, max_xp: 100, streak: 1, quests: [], 
    last_active: new Date().toISOString(), daily_scans: 0, daily_coach_uses: 0, usage_date: today
  }]);
};

export const updateUserStats = async (userId: string, stats: Partial<UserStats>) => {
  const dbUpdates: any = {};
  if (stats.level !== undefined) dbUpdates.level = stats.level;
  if (stats.xp !== undefined) dbUpdates.xp = stats.xp;
  if (stats.maxXp !== undefined) dbUpdates.max_xp = stats.maxXp;
  if (stats.streak !== undefined) dbUpdates.streak = stats.streak;
  if (stats.name !== undefined) dbUpdates.name = stats.name;
  if (stats.avatarUrl !== undefined) dbUpdates.avatar_url = stats.avatarUrl;
  if (stats.dailyScans !== undefined) dbUpdates.daily_scans = stats.dailyScans;
  if (stats.dailyCoachUses !== undefined) dbUpdates.daily_coach_uses = stats.dailyCoachUses;
  if (stats.usageDate !== undefined) dbUpdates.usage_date = stats.usageDate;

  await supabase.from('profiles').update(dbUpdates).eq('id', userId);
};

export const incrementUsage = async (userId: string, type: 'scan' | 'coach', currentCount: number) => {
    const update = type === 'scan' ? { daily_scans: currentCount + 1 } : { daily_coach_uses: currentCount + 1 };
    await supabase.from('profiles').update(update).eq('id', userId);
};

export const getStoredQuests = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('quests, quests_date').eq('id', userId).single();
    if (!data) return null;
    return { quests: data.quests as DailyQuest[], date: data.quests_date };
}

export const saveStoredQuests = async (userId: string, quests: DailyQuest[], date: string) => {
    await supabase.from('profiles').update({ quests, quests_date: date }).eq('id', userId);
}
