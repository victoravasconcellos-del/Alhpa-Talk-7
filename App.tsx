import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ChatAnalyzer from './components/ChatAnalyzer';
import MessageCoach from './components/MessageCoach';
import Library from './components/Library';
import Premium from './components/Premium';
import Auth from './components/Auth';
import ProfileSettings from './components/ProfileSettings';
import Onboarding from './components/Onboarding';
import LandingPage from './components/LandingPage';
import Quiz from './components/Quiz';
import { AppView, UserStats } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getUserProfile, updateUserStats, INITIAL_STATS, createUserProfile, incrementUsage } from './services/userService';
import { isSupabaseConfigured } from './lib/supabase';
import { Settings } from 'lucide-react';

const SetupRequired: React.FC = () => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center">
    <h1 className="text-white font-bold mb-4">Configuração Necessária</h1>
    <p className="text-zinc-400 text-sm">Conecte o Supabase para continuar.</p>
  </div>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-alpha-gold border-t-transparent rounded-full animate-spin"></div></div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{children}</>;
};

const AuthenticatedApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [stats, setStats] = useState<UserStats>(INITIAL_STATS);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [dbError, setDbError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        setLoadingData(true);
        try {
            const hasSeenIntro = localStorage.getItem(`alpha_intro_${user.id}`);
            if (!hasSeenIntro) setShowOnboarding(true);
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
            if (err.message === "TABLE_MISSING" || err.code === 'PGRST205') setDbError(true);
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
        if (leveledUp) setShowLevelUp(true);
        const newStats = { ...prev, xp: newXp, level: newLevel, maxXp: newMaxXp };
        if (user && !dbError) updateUserStats(user.id, newStats);
        return newStats;
    });
  };

  const handleUpdateProfile = async (name: string, avatarUrl: string) => {
      const newStats = { ...stats, name, avatarUrl };
      setStats(newStats);
      if (user) await updateUserStats(user.id, newStats);
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

  if (dbError) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Erro: Banco de dados não configurado.</div>;
  if (loadingData) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-10 h-10 border-2 border-alpha-gold border-t-transparent rounded-full animate-spin"></div></div>;
  if (showOnboarding) return <Onboarding onFinish={handleFinishOnboarding} />;

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-alpha-gold selection:text-black overflow-x-hidden">
      <Navigation currentView={currentView} onChangeView={setCurrentView} />
      <main className="md:pl-72 p-4 md:p-8 max-w-4xl mx-auto min-h-screen">
        {currentView === AppView.DASHBOARD && <Dashboard stats={stats} onCompleteTask={(xp) => addXp(xp)} onChangeView={setCurrentView} showLevelUp={showLevelUp} onCloseLevelUp={() => setShowLevelUp(false)} />}
        {currentView === AppView.ANALYZER && <ChatAnalyzer onAnalysisComplete={handleScanUsed} usageCount={stats.dailyScans} isPremium={stats.isPremium} onUpgrade={() => setCurrentView(AppView.PREMIUM)} />}
        {currentView === AppView.COACH && <MessageCoach onUsage={handleCoachUsed} usageCount={stats.dailyCoachUses} isPremium={stats.isPremium} onUpgrade={() => setCurrentView(AppView.PREMIUM)} />}
        {currentView === AppView.LIBRARY && <Library isPremium={stats.isPremium} onUpgrade={() => setCurrentView(AppView.PREMIUM)} />}
        {currentView === AppView.PREMIUM && <Premium />}
        {currentView === AppView.SETTINGS && <ProfileSettings stats={stats} onSave={handleUpdateProfile} onBack={() => setCurrentView(AppView.PROFILE)} />}
        {currentView === AppView.PROFILE && (
            <div className="flex flex-col items-center justify-center h-[70vh] text-zinc-500 animate-slide-up relative">
                <button onClick={() => setCurrentView(AppView.SETTINGS)} className="absolute top-0 right-4 p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-alpha-gold hover:border-alpha-gold transition-all"><Settings size={20} /></button>
                <div className="w-32 h-32 rounded-full border-4 border-zinc-800 p-1 mb-6"><div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">{stats.avatarUrl ? <img src={stats.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : <div className="text-4xl font-black text-zinc-600">{stats.name.charAt(0).toUpperCase()}</div>}</div></div>
                <h2 className="text-white text-3xl font-black mb-1">{stats.name}</h2>
                <div className="flex gap-2 mb-8"><span className="text-xs font-bold uppercase tracking-widest text-zinc-600 bg-zinc-900 px-2 py-1 rounded">{stats.isPremium ? 'Membro Alpha' : 'Membro Gratuito'}</span></div>
                {!stats.isPremium && <button onClick={() => setCurrentView(AppView.PREMIUM)} className="w-full max-w-xs bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-bold py-3 rounded-xl mb-4">Fazer Upgrade</button>}
            </div>
        )}
      </main>
    </div>
  );
}

const App: React.FC = () => {
  const isEnvConfigured = isSupabaseConfigured();
  if (!isEnvConfigured) return <SetupRequired />;
  
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/app" element={<ProtectedRoute><AuthenticatedApp /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;
