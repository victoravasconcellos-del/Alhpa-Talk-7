import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ScanLine, Zap, ShieldCheck, ChevronRight, Star, UserCheck } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15),transparent_70%)] pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-zinc-900/80 border border-alpha-gold/30 rounded-full px-4 py-1.5 mb-8"><Star size={14} className="text-alpha-gold fill-alpha-gold" /><span className="text-xs font-bold uppercase tracking-widest text-zinc-300">A IA Secreta dos Homens de Sucesso</span></div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">DOMINE A ARTE DA <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-alpha-gold to-yellow-600">CONQUISTA</span></h1>
            <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Pare de ser ignorado. O <strong>AlphaTalk</strong> usa Inteligência Artificial para decodificar mensagens, criar respostas infalíveis e garantir que você nunca mais fique no vácuo.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button onClick={() => navigate('/quiz')} className="w-full sm:w-auto bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black text-lg px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2">FAZER O TESTE GRÁTIS <ChevronRight size={24} /></button>
                <button onClick={() => navigate('/login')} className="text-zinc-500 font-bold hover:text-white transition-colors text-sm uppercase tracking-widest">Já tenho conta</button>
            </div>
        </div>
      </div>
      <footer className="bg-black py-8 border-t border-zinc-900 text-center"><p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">© 2024 AlphaTalk.</p></footer>
    </div>
  );
};

export default LandingPage;
