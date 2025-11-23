import React from 'react';
import { AppView } from '../types';
import { Home, MessageCircle, ScanLine, Book, User, Crown, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView }) => {
  const { signOut } = useAuth();
  
  const navItems = [
    { id: AppView.DASHBOARD, icon: Home, label: 'Início' },
    { id: AppView.ANALYZER, icon: ScanLine, label: 'Scanner' },
    { id: AppView.COACH, icon: MessageCircle, label: 'Coach' },
    { id: AppView.LIBRARY, icon: Book, label: 'Frases' },
    { id: AppView.PROFILE, icon: User, label: 'Perfil' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-72 bg-black border-r border-zinc-900 h-screen fixed left-0 top-0 z-50">
        <div className="p-8 flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-alpha-gold to-orange-700 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <span className="text-3xl font-black text-black">A</span>
            </div>
            <div>
                <h1 className="text-xl font-black tracking-widest text-white">ALPHA</h1>
                <p className="text-[10px] text-alpha-gold tracking-[0.3em] uppercase font-bold">Talk</p>
            </div>
        </div>
        
        <div className="flex-1 px-4 space-y-2">
          <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-4">Navegação</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                currentView === item.id
                  ? 'bg-zinc-900/80 text-white shadow-lg border border-zinc-800'
                  : 'text-zinc-500 hover:bg-zinc-900/40 hover:text-zinc-300 border border-transparent'
              }`}
            >
              {currentView === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-alpha-gold"></div>
              )}
              <item.icon size={20} className={`transition-transform duration-300 ${currentView === item.id ? 'text-alpha-gold scale-110 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] animate-[pulse_3s_infinite]' : ''}`} />
              <span className={`font-medium tracking-wide text-sm ${currentView === item.id ? 'font-bold' : ''}`}>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6 space-y-3">
            <button 
                onClick={() => onChangeView(AppView.PREMIUM)}
                className="group w-full relative overflow-hidden bg-black border border-alpha-gold/30 p-4 rounded-xl transition-all hover:border-alpha-gold/60 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-alpha-gold/0 via-alpha-gold/10 to-alpha-gold/0 translate-x-[-200%] group-hover:animate-[shimmer_2s_infinite]"></div>
                <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-alpha-gold/10 p-2 rounded-lg">
                        <Crown size={18} className="text-alpha-gold" />
                    </div>
                    <div className="text-left">
                        <span className="block text-sm font-bold text-white">Upgrade Pro</span>
                        <span className="block text-[10px] text-zinc-500">Acesso total</span>
                    </div>
                </div>
            </button>
            
            <button 
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 p-3 text-zinc-600 hover:text-red-500 transition-colors text-xs font-bold uppercase tracking-widest border border-transparent hover:border-zinc-800 rounded-xl"
            >
                <LogOut size={16} />
                Sair
            </button>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full glass z-50 px-2 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.9)]">
        <div className="flex justify-between items-end h-[70px] pb-2">
          {navItems.map((item) => {
             const isActive = currentView === item.id;
             return (
                <button
                key={item.id}
                onClick={() => onChangeView(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full relative transition-all duration-300 ${isActive ? 'pb-1' : 'pb-0'}`}
                >
                <div className={`
                    relative p-2.5 rounded-2xl transition-all duration-300
                    ${isActive ? 'bg-zinc-800 text-alpha-gold mb-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-zinc-700' : 'text-zinc-500'}
                `}>
                    <item.icon 
                        size={isActive ? 22 : 24} 
                        strokeWidth={isActive ? 2.5 : 2} 
                        className={isActive ? 'animate-[pulse_3s_infinite]' : ''}
                    />
                </div>
                <span className={`text-[10px] font-medium transition-all duration-300 ${isActive ? 'text-white scale-100' : 'text-zinc-600 scale-90'}`}>
                    {item.label}
                </span>
                </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;
