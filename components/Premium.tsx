import React, { useState } from 'react';
import { Check, Star, Crown, ShieldCheck, Zap, Calendar } from 'lucide-react';

const Premium: React.FC = () => {
  const [plan, setPlan] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY'); // Mensal default

  const paymentUrl = plan === 'MONTHLY' 
      ? "https://pay.kiwify.com.br/iaPuHl9" 
      : "https://pay.kiwify.com.br/vOprKMI";

  return (
    <div className="space-y-6 pb-24 pt-4 text-center animate-slide-up px-4">
      <div className="relative mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-alpha-gold to-yellow-700 shadow-[0_0_40px_rgba(245,158,11,0.4)] mb-4 relative z-10"><Crown size={40} fill="white" className="text-white" /></div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-2">AlphaTalk <span className="text-alpha-gold">PRO</span></h1>
      </div>

      <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 inline-flex relative mb-6 shadow-lg">
          <button onClick={() => setPlan('MONTHLY')} className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative z-10 ${plan === 'MONTHLY' ? 'text-black bg-white' : 'text-zinc-500'}`}>Mensal</button>
          <button onClick={() => setPlan('YEARLY')} className={`px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative z-10 ${plan === 'YEARLY' ? 'text-black bg-white' : 'text-zinc-500'}`}>Anual</button>
      </div>

      <div className="bg-gradient-to-b from-zinc-900 to-black rounded-3xl border border-zinc-800 p-6 relative overflow-hidden shadow-2xl ring-1 ring-white/5">
        <div className="mb-8 mt-4">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">{plan === 'YEARLY' ? 'Acesso Completo por 1 Ano' : 'Plano Mensal Flexível'}</p>
            <div className="flex items-end justify-center gap-1"><span className="text-sm text-zinc-500 font-bold mb-4">R$</span><span className="text-6xl font-black text-white tracking-tighter">{plan === 'YEARLY' ? '238' : '29'}</span><div className="flex flex-col items-start mb-2"><span className="text-2xl font-bold text-white leading-none">,{plan === 'YEARLY' ? '80' : '90'}</span><span className="text-zinc-500 text-[10px] font-bold uppercase">{plan === 'YEARLY' ? '/ano' : '/mês'}</span></div></div>
        </div>

        <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black text-lg py-4 rounded-xl flex items-center justify-center gap-2 group relative overflow-hidden decoration-0 no-underline"><Zap size={20} fill="black" />ASSINAR AGORA</a>
        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-600"><ShieldCheck size={14} /><p className="text-[10px] font-medium">Pagamento seguro.</p></div>
      </div>
    </div>
  );
};

export default Premium;
