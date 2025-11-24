import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';

const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Check if already installed (Standalone mode)
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(isStandaloneMode);

    // 2. Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (!isStandaloneMode) {
        // For Android/Desktop: Listen for beforeinstallprompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show prompt immediately or logic to wait
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS: Just show it after a delay if it's iOS and not standalone
        // iOS doesn't support beforeinstallprompt, so we detect manually
        if (isIosDevice) {
            // Check if user has dismissed it before in this session
            const hasDismissed = sessionStorage.getItem('installPromptDismissed');
            if (!hasDismissed) {
                const timer = setTimeout(() => setIsVisible(true), 1000); // 1s delay (Reduced from 3000ms)
                return () => clearTimeout(timer);
            }
        }

        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsVisible(false);
    }
  };

  const handleDismiss = () => {
      setIsVisible(false);
      sessionStorage.setItem('installPromptDismissed', 'true');
  };

  if (!isVisible || isStandalone) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-safe animate-slide-up">
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-alpha-gold/30 rounded-2xl p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] relative max-w-md mx-auto">
            <button 
                onClick={handleDismiss} 
                className="absolute top-3 right-3 text-zinc-500 hover:text-white p-1"
            >
                <X size={20} />
            </button>

            <div className="flex items-start gap-4 pr-6">
                <div className="w-14 h-14 bg-gradient-to-br from-alpha-gold to-yellow-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="font-black text-black text-2xl">A</span>
                </div>
                <div>
                    <h3 className="font-black text-white text-sm uppercase tracking-wide mb-1">
                        Instalar AlphaTalk
                    </h3>
                    <p className="text-zinc-400 text-xs leading-relaxed mb-3 font-medium">
                        {isIOS 
                            ? "Instale para ter a experiência de App em Tela Cheia, sem barras de navegador." 
                            : "Adicione à tela inicial para acesso rápido e melhor performance."}
                    </p>

                    {isIOS ? (
                        <div className="space-y-2">
                             <div className="flex items-center gap-2 text-xs text-zinc-300">
                                1. Toque no botão <span className="text-blue-400 font-bold flex items-center gap-1"><Share size={14} /> Compartilhar</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-zinc-300">
                                2. Selecione <span className="text-white font-bold flex items-center gap-1 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700"><PlusSquare size={14} /> Adicionar à Tela de Início</span>
                             </div>
                        </div>
                    ) : (
                        <button 
                            onClick={handleInstallClick}
                            className="bg-alpha-gold text-black font-black text-xs px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-white transition-colors shadow-lg shadow-alpha-gold/20 w-full justify-center"
                        >
                            <Download size={16} strokeWidth={3} />
                            ADICIONAR AGORA
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default InstallPrompt;
