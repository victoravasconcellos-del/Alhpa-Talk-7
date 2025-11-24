
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

  if (error) {
    // Check if table is missing
    if (error.code === 'PGRST205') {
        throw new Error("TABLE_MISSING");
    }
    // If error is code PGRST116, it means no rows returned (profile doesn't exist yet)
    if (error.code !== 'PGRST116') {
        console.error('Error fetching profile:', JSON.stringify(error, null, 2));
    }
    return null;
  }

  // Check if we need to reset daily limits (new day)
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
    // Reset limits for new day
    currentStats.dailyScans = 0;
    currentStats.dailyCoachUses = 0;
    currentStats.usageDate = today;
    
    // Fire and forget update
    await updateUserStats(userId, {
        dailyScans: 0,
        dailyCoachUses: 0,
        usageDate: today
    });
  }

  return currentStats;
};

export const createUserProfile = async (userId: string, email: string, name: string) => {
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('profiles')
    .insert([
      { 
        id: userId, 
        email, 
        name,
        level: 1,
        xp: 0,
        max_xp: 100,
        streak: 1,
        quests: [],
        last_active: new Date().toISOString(),
        daily_scans: 0,
        daily_coach_uses: 0,
        usage_date: today
      }
    ]);

  if (error) {
      if (error.code === 'PGRST205') throw new Error("TABLE_MISSING");
      console.error('Error creating profile:', JSON.stringify(error, null, 2));
      throw error;
  }
};

export const updateUserStats = async (userId: string, stats: Partial<UserStats>) => {
  // Map frontend types to DB columns
  const dbUpdates: any = {};
  if (stats.level !== undefined) dbUpdates.level = stats.level;
  if (stats.xp !== undefined) dbUpdates.xp = stats.xp;
  if (stats.maxXp !== undefined) dbUpdates.max_xp = stats.maxXp;
  if (stats.streak !== undefined) dbUpdates.streak = stats.streak;
  if (stats.tokens !== undefined) dbUpdates.tokens = stats.tokens;
  if (stats.name !== undefined) dbUpdates.name = stats.name;
  if (stats.avatarUrl !== undefined) dbUpdates.avatar_url = stats.avatarUrl;
  
  // Usage stats
  if (stats.dailyScans !== undefined) dbUpdates.daily_scans = stats.dailyScans;
  if (stats.dailyCoachUses !== undefined) dbUpdates.daily_coach_uses = stats.dailyCoachUses;
  if (stats.usageDate !== undefined) dbUpdates.usage_date = stats.usageDate;

  const { error } = await supabase
    .from('profiles')
    .update(dbUpdates)
    .eq('id', userId);

  if (error) console.error('Error updating stats:', JSON.stringify(error, null, 2));
};

export const upgradeToPremium = async (userId: string) => {
  const { error } = await supabase
    .from('profiles')
    .update({ is_premium: true })
    .eq('id', userId);

  if (error) {
    console.error('Error upgrading to premium:', error);
    throw error;
  }
};

export const redeemPremiumCode = async (userId: string, inputCode: string): Promise<{ success: boolean; message: string }> => {
  const code = inputCode.trim().toUpperCase();

  // 1. Fallback Universal (Segurança para lançamento rápido)
  // CÓDIGO ALTERADO PARA C7yp81 (case insensitive aqui pois convertemos para upper acima)
  if (code === 'C7YP81') {
      try {
        await upgradeToPremium(userId);
        return { success: true, message: 'Acesso ALPHA PRO liberado!' };
      } catch (e) {
        return { success: false, message: 'Erro ao ativar conta.' };
      }
  }

  // 2. Validação no Banco de Dados (Códigos Únicos)
  try {
      // Busca o código
      const { data, error } = await supabase
        .from('redemption_codes')
        .select('*')
        .eq('code', code)
        .single();

      // Se não achar ou der erro
      if (error || !data) {
          return { success: false, message: 'Código inválido ou inexistente.' };
      }

      // Se já foi usado
      if (data.is_used) {
          return { success: false, message: 'Este código já foi utilizado.' };
      }

      // Marca como usado (Transação atômica idealmente, mas aqui sequencial funciona para MVP)
      const { error: updateError } = await supabase
        .from('redemption_codes')
        .update({ is_used: true, used_by: userId })
        .eq('id', data.id);

      if (updateError) {
          console.error(updateError);
          return { success: false, message: 'Erro ao processar o código.' };
      }

      // Libera o acesso
      await upgradeToPremium(userId);
      
      return { success: true, message: 'Código resgatado com sucesso!' };

  } catch (err) {
      console.error(err);
      // Se a tabela não existir, cai aqui
      return { success: false, message: 'Erro de conexão ou código inválido.' };
  }
};

export const incrementUsage = async (userId: string, type: 'scan' | 'coach', currentCount: number) => {
    const update = type === 'scan' 
        ? { daily_scans: currentCount + 1 } 
        : { daily_coach_uses: currentCount + 1 };
        
    await supabase.from('profiles').update(update).eq('id', userId);
};

export const getStoredQuests = async (userId: string): Promise<{ quests: DailyQuest[], date: string } | null> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('quests, quests_date')
        .eq('id', userId)
        .single();
    
    if (error || !data) return null;
    
    return {
        quests: data.quests as DailyQuest[],
        date: data.quests_date
    };
}

export const saveStoredQuests = async (userId: string, quests: DailyQuest[], date: string) => {
    const { error } = await supabase
        .from('profiles')
        .update({
            quests: quests,
            quests_date: date
        })
        .eq('id', userId);
        
    if (error) console.error('Error saving quests:', JSON.stringify(error, null, 2));
}
