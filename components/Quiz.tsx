import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, AlertCircle, CheckCircle2, Lock, BrainCircuit, Timer } from 'lucide-react';

const questions = [
    { id: 1, category: "SINTOMAS", question: "Qual a situação mais frustrante que você enfrenta hoje?", options: ["O assunto morre rápido e fica aquele silêncio", "Elas visualizam, demoram horas ou nem respondem", "Não sei como transformar conversa em encontro", "Travo na hora de chegar ou mandar a primeira mensagem"] },
    { id: 2, category: "PADRÕES", question: "Quando você finalmente consegue um encontro, o que costuma acontecer?", options: ["Ela desmarca em cima da hora", "O encontro acontece, mas não rola nada (friendzone)", "Fico nervoso e não sei sobre o que falar", "Raramente consigo marcar, fico só no chat"] },
    { id: 3, category: "MINDSET", question: "Como você se sente quando vê ela online mas não te responde?", options: ["Ansioso, fico checando o celular toda hora", "Com raiva, penso em mandar outra mensagem cobrando", "Indiferente, mas no fundo me incomoda", "Inseguro, acho que falei algo errado"] },
    { id: 4, category: "TÁTICA", question: "Qual sua estratégia atual para puxar assunto?", options: ["Mando 'Oi, tudo bem?' ou reajo a um story", "Tento ser engraçado (mas as vezes forço a barra)", "Faço perguntas sobre o dia dela (entrevista)", "Espero ela vir falar comigo (quase nunca acontece)"] },
    { id: 5, category: "DIAGNÓSTICO", question: "Se você pudesse ler a mente dela agora, o que acha que ela pensaria de você?", options: ["'Ele é legalzinho, mas meio sem sal'", "'Ele é carente demais, me sufoca'", "'Nem lembro quem ele é direito'", "'Ele é interessante, mas não toma atitude'"] },
    { id: 6, category: "OBJETIVO", question: "O que você realmente quer alcançar nos próximos 30 dias?", options: ["Sair com mulheres mais atraentes do que hoje", "Ter confiança inabalável para abordar qualquer uma", "Recuperar o interesse de alguém específico", "Entender a psicologia feminina para nunca mais ser manipulado"] },
    { id: 7, category: "DESAFIO", question: "Você sabe identificar os 'Testes de Congruência' que as mulheres fazem?", options: ["Não faço ideia do que é isso", "Já ouvi falar, mas não sei identificar na prática", "Acho que sei, mas sempre falho neles", "Sei, mas perco a calma quando acontece"] },
    { id: 8, category: "ANÁLISE", question: "Qual a sua maior qualidade que está sendo desperdiçada?", options: ["Sou um cara fiel e parceiro", "Sou inteligente e bem-sucedido", "Sou engraçado quando estou à vontade", "Tenho muito a oferecer, mas não consigo mostrar"] },
    { id: 9, category: "RISCO", question: "Se você não mudar nada na sua abordagem hoje, como estará sua vida amorosa em 1 ano?", options: ["Exatamente igual: sozinho e frustrado", "Pior: vou acabar desistindo e aceitando qualquer coisa", "Vou ver os caras que sabem menos que eu pegando as mulheres que eu quero", "Provavelmente serei feito de trouxa novamente"] },
    { id: 10, category: "DECISÃO", question: "Você estaria disposto a seguir um método testado, mesmo que ele vá contra o que você faz hoje?", options: ["Sim, estou cansado de quebrar a cara", "Talvez, se for algo rápido e prático", "Sim, preciso de resultados urgentes", "Com certeza, quero dominar esse jogo"] }
];

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQ, setCurrentQ] = useState(0);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = () => {
      if (currentQ === 2) { setAnalyzing("Identificando padrões comportamentais..."); setTimeout(() => { setAnalyzing(null); setCurrentQ(prev => prev + 1); }, 2000); return; }
      if (currentQ === 5) { setAnalyzing("Calculando taxa de rejeição provável..."); setTimeout(() => { setAnalyzing(null); setCurrentQ(prev => prev + 1); }, 2000); return; }
      if (currentQ < questions.length - 1) { setCurrentQ(prev => prev + 1); } else { setAnalyzing("Processando diagnóstico final..."); setTimeout(() => { setAnalyzing(null); setShowResult(true); }, 3000); }
  };

  if (analyzing) return <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-in fade-in"><div className="relative mb-8"><div className="w-24 h-24 border-4 border-zinc-800 rounded-full"></div><div className="w-24 h-24 border-4 border-t-alpha-gold border-r-alpha-gold border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div><BrainCircuit className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-alpha-gold" size={32} /></div><h2 className="text-xl font-bold text-white mb-2 tracking-wider uppercase">{analyzing}</h2></div>;

  if (showResult) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 animate-in fade-in duration-700">
          <div className="bg-zinc-900/90 border border-red-500/30 p-6 md:p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>
              <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full mb-6"><AlertCircle size={14} className="text-red-500" /><span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Diagnóstico Crítico</span></div>
              <h2 className="text-3xl font-black text-white mb-2 leading-none">SEU POTENCIAL ESTÁ <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">BLOQUEADO</span></h2>
              <p className="text-zinc-400 text-sm mb-6 leading-relaxed mt-4">A análise detectou que você comete <strong>3 Erros Invisíveis</strong> que matam a atração antes mesmo dela começar.</p>
              <div className="bg-black/50 p-4 rounded-xl mb-8 text-left border border-zinc-800 space-y-3">
                  <div className="flex items-center gap-3"><Lock size={16} className="text-red-500" /><span className="text-sm text-zinc-300">Causa da Rejeição: <span className="text-white font-bold">Identificada</span></span></div>
                  <div className="flex items-center gap-3"><Lock size={16} className="text-red-500" /><span className="text-sm text-zinc-300">Nível de Atração Atual: <span className="text-red-400 font-bold">Baixo</span></span></div>
                  <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-500" /><span className="text-sm text-zinc-300">Solução: <span className="text-green-400 font-bold">Disponível no App</span></span></div>
              </div>
              <button onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black py-4 rounded-xl text-lg uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(245,158,11,0.3)]">Desbloquear Meu Perfil</button>
              <p className="mt-4 text-[10px] text-zinc-600 uppercase font-bold flex justify-center gap-2"><Timer size={12} /> Oferta expira em breve</p>
          </div>
      </div>
  );

  const q = questions[currentQ];
  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6">
      <div className="w-full max-w-md mx-auto mb-8 pt-4">
          <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] font-black text-alpha-gold uppercase tracking-[0.2em] bg-alpha-gold/10 px-2 py-1 rounded">Fase {q.id <= 4 ? '1: Sintomas' : q.id <= 8 ? '2: Padrões' : '3: Solução'}</span>
              <span className="text-xs font-bold text-zinc-500">{currentQ + 1}/{questions.length}</span>
          </div>
          <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-alpha-gold to-yellow-600 transition-all duration-500 ease-out" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}></div></div>
      </div>
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full animate-in slide-in-from-right-8 fade-in duration-500">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">{q.question}</h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-8">Seja sincero para um resultado preciso</p>
          <div className="space-y-3">
              {q.options.map((opt, idx) => (
                  <button key={idx} onClick={handleAnswer} className="w-full text-left p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-alpha-gold hover:bg-zinc-900 transition-all group flex justify-between items-center active:scale-[0.98]">
                      <span className="font-medium text-zinc-300 group-hover:text-white text-sm md:text-base pr-4">{opt}</span>
                      <ChevronRight size={12} className="text-zinc-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </button>
              ))}
          </div>
      </div>
    </div>
  );
};

export default Quiz;
