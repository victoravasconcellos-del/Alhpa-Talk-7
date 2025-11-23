import React from 'react';
import { Check, Star, ExternalLink } from 'lucide-react';

const Premium: React.FC = () => {
  const handleSubscribe = () => {
      const paymentUrl = "https://google.com"; 
      window.open(paymentUrl, '_blank');
  };

  return (
    <div className="space-y-6 pb-20 pt-4 text-center animate-slide-up">
      <div className="inline-block p-4 rounded-full bg-gradient-to-br from-alpha-gold to-yellow-700 shadow-xl shadow-yellow-900/20 mb-4 relative">
        <div className="absolute inset-0 bg-alpha-gold/30 blur-xl rounded-full animate-pulse"></div>
        <Star size={48} fill="white" className="text-white relative z-10" />
      </div>
      
      <h1 className="text-3xl font-bold text-white">AlphaTalk <span className="text-alpha-gold">Pro</span></h1>
      <p className="text-zinc-400 px-8">Desbloqueie todo o seu potencial e domine qualquer interação social.</p>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 mx-2 text-left space-y-4 shadow-lg">
        <div className="flex gap-3">
            <div className="mt-1 bg-green-500/20 p-1 rounded-full h-fit"><Check size={14} className="text-green-500" /></div>
            <div>
                <h4 className="text-white font-bold">Análises de Prints Ilimitadas</h4>
                <p className="text-zinc-500 text-sm">Nunca mais fique sem saber o que responder.</p>
            </div>
        </div>
        <div className="flex gap-3">
            <div className="mt-1 bg-green-500/20 p-1 rounded-full h-fit"><Check size={14} className="text-green-500" /></div>
            <div>
                <h4 className="text-white font-bold">Coach de Mensagens IA Avançado</h4>
                <p className="text-zinc-500 text-sm">Acesso aos modos "Sedutor Mestre" e "Humor Inteligente".</p>
            </div>
        </div>
        <div className="flex gap-3">
            <div className="mt-1 bg-green-500/20 p-1 rounded-full h-fit"><Check size={14} className="text-green-500" /></div>
            <div>
                <h4 className="text-white font-bold">Biblioteca Secreta</h4>
                <p className="text-zinc-500 text-sm">Acesso a técnicas de manipulação benévola e psicologia avançada.</p>
            </div>
        </div>
      </div>

      <div className="px-4">
        <button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-bold text-lg py-4 rounded-xl hover:scale-[1.02] transition-transform shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2"
        >
            Assinar por R$ 29,90/mês <ExternalLink size={20} />
        </button>
        <p className="text-zinc-600 text-xs mt-4">
            Ambiente seguro. Cancele a qualquer momento.<br/>
            Garantia incondicional de 7 dias.
        </p>
      </div>
    </div>
  );
};

export default Premium;
