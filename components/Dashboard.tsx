import React, { useEffect, useState } from 'react';
import { UserStats, DailyQuest, AppView } from '../types';
import { Flame, Trophy, ChevronRight, MessageCircle, ScanLine, Book, CheckCircle2, Circle, Star, Crown } from 'lucide-react';
import { getDailyQuests } from '../services/geminiService';
import { getStoredQuests, saveStoredQuests } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  stats: UserStats;
  onCompleteTask: (xp: number) => void;
  onChangeView: (view: AppView) => void;
  showLevelUp: boolean;
  onCloseLevelUp: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onCompleteTask, onChangeView, showLevelUp, onCloseLevelUp }) => {
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuests = async () => {
      if (!user) return;
      const today = new Date().toDateString();

      // Try load from Supabase first
      const storedData = await getStoredQuests(user.id);
      
      if (storedData && storedData.date === today && storedData.quests.length > 0) {
         setQuests(storedData.quests);
         setLoading(false);
      } else {
         // Generate new ones if not exist or expired
         const newQuests = await getDailyQuests();
         setQuests(newQuests);
         setLoading(false);
         // Save to DB
         await saveStoredQuests(user.id, newQuests, today);
      }
    };
    fetchQuests();
  }, [user]);

  const handleQuestClick = async (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (quest && !quest.completed && user) {
        // Optimistic update
        const updatedQuests = quests.map(q => 
            q.id === questId ? { ...q, completed: true } : q
        );
        setQuests(updatedQuests);
        
        // Save state to Supabase
        const today = new Date().toDateString();
        await saveStoredQuests(user.id, updatedQuests, today);
        
        onCompleteTask(quest.xpReward);
    }
  };

  // Level Progress Math
  const progressPercent = Math.min((stats.xp / stats.maxXp) * 100, 100);
  
  return (
    <div className="space-y-8 pb-28 pt-4 animate-slide-up relative">
      
      {/* Level Up Modal Overlay */}
      {showLevelUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={onCloseLevelUp}>
              <div className="bg-zinc-900 border-2 border-alpha-gold p-8 rounded-2xl w-full max-w-sm text-center relative overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.5)] transform animate-in zoom-in-95 duration-300">
                  <div className="absolute inset-0 bg-gradient-to-t from-alpha-gold/20 to-transparent"></div>
                  <div className="relative z-10">
                      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-alpha-gold to-yellow-600 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce">
                          <Crown size={48} className="text-white" fill="white" />
                      </div>
                      <h2 className="text-3xl font-black text-white italic uppercase tracking-wider mb-2">Level Up!</h2>
                      <p className="text-alpha-gold font-bold text-xl mb-6">Nível {stats.level} Alcançado</p>
                      <p className="text-zinc-400 text-sm mb-8">Sua autoridade e status aumentaram. Continue evoluindo.</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onCloseLevelUp(); }}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                      >
                          Continuar
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Header Stats */}
      <header className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black text-white tracking-tight leading-none uppercase italic">
                  ALPHA <span className="text-alpha-gold">TALK</span>
                </h1>
                <p className="text-xs text-zinc-500 font-bold tracking-[0.2em] uppercase">Domine a Arte da Conquista</p>
            </div>
            
            <div className="flex gap-3">
                 <div className="flex flex-col items-center justify-center bg-orange-950/20 px-3 py-2 rounded-xl border border-orange-500/20">
                    <Flame size={18} className="text-orange-500 mb-1" fill="currentColor" />
                    <span className="font-black text-xs text-orange-500">{stats.streak} Dias</span>
                 </div>
            </div>
        </div>

        {/* Improved Progress Bar */}
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 relative overflow-hidden">
             <div className="flex justify-between items-end mb-2 relative z-10">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white leading-none">{stats.level}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Nível Atual</span>
                </div>
                <div className="text-xs font-bold text-alpha-gold">
                    {stats.xp} / {stats.maxXp} XP
                </div>
             </div>
             <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-zinc-800 relative z-10">
                <div 
                    className="h-full bg-gradient-to-r from-alpha-gold to-yellow-600 transition-all duration-1000 ease-out shadow-[0_0_10px_#F59E0B]"
                    style={{ width: `${progressPercent}%` }}
                ></div>
             </div>
             {/* Background Decoration */}
             <div className="absolute right-0 top-0 opacity-5 -translate-y-1/2 translate-x-1/4">
                <Trophy size={100} />
             </div>
        </div>
      </header>

      {/* Tactical Board (Daily Quests) */}
      <section>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                <Star size={12} className="text-alpha-gold" fill="#F59E0B" />
                Missões Táticas
            </h3>
            <span className="text-[10px] text-zinc-600 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">Reseta em 24h</span>
        </div>

        <div className="space-y-3">
            {loading ? (
                [1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse border border-zinc-800"></div>
                ))
            ) : (
                quests.map((quest) => (
                    <button 
                        key={quest.id}
                        disabled={quest.completed}
                        onClick={() => handleQuestClick(quest.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                            quest.completed 
                            ? 'bg-zinc-900/50 border-zinc-800 opacity-60' 
                            : 'bg-gradient-to-r from-zinc-900 to-black border-zinc-700 hover:border-alpha-gold/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.1)] active:scale-[0.98]'
                        }`}
                    >
                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                            quest.completed ? 'bg-zinc-700' : 'bg-alpha-gold'
                        }`}></div>

                        <div className="flex items-center justify-between pl-3">
                            <div className="flex items-center gap-3">
                                {quest.completed ? (
                                    <CheckCircle2 size={24} className="text-zinc-600" />
                                ) : (
                                    <Circle size={24} className="text-zinc-600 group-hover:text-alpha-gold transition-colors" />
                                )}
                                <div>
                                    <h4 className={`font-bold text-sm ${quest.completed ? 'text-zinc-500 line-through' : 'text-white'}`}>
                                        {quest.title}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                            quest.difficulty === 'HARD' ? 'bg-red-900/30 text-red-500 border border-red-500/20' :
                                            quest.difficulty === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-500 border border-yellow-500/20' :
                                            'bg-green-900/30 text-green-500 border border-green-500/20'
                                        }`}>
                                            {quest.difficulty === 'EASY' ? 'FÁCIL' : quest.difficulty === 'MEDIUM' ? 'MÉDIO' : 'DIFÍCIL'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className={`flex items-center gap-1 font-black ${quest.completed ? 'text-zinc-600' : 'text-alpha-gold'}`}>
                                <span>+{quest.xpReward}</span>
                                <span className="text-[10px]">XP</span>
                            </div>
                        </div>
                    </button>
                ))
            )}
        </div>
      </section>

      {/* Quick Access Grid */}
      <section>
        
        {/* Upgrade Banner for Free Users */}
        {!stats.isPremium && (
          <button 
            onClick={() => onChangeView(AppView.PREMIUM)}
            className="w-full relative overflow-hidden bg-gradient-to-r from-alpha-gold via-yellow-500 to-amber-600 p-1 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.5)] mb-8 group transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-200%] animate-[shimmer_3s_infinite]"></div>

            <div className="relative bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-xl p-4 flex items-center justify-between border border-white/20">
               <div className="flex items-center gap-4">
                 <div className="bg-black p-3 rounded-xl text-alpha-gold shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-alpha-gold/20 blur-lg rounded-full animate-pulse"></div>
                    <Crown size={28} fill="currentColor" className="relative z-10 animate-[bounce_2s_infinite]" />
                 </div>
                 <div className="text-left">
                   <h3 className="text-black font-black text-lg uppercase tracking-tight leading-none">Seja Alpha Pro</h3>
                   <p className="text-black font-bold text-xs mt-1 bg-black/10 px-2 py-0.5 rounded-md inline-block">
                      Desbloqueie o Poder Total
                   </p>
                 </div>
               </div>
               
               <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm group-hover:bg-white/40 transition-colors shadow-lg">
                  <ChevronRight className="text-black group-hover:translate-x-1 transition-transform" strokeWidth={3} />
               </div>
            </div>
          </button>
        )}

        <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-4 ml-1">Arsenal</h3>
        <div className="grid grid-cols-2 gap-3">
            {/* Analyzer */}
            <div 
                onClick={() => onChangeView(AppView.ANALYZER)}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-28 group cursor-pointer hover:border-alpha-gold/40 transition-all active:scale-95 hover:bg-zinc-800"
            >
                <div className="bg-black w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800 text-alpha-gold">
                    <ScanLine size={16} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">Scanner IA</h4>
                    <p className="text-[10px] text-zinc-500">Decodificar prints</p>
                </div>
            </div>

            {/* Coach */}
            <div 
                onClick={() => onChangeView(AppView.COACH)}
                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col justify-between h-28 group cursor-pointer hover:border-blue-500/40 transition-all active:scale-95 hover:bg-zinc-800"
            >
                <div className="bg-black w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800 text-blue-500">
                    <MessageCircle size={16} />
                </div>
                <div>
                    <h4 className="font-bold text-white text-sm">Coach</h4>
                    <p className="text-[10px] text-zinc-500">Gerador de resposta</p>
                </div>
            </div>

            {/* Library */}
            <div 
                onClick={() => onChangeView(AppView.LIBRARY)}
                className="col-span-2 bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between group cursor-pointer hover:border-green-500/40 transition-all active:scale-[0.98]"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-black w-10 h-10 rounded-lg flex items-center justify-center border border-zinc-800 text-green-500">
                        <Book size={20} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">Frases Prontas</h4>
                        <p className="text-[10px] text-zinc-500">Roteiros de alta conversão</p>
                    </div>
                </div>
                <ChevronRight size={16} className="text-zinc-600" />
            </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
