
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ScanLine, Zap, ShieldCheck, ChevronRight, Star, UserCheck, Lock, ArrowDown } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-alpha-gold selection:text-black pb-10">
      
      {/* Navbar Simple - Adicionado pt-safe para evitar corte no iPhone */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/5 transition-all pt-safe">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-alpha-gold to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-alpha-gold/20">
                    <span className="font-black text-black text-lg">A</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-white">Alpha<span className="text-alpha-gold">Talk</span></span>
            </div>
            <div className="flex gap-4 items-center">
                <button 
                    onClick={() => navigate('/login')}
                    className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
                >
                    Entrar
                </button>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center min-h-[95vh]">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto animate-slide-up space-y-8 flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-alpha-gold/30 rounded-full px-4 py-1.5 shadow-[0_0_20px_rgba(245,158,11,0.2)] mx-auto animate-in fade-in slide-in-from-top-4 duration-1000">
                <Star size={14} className="text-alpha-gold fill-alpha-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Método Validado por IA</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white animate-in zoom-in-50 duration-1000 delay-100">
                DOMINE A <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-alpha-gold via-yellow-500 to-amber-600 drop-shadow-[0_0_30px_rgba(245,158,11,0.3)]">CONQUISTA</span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-200">
                Pare de ser ignorado. Use a Inteligência Artificial para decodificar mensagens, criar respostas infalíveis e garantir seus encontros.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto sm:max-w-none pt-4 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300">
                <button 
                    onClick={() => navigate('/quiz')}
                    className="w-full sm:w-auto bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black text-lg px-8 py-5 rounded-2xl hover:scale-105 transition-all shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    COMEÇAR AGORA
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto bg-zinc-900/80 backdrop-blur border border-zinc-700 text-white font-bold text-lg px-8 py-5 rounded-2xl hover:bg-zinc-800 hover:border-zinc-500 transition-colors"
                >
                    JÁ TENHO CONTA
                </button>
            </div>
            
            <div className="pt-8 flex items-center justify-center gap-6 text-zinc-500 text-xs font-bold uppercase tracking-widest opacity-60 animate-in fade-in duration-1000 delay-500">
                <span className="flex items-center gap-2"><Lock size={14}/> Seguro</span>
                <span className="flex items-center gap-2"><UserCheck size={14}/> Anônimo</span>
            </div>
        </div>
        
        <button 
            onClick={scrollToFeatures}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-500 animate-bounce hover:text-alpha-gold transition-colors"
        >
            <ArrowDown size={24} />
        </button>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-950 relative border-t border-white/5 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 text-white">O Arsenal Alpha</h2>
                <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto">Ferramentas de elite para hackear a interação social.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="group bg-gradient-to-b from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 hover:border-alpha-gold/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(245,158,11,0.1)]">
                    <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-alpha-gold/20">
                        <ScanLine size={32} className="text-alpha-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-alpha-gold transition-colors">Scanner de Prints</h3>
                    <p className="text-zinc-400 leading-relaxed font-medium">
                        Envie o print da conversa. A IA analisa o subtexto oculto, detecta o nível de interesse dela e te diz exatamente o que responder.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="group bg-gradient-to-b from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(59,130,246,0.1)]">
                    <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-blue-500/20">
                        <MessageCircle size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Alpha Coach</h3>
                    <p className="text-zinc-400 leading-relaxed font-medium">
                        Um mentor 24h. Peça sugestões de mensagens sedutoras, engraçadas, misteriosas ou diretas para qualquer situação.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="group bg-gradient-to-b from-zinc-900 to-black p-8 rounded-3xl border border-zinc-800 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(34,197,94,0.1)]">
                    <div className="w-16 h-16 bg-zinc-950 rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 group-hover:scale-110 transition-transform shadow-lg group-hover:shadow-green-500/20">
                        <Zap size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Biblioteca Secreta</h3>
                    <p className="text-zinc-400 leading-relaxed font-medium">
                        Acesso imediato a centenas de abridores e roteiros validados para marcar encontros e criar tensão sexual.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-black relative border-t border-zinc-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_50%)] pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <div className="flex justify-center gap-1 mb-8">
                  {[1,2,3,4,5].map(i => <Star key={i} size={32} className="text-alpha-gold fill-alpha-gold animate-pulse" style={{animationDelay: `${i*100}ms`}} />)}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-10 leading-tight text-white">
                  "Eu não sabia o que responder e estava quase perdendo a chance. O AlphaTalk me salvou e consegui o encontro."
              </h3>
              <div className="flex items-center justify-center gap-4 bg-zinc-900/80 inline-flex px-8 py-4 rounded-2xl border border-zinc-800 shadow-xl backdrop-blur-sm">
                  <div className="w-14 h-14 rounded-full border-2 border-alpha-gold/30 p-0.5 shadow-lg shadow-alpha-gold/10">
                      <img 
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop" 
                        alt="Rafael M." 
                        className="w-full h-full rounded-full object-cover filter brightness-90 contrast-125"
                      />
                  </div>
                  <div className="text-left">
                      <p className="text-white font-bold text-lg">Rafael M.</p>
                      <p className="text-alpha-gold text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck size={12} /> Membro Alpha Confirmado
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black border-t border-zinc-800">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tighter leading-none">
                PRONTO PARA <br/>
                <span className="text-white">MUDAR O JOGO?</span>
              </h2>
              <p className="text-zinc-400 mb-10 text-xl max-w-xl mx-auto">Não deixe mais nenhuma mensagem sem resposta. Assuma o controle.</p>
              
              <button 
                onClick={() => navigate('/quiz')}
                className="w-full md:w-auto bg-white text-black font-black text-xl px-12 py-6 rounded-2xl hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] uppercase tracking-widest flex items-center justify-center gap-3 mx-auto"
              >
                  Fazer Teste Grátis <ChevronRight size={24} />
              </button>
              
              <p className="mt-8 text-sm text-zinc-600 flex items-center justify-center gap-2 font-medium">
                  <ShieldCheck size={16} />
                  Garantia de Satisfação • Cancelamento Fácil
              </p>
          </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10 border-t border-zinc-900 text-center px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-zinc-500">
                <span className="font-black text-xl">A</span>
            </div>
            <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">© 2024 AlphaTalk. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
