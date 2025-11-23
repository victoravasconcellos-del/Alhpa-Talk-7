import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ChatAnalyzer from './components/ChatAnalyzer';
import MessageCoach from './components/MessageCoach';
import Library from './components/Library';
import Premium from './components/Premium';
import Auth from './components/Auth';
import ProfileSettings from './components/ProfileSettings';
import Onboarding from './components/Onboarding';
import { AppView, UserStats } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getUserProfile, updateUserStats, INITIAL_STATS, createUserProfile, incrementUsage } from './services/userService';
import { isSupabaseConfigured } from './lib/supabase';
import { Settings, Database, Copy, Crown } from 'lucide-react';

const SetupRequired: React.FC = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
    <div className="bg-zinc-900 border border-alpha-gold/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_30px_rgba(245,158,11,0.1)]">
        <div className="bg-alpha-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="text-alpha-gold" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Configuração Necessária</h1>
        <p className="text-zinc-400 mb-6 text-sm leading-relaxed">
            Para o AlphaTalk funcionar corretamente, precisamos conectar ao banco de dados.
        </p>
        <p className="text-xs text-zinc-600">
            Verifique as credenciais do Supabase no arquivo de configuração.
        </p>
    </div>
  </div>
);

const DatabaseSetup: React.FC = () => {
    const sqlCode = `create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  name text default 'Agente',
  avatar_url text default null,
  level int default 1,
  xp int default 0,
  max_xp int default 100,
  streak int default 0,
  tokens int default 5,
  is_premium boolean default false,
  quests jsonb default '[]'::jsonb,
  quests_date text,
  last_active date default current_date,
  daily_scans int default 0,
  daily_coach_uses int default 0,
  usage_date text default to_char(current_date, 'YYYY-MM-DD'),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- PROTEÇÃO DE SEGURANÇA (Anti-Hack)
-- Esta função impede que usuários alterem seu próprio status "Premium" via console.
CREATE OR REPLACE FUNCTION public.protect_premium_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário tentar mudar is_premium de false para true
  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
     -- Bloqueia a alteração se for feita pelo usuário comum (autenticado via API client)
     IF auth.uid() = OLD.id THEN
        RAISE EXCEPTION 'Você não tem permissão para alterar o status Premium manualmente.';
     END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE public.protect_premium_status();`;

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
             <div className="bg-zinc-900 border border-red-500/30 p-6 rounded-2xl max-w-lg w-full">
                <div className="flex items-center gap-3 mb-4 text-red-500">
                    <Database size={24} />
                    <h1 className="text-xl font-bold">Banco de Dados Não Encontrado</h1>
                </div>
                <p className="text-zinc-400 text-sm mb-4">
                    A tabela <code>profiles</code> não existe no seu Supabase. 
                    Vá até o <strong>SQL Editor</strong> do seu painel Supabase e rode o seguinte código:
                </p>
                <div className="bg-black border border-zinc-800 rounded-lg p-3 relative group">
                    <pre className="text-[10px] text-zinc-500 overflow-x-auto whitespace-pre-wrap font-mono h-40 custom-scrollbar">
                        {sqlCode}
                    </pre>
                    <button 
                        onClick={() => navigator.clipboard.writeText(sqlCode)}
                        className="absolute top-2 right-2 bg-zinc-800 p-2 rounded-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-700"
                        title="Copiar SQL"
                    >
                        <Copy size={14} />
                    </button>
                </div>
                <p className="text-xs text-zinc-600 mt-4 text-center">
                    Após rodar o comando, recarregue esta página.
                </p>
             </div>
        </div>
    );
};

const AuthenticatedApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [dbError, setDbError] = useState(false);
  
  const { user, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setLoadingData(true);
        try {
            const hasSeenIntro = localStorage.getItem(`alpha_intro_${user.id}`);
            if (!hasSeenIntro) {
                setShowOnboarding(true);
            }

            const profile = await getUserProfile(user.id);
            if (profile) {
                setStats(profile);
            } else {
                const name = user.user_metadata?.name || 'Agente';
                await createUserProfile(user.id, user.email!, name);
                setStats({ ...INITIAL_STATS, name });
                if (!hasSeenIntro) setShowOnboarding(true); 
            }
        } catch (err: any) {
            console.error("Failed to load user data", err);
            if (err.message === "TABLE_MISSING" || err.code === 'PGRST205') {
                setDbError(true);
            }
        } finally {
            setLoadingData(false);
        }
      }
    };
    loadUserData();
  }, [user]);

  const handleFinishOnboarding = () => {
      if (user) {
        localStorage.setItem(`alpha_intro_${user.id}`, 'true');
        setShowOnboarding(false);
      }
  };

  const saveStatsToDb = async (newStats: UserStats) => {
    if (user && !dbError) {
        await updateUserStats(user.id, newStats);
    }
  };

  const addXp = (amount: number) => {
    setStats(prev => {
        let newXp = prev.xp + amount;
        let newLevel = prev.level;
        let newMaxXp = prev.maxXp;
        let leveledUp = false;

        if (newXp >= prev.maxXp) {
            newXp = newXp - prev.maxXp;
            newLevel++;
            newMaxXp = Math.floor(prev.maxXp * 1.5);
            leveledUp = true;
        }

        if (leveledUp) {
            setShowLevelUp(true);
        }

        const newStats = { 
            ...prev, 
            xp: newXp, 
            level: newLevel,
            maxXp: newMaxXp
        };
        
        saveStatsToDb(newStats);
        return newStats;
    });
  };

  const handleUpdateProfile = async (name: string, avatarUrl: string) => {
      const newStats = { ...stats, name, avatarUrl };
      setStats(newStats);
      await saveStatsToDb(newStats);
  };

  const handleTaskComplete = (xp: number) => {
    addXp(xp);
  };

  const handleScanUsed = () => {
      if (user) {
          incrementUsage(user.id, 'scan', stats.dailyScans);
          setStats(prev => ({ ...prev, dailyScans: prev.dailyScans + 1 }));
          addXp(15);
      }
  };

  const handleCoachUsed = () => {
      if (user) {
          incrementUsage(user.id, 'coach', stats.dailyCoachUses);
          setStats(prev => ({ ...prev, dailyCoachUses: prev.dailyCoachUses + 1 }));
          addXp(10);
      }
  };

  if (dbError) {
      return <DatabaseSetup />;
  }

  if (authLoading || (user && loadingData)) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="w-10 h-10 border-2 border-alpha-gold border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  if (!user) {
      return <Auth />;
  }

  if (showOnboarding) {
      return <Onboarding onFinish={handleFinishOnboarding} />;
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return (
            <Dashboard 
                stats={stats} 
                onCompleteTask={handleTaskComplete} 
                onChangeView={setCurrentView}
                showLevelUp={showLevelUp}
                onCloseLevelUp={() => setShowLevelUp(false)}
            />
        );
      case AppView.ANALYZER:
        return (
            <ChatAnalyzer 
                onAnalysisComplete={handleScanUsed} 
                usageCount={stats.dailyScans}
                isPremium={stats.isPremium}
                onUpgrade={() => setCurrentView(AppView.PREMIUM)}
            />
        );
      case AppView.COACH:
        return (
            <MessageCoach 
                onUsage={handleCoachUsed} 
                usageCount={stats.dailyCoachUses}
                isPremium={stats.isPremium}
                onUpgrade={() => setCurrentView(AppView.PREMIUM)}
            />
        );
      case AppView.LIBRARY:
        return <Library isPremium={stats.isPremium} onUpgrade={() => setCurrentView(AppView.PREMIUM)} />;
      case AppView.PREMIUM:
        return <Premium />;
      case AppView.SETTINGS:
        return (
            <ProfileSettings 
                stats={stats} 
                onSave={handleUpdateProfile} 
                onBack={() => setCurrentView(AppView.PROFILE)} 
            />
        );
      case AppView.PROFILE:
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-zinc-500 animate-slide-up relative">
                <button 
                    onClick={() => setCurrentView(AppView.SETTINGS)}
                    className="absolute top-0 right-4 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-alpha-gold hover:border-alpha-gold transition-all"
                >
                    <Settings size={20} />
                </button>

                <div className="w-32 h-32 rounded-full border-4 border-zinc-800 p-1 mb-6 relative shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
                        {stats.avatarUrl ? (
                            <img src={stats.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-4xl font-black text-zinc-600">
                                {stats.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 bg-alpha-gold text-black font-bold text-xs px-2 py-1 rounded-full border border-black shadow-lg">
                        LVL {stats.level}
                    </div>
                </div>
                <h2 className="text-white text-3xl font-black mb-1">{stats.name}</h2>
                <div className="flex gap-2 mb-8">
                     <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 bg-zinc-900 px-2 py-1 rounded">
                        {stats.isPremium ? 'Membro Alpha' : 'Membro Gratuito'}
                     </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full max-w-xs text-center mb-10">
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <div className="text-xl font-black text-white">{stats.streak}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Streak</div>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <div className="text-xl font-black text-white">{stats.xp}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">XP Atual</div>
                    </div>
                    <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                        <div className="text-xl font-black text-alpha-gold">{stats.level}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mt-1">Nível</div>
                    </div>
                </div>

                {!stats.isPremium && (
                    <button 
                        onClick={() => setCurrentView(AppView.PREMIUM)}
                        className="w-full max-w-xs bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-bold py-3 rounded-xl uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)] mb-4 flex items-center justify-center gap-2"
                    >
                        <Crown size={18} fill="black" />
                        Fazer Upgrade
                    </button>
                )}

                <button 
                    onClick={() => signOut()}
                    className="text-red-500/50 text-xs font-bold uppercase tracking-widest hover:text-red-500 transition-colors border border-red-500/20 px-6 py-3 rounded-xl hover:bg-red-500/10 w-full max-w-xs"
                >
                    Fazer Logout
                </button>
            </div>
        );
      default:
        return (
            <Dashboard 
                stats={stats} 
                onCompleteTask={handleTaskComplete} 
                onChangeView={setCurrentView}
                showLevelUp={showLevelUp}
                onCloseLevelUp={() => setShowLevelUp(false)}
            />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-alpha-gold selection:text-black overflow-x-hidden">
      <Navigation currentView={currentView} onChangeView={setCurrentView} />
      <main className="md:pl-72 p-4 md:p-8 max-w-4xl mx-auto min-h-screen">
        {renderView()}
      </main>
    </div>
  );
}

const App: React.FC = () => {
  const isEnvConfigured = isSupabaseConfigured();

  if (!isEnvConfigured) {
      return <SetupRequired />;
  }

  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default App;
