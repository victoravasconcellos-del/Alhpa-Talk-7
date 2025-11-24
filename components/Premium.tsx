import React, { useState } from 'react';
import { Check, Star, ExternalLink, Crown, ShieldCheck, Zap, Calendar, Tag, ArrowRight } from 'lucide-react';

const Premium: React.FC = () => {
  const [plan, setPlan] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');

  const handleSubscribe = () => {
      // Links de pagamento reais (Substitua pelos seus links do Stripe/Mercado Pago)
      const paymentLinks = {
          MONTHLY: "https://pay.kiwify.com.br/iaPuHl9", // Link Mensal R$ 29,90
          YEARLY: "https://pay.kiwify.com.br/vOprKMI"   // Link Anual R$ 238,80
      };
      
      window.open(paymentLinks[plan], '_blank');
  };

  return (
    <div className="space-y-6 pb-24 pt-4 text-center animate-slide-up px-4">
      
      {/* Header */}
      <div className="relative mb-8">
          <div className="inline-block p-4 rounded-full bg-gradient-to-br from-alpha-gold to-yellow-700 shadow-[0_0_40px_rgba(245,158,11,0.4)] mb-4 relative z-10 animate-[bounce_3s_infinite]">
            <Crown size={40} fill="white" className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tight leading-none mb-2">
              AlphaTalk <span className="text-alpha-gold">PRO</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">
              Desbloqueie todo o arsenal e domine qualquer interação social.
          </p>
      </div>

      {/* Premium Plan Toggle */}
      <div className="relative z-10 mb-8 inline-block">
          <div className="bg-black p-1.5 rounded-2xl border border-zinc-800 inline-flex relative shadow-2xl">
              {/* Sliding Background */}
              <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-zinc-800 rounded-xl transition-all duration-300 shadow-lg border border-zinc-700 ${plan === 'MONTHLY' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}></div>

              <button 
                  onClick={() => setPlan('MONTHLY')}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative z-10 w-32 ${plan === 'MONTHLY' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                  Mensal
              </button>
              <button 
                  onClick={() => setPlan('YEARLY')}
                  className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative z-10 w-32 ${plan === 'YEARLY' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                  Anual
              </button>
          </div>
          
          {/* Floating Discount Badge */}
          <div className="absolute -top-3 -right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.6)] border border-green-400 animate-bounce z-20 pointer-events-none rotate-3">
              PAGUE 8, LEVE 12
          </div>
      </div>

      {/* Pricing Card */}
      <div className="bg-gradient-to-b from-zinc-900 to-black rounded-3xl border border-zinc-800 p-6 relative overflow-hidden shadow-2xl ring-1 ring-white/5 max-w-sm mx-auto">
        {/* Best Value Badge */}
        {plan === 'YEARLY' && (
            <div className="absolute top-0 right-0 bg-gradient-to-bl from-alpha-gold to-yellow-600 text-black text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest shadow-lg flex items-center gap-1 z-10">
                <Star size={10} fill="black" /> Melhor Oferta
            </div>
        )}

        <div className="mb-8 mt-4">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">
                {plan === 'YEARLY' ? 'Plano Anual (Recomendado)' : 'Plano Mensal Flexível'}
            </p>
            
            <div className="flex items-end justify-center gap-1">
                <span className="text-sm text-zinc-500 font-bold mb-4">R$</span>
                <span className="text-6xl font-black text-white tracking-tighter shadow-orange-500 drop-shadow-sm">
                    {plan === 'YEARLY' ? '19' : '29'}
                </span>
                <div className="flex flex-col items-start mb-2">
                    <span className="text-2xl font-bold text-white leading-none">,{plan === 'YEARLY' ? '90' : '90'}</span>
                    <span className="text-zinc-500 text-[10px] font-bold uppercase">
                        {plan === 'YEARLY' ? '/mês' : '/mês'}
                    </span>
                </div>
            </div>

            {plan === 'YEARLY' ? (
                <div className="mt-4 flex flex-col items-center gap-2">
                    <div className="bg-green-900/30 border border-green-500/30 px-3 py-1 rounded-lg text-green-400 text-xs font-bold flex items-center gap-1">
                        <Tag size={12} /> Economia de R$ 120,00
                    </div>
                    <p className="text-zinc-500 text-[10px] line-through decoration-red-500/50">
                        De R$ 358,80 por apenas R$ 238,80/ano
                    </p>
                </div>
            ) : (
                <div className="mt-4">
                     <p className="text-zinc-500 text-[10px]">Cancele quando quiser</p>
                </div>
            )}
        </div>

        <div className="space-y-4 text-left mb-8 px-2 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
            <div className="flex gap-3 items-start">
                <div className="mt-0.5 bg-alpha-gold/10 p-1 rounded-full min-w-fit border border-alpha-gold/20"><Check size={12} className="text-alpha-gold" /></div>
                <div>
                    <strong className="text-white text-sm block">Scanner IA Ilimitado</strong>
                    <p className="text-zinc-500 text-xs">Analise prints sem limite diário.</p>
                </div>
            </div>
            <div className="flex gap-3 items-start">
                <div className="mt-0.5 bg-alpha-gold/10 p-1 rounded-full min-w-fit border border-alpha-gold/20"><Check size={12} className="text-alpha-gold" /></div>
                <div>
                    <strong className="text-white text-sm block">Coach Mestre</strong>
                    <p className="text-zinc-500 text-xs">Acesso aos modos Sedutor, Humor e Direto.</p>
                </div>
            </div>
            <div className="flex gap-3 items-start">
                <div className="mt-0.5 bg-alpha-gold/10 p-1 rounded-full min-w-fit border border-alpha-gold/20"><Check size={12} className="text-alpha-gold" /></div>
                <div>
                    <strong className="text-white text-sm block">Biblioteca Secreta</strong>
                    <p className="text-zinc-500 text-xs">Acesso a +500 frases e roteiros.</p>
                </div>
            </div>
        </div>

        <button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black text-lg py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 group relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span className="relative z-10 flex items-center gap-2 uppercase tracking-wide">
                <Zap size={20} fill="black" />
                {plan === 'YEARLY' ? 'Quero o Plano Anual' : 'Assinar Mensal'}
            </span>
        </button>

        <div className="mt-6 flex items-center justify-center gap-2 text-zinc-600">
            <ShieldCheck size={14} />
            <p className="text-[10px] font-medium">
                Pagamento seguro. Acesso imediato.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Premium;
