import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ScanLine, Zap, ShieldCheck, ChevronRight, Star, UserCheck, Lock } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-alpha-gold selection:text-black">
      
      {/* Navbar Simple */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-alpha-gold to-yellow-600 rounded-lg flex items-center justify-center">
                    <span className="font-black text-black text-lg">A</span>
                </div>
                <span className="font-bold text-lg tracking-tight">Alpha<span className="text-alpha-gold">Talk</span></span>
            </div>
            <button 
                onClick={() => navigate('/login')}
                className="text-sm font-bold text-zinc-400 hover:text-white transition-colors"
            >
                Entrar
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 flex flex-col items-center justify-center text-center min-h-[90vh]">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto animate-slide-up space-y-8">
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-alpha-gold/30 rounded-full px-4 py-1.5 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <Star size={14} className="text-alpha-gold fill-alpha-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">Método Validado por IA</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                DOMINE A <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-alpha-gold via-yellow-500 to-amber-600">CONQUISTA</span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                Pare de ser ignorado. Use a Inteligência Artificial para decodificar mensagens, criar respostas infalíveis e garantir seus encontros.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
                <button 
                    onClick={() => navigate('/quiz')}
                    className="w-full sm:w-auto bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black text-lg px-8 py-5 rounded-2xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 group"
                >
                    COMEÇAR AGORA
                    <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-white font-bold text-lg px-8 py-5 rounded-2xl hover:bg-zinc-800 transition-colors"
                >
                    JÁ TENHO CONTA
                </button>
            </div>
            
            <div className="pt-8 flex items-center justify-center gap-6 text-zinc-500 text-xs font-bold uppercase tracking-widest opacity-60">
                <span className="flex items-center gap-2"><Lock size={14}/> Seguro</span>
                <span className="flex items-center gap-2"><UserCheck size={14}/> Anônimo</span>
            </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-zinc-950 relative border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 text-white">O Arsenal Alpha</h2>
                <p className="text-zinc-500 text-lg">Ferramentas de elite para hackear a interação social.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Feature 1 */}
                <div className="group bg-zinc-900/40 p-8 rounded-3xl border border-white/5 hover:border-alpha-gold/50 hover:bg-zinc-900/80 transition-all duration-300">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <ScanLine size={32} className="text-alpha-gold" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Scanner de Prints</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Envie o print da conversa. A IA analisa o subtexto oculto, detecta o nível de interesse dela e te diz exatamente o que responder.
                    </p>
                </div>

                {/* Feature 2 */}
                <div className="group bg-zinc-900/40 p-8 rounded-3xl border border-white/5 hover:border-blue-500/50 hover:bg-zinc-900/80 transition-all duration-300">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <MessageCircle size={32} className="text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Alpha Coach</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Um mentor 24h. Peça sugestões de mensagens sedutoras, engraçadas, misteriosas ou diretas para qualquer situação.
                    </p>
                </div>

                {/* Feature 3 */}
                <div className="group bg-zinc-900/40 p-8 rounded-3xl border border-white/5 hover:border-green-500/50 hover:bg-zinc-900/80 transition-all duration-300">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                        <Zap size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Biblioteca Secreta</h3>
                    <p className="text-zinc-400 leading-relaxed">
                        Acesso imediato a centenas de abridores e roteiros validados para marcar encontros e criar tensão sexual.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 bg-black relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_50%)]"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
              <div className="flex justify-center gap-1 mb-8">
                  {[1,2,3,4,5].map(i => <Star key={i} size={32} className="text-alpha-gold fill-alpha-gold animate-pulse" style={{animationDelay: `${i*100}ms`}} />)}
              </div>
              <h3 className="text-3xl md:text-5xl font-black mb-10 leading-tight text-white">
                  "Eu não sabia o que responder e estava quase perdendo a chance. O AlphaTalk me salvou e consegui o encontro."
              </h3>
              <div className="flex items-center justify-center gap-4 bg-zinc-900/50 inline-flex px-6 py-3 rounded-2xl border border-zinc-800">
                  <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                      <UserCheck size={24} />
                  </div>
                  <div className="text-left">
                      <p className="text-white font-bold text-lg">Rafael M.</p>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Membro Alpha • Assinante Pro</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-zinc-900 to-black">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tighter">PRONTO PARA MUDAR O JOGO?</h2>
              <p className="text-zinc-400 mb-10 text-xl">Não deixe mais nenhuma mensagem sem resposta.</p>
              
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
            <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800">
                <span className="font-black text-white text-xl">A</span>
            </div>
            <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">© 2024 AlphaTalk. Todos os direitos reservados.</p>
          </div>
      </footer>
    </div>
  );
};

export default LandingPage;
