
import React, { useState } from 'react';
import { Check, Star, ExternalLink, Crown, ShieldCheck, Zap, Calendar, Tag, ArrowRight, Gift, X, Loader2, Fingerprint, LifeBuoy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { redeemPremiumCode } from '../services/userService';

interface PremiumProps {
    isPremium?: boolean;
}

const Premium: React.FC<PremiumProps> = ({ isPremium = false }) => {
  const [plan, setPlan] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemError, setRedeemError] = useState('');
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = () => {
      // Links de pagamento reais
      const paymentLinks = {
          MONTHLY: "https://pay.kiwify.com.br/iaPuHl9", // Link Mensal R$ 29,90
          YEARLY: "https://pay.kiwify.com.br/vOprKMI"   // Link Anual R$ 238,80
      };
      
      window.open(paymentLinks[plan], '_blank');
  };

  const handleRedeemCode = async () => {
      if (!redeemCode.trim() || !user) return;
      
      setRedeeming(true);
      setRedeemError('');

      try {
          const result = await redeemPremiumCode(user.id, redeemCode);
          
          if (result.success) {
              setSuccess(true);
              setTimeout(() => {
                  window.location.reload(); // Recarrega para atualizar status global
              }, 3000);
          } else {
              setRedeemError(result.message);
          }
      } catch (e) {
          setRedeemError("Erro inesperado. Tente novamente.");
      } finally {
          setRedeeming(false);
      }
  };

  if (success) {
      return (
          <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 animate-in zoom-in duration-500">
              <div className="relative mb-8">
                  <div className="absolute inset-0 bg-alpha-gold/30 blur-3xl rounded-full animate-pulse"></div>
                  <div className="w-32 h-32 bg-gradient-to-br from-alpha-gold to-yellow-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.6)] relative z-10 animate-bounce">
                      <Crown size={64} className="text-white" />
                  </div>
              </div>
              <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter text-center">Acesso Liberado!</h2>
              <p className="text-zinc-400 text-center mb-8">Bem-vindo à elite. Seu perfil agora é <span className="text-alpha-gold font-bold">Alpha Pro</span>.</p>
              <div className="w-12 h-12 border-4 border-alpha-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-zinc-600 mt-4 uppercase font-bold tracking-widest">Atualizando sistema...</p>
          </div>
      );
  }

  // Member Area View (If already premium)
  if (isPremium) {
      return (
          <div className="space-y-6 pb-24 pt-4 animate-slide-up px-4 flex flex-col items-center">
              <div className="w-full max-w-md">
                  <h1 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                      <Crown className="text-alpha-gold" fill="#F59E0B" />
                      Área do Membro
                  </h1>

                  {/* Digital Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-alpha-gold/30 p-6 shadow-[0_0_30px_rgba(245,158,11,0.15)] aspect-[1.58/1]">
                      {/* Background Texture */}
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-alpha-gold/10 blur-3xl rounded-full"></div>

                      <div className="relative z-10 flex flex-col justify-between h-full">
                          <div className="flex justify-between items-start">
                              <div className="w-10 h-10 bg-gradient-to-br from-alpha-gold to-yellow-600 rounded flex items-center justify-center shadow-lg">
                                  <span className="font-black text-black text-lg">A</span>
                              </div>
                              <div className="text-right">
                                  <span className="block text-[10px] text-alpha-gold font-bold uppercase tracking-widest">Status</span>
                                  <span className="block text-white font-bold text-sm flex items-center justify-end gap-1">
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                      ATIVO
                                  </span>
                              </div>
                          </div>

                          <div className="text-center">
                              <span className="text-2xl font-black text-white uppercase tracking-widest drop-shadow-md">ALPHA PRO</span>
                          </div>

                          <div className="flex justify-between items-end">
                              <div>
                                  <span className="block text-[8px] text-zinc-500 uppercase tracking-widest mb-1">ID do Membro</span>
                                  <span className="font-mono text-zinc-300 text-xs flex items-center gap-1">
                                      <Fingerprint size={12} />
                                      {user?.id ? user.id.slice(0, 8).toUpperCase() : 'ALPHA-001'}
                                  </span>
                              </div>
                              <div className="text-right">
                                  <span className="block text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Membro Desde</span>
                                  <span className="font-mono text-zinc-300 text-xs">
                                      {new Date().getFullYear()}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Stats / Benefits Summary */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
                          <div className="bg-green-900/20 p-2 rounded-lg text-green-500">
                             <Check size={18} />
                          </div>
                          <div>
                              <p className="text-[10px] text-zinc-500 uppercase font-bold">Scanner IA</p>
                              <p className="text-white text-sm font-bold">Ilimitado</p>
                          </div>
                      </div>
                      <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center gap-3">
                          <div className="bg-blue-900/20 p-2 rounded-lg text-blue-500">
                             <Check size={18} />
                          </div>
                          <div>
                              <p className="text-[10px] text-zinc-500 uppercase font-bold">Coach</p>
                              <p className="text-white text-sm font-bold">Mestre</p>
                          </div>
                      </div>
                  </div>

                  {/* Support CTA */}
                  <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
                      <p className="text-zinc-400 text-sm mb-4">Precisa de ajuda com sua assinatura?</p>
                      <button className="flex items-center justify-center gap-2 text-zinc-300 hover:text-white transition-colors bg-zinc-800 hover:bg-zinc-700 py-3 px-6 rounded-xl w-full text-sm font-bold">
                          <LifeBuoy size={16} />
                          Falar com Suporte
                      </button>
                  </div>
              </div>
          </div>
      );
  }

  // Sales View (If not premium)
  return (
    <div className="space-y-6 pb-24 pt-4 text-center animate-slide-up px-4 relative">
      
      {/* Redeem Modal */}
      {showRedeem && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full max-w-sm relative shadow-2xl">
                  <button onClick={() => setShowRedeem(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                      <X size={20} />
                  </button>
                  
                  <div className="flex flex-col items-center mb-6">
                      <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mb-3 border border-zinc-700">
                          <Gift className="text-alpha-gold" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">Resgatar Acesso</h3>
                      <p className="text-zinc-500 text-sm">Insira seu código enviado por e-mail.</p>
                  </div>

                  <div className="space-y-4">
                      <input 
                          type="text" 
                          placeholder="Digite seu código"
                          value={redeemCode}
                          onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                          className="w-full bg-black border border-zinc-700 rounded-xl py-3 px-4 text-center text-white font-mono uppercase tracking-widest placeholder:text-zinc-700 focus:border-alpha-gold outline-none"
                      />
                      
                      {redeemError && (
                          <div className="bg-red-900/20 border border-red-500/20 rounded p-2 text-center">
                            <p className="text-red-400 text-xs font-bold">{redeemError}</p>
                          </div>
                      )}

                      <button 
                          onClick={handleRedeemCode}
                          disabled={redeeming || !redeemCode}
                          className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                          {redeeming ? <Loader2 className="animate-spin" size={18} /> : 'Ativar Agora'}
                      </button>
                  </div>
              </div>
          </div>
      )}

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
                    <p className="text-zinc-500 text--[10px] line-through decoration-red-500/50">
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

      <div className="pt-4">
          <button 
            onClick={() => setShowRedeem(true)}
            className="text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors border-b border-transparent hover:border-zinc-500 pb-0.5"
          >
              Tenho um código de resgate
          </button>
      </div>
    </div>
  );
};

export default Premium;
