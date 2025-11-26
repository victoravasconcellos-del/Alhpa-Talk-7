
import React, { useState } from 'react';
import { Send, RefreshCw, Bot, Copy, Lock, Crown, Flame, Laugh, Glasses, Zap, Search } from 'lucide-react';
import { getCoachingAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface MessageCoachProps {
  onUsage: () => void;
  usageCount: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

const MODES = [
    { id: 'flirty', label: 'Sedutor', icon: Flame, color: 'text-red-400' },
    { id: 'funny', label: 'Engraçado', icon: Laugh, color: 'text-yellow-400' },
    { id: 'mysterious', label: 'Misterioso', icon: Search, color: 'text-purple-400' },
    { id: 'direct', label: 'Direto', icon: Zap, color: 'text-blue-400' },
    { id: 'intellectual', label: 'Intelectual', icon: Glasses, color: 'text-emerald-400' },
];

const MessageCoach: React.FC<MessageCoachProps> = ({ onUsage, usageCount, isPremium, onUpgrade }) => {
  const [inputText, setInputText] = useState('');
  const [goal, setGoal] = useState<'flirty' | 'direct' | 'funny' | 'mysterious' | 'intellectual'>('flirty');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const isLocked = !isPremium && usageCount >= 1;

  const handleSubmit = async () => {
    if (!inputText.trim() || isLocked) return;
    setLoading(true);
    setResponse('');
    
    const result = await getCoachingAdvice({
      text: inputText,
      goal: goal,
    });
    
    setResponse(result);
    setLoading(false);
    onUsage();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] animate-slide-up pt-2 relative">
      {/* Premium Lock Overlay for Coach */}
      {isLocked && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center shadow-2xl max-w-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-alpha-gold to-transparent opacity-50"></div>
                    <div className="bg-black w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <Lock className="text-zinc-600" size={32} />
                    </div>
                    <h2 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Sistema Bloqueado</h2>
                    <p className="text-zinc-500 text-xs font-mono mb-8 leading-relaxed px-4">
                        Cota de processamento diária atingida. Requer autorização de nível superior.
                    </p>
                    <button 
                        onClick={onUpgrade}
                        className="w-full bg-alpha-gold text-black font-black py-4 rounded-xl hover:bg-white transition-colors uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                    >
                        <Crown size={16} />
                        Liberar Acesso Pro
                    </button>
              </div>
          </div>
      )}

      <header className="mb-4 flex items-center justify-between px-2">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                COACH <span className="text-zinc-700">AI</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest pl-1">
                {isPremium ? 'Módulo Ilimitado' : `${1 - usageCount} Créditos`}
            </p>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 px-3 py-1 rounded flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#22c55e]"></div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">System Ready</span>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 bg-zinc-950 rounded-t-3xl border-x border-t border-zinc-900 overflow-hidden flex flex-col relative shadow-inner">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[0] bg-[length:100%_2px,3px_100%] opacity-20 pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-8 relative z-10 custom-scrollbar pb-32">
            {!response && !inputText && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-800 opacity-60">
                    <Bot size={48} strokeWidth={1} className="mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest">Aguardando Dados</p>
                </div>
            )}

            {/* User Bubble (Tactical) */}
            {inputText && loading && (
                 <div className="flex justify-end animate-slide-up">
                    <div className="relative max-w-[85%]">
                        <div className="bg-gradient-to-r from-alpha-gold to-yellow-600 text-black px-5 py-4 rounded-2xl rounded-tr-none shadow-lg border border-yellow-500/20">
                            <p className="font-bold text-sm leading-relaxed">{inputText}</p>
                        </div>
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest absolute -bottom-4 right-0">Alpha User</span>
                    </div>
                 </div>
            )}

            {/* Loading Indicator */}
            {loading && (
                <div className="flex justify-start">
                     <div className="bg-black rounded-xl p-3 border border-zinc-800 flex gap-2 items-center w-fit shadow-lg">
                         <span className="text-[10px] text-zinc-500 font-mono mr-2">ANALYZING...</span>
                         <span className="w-1 h-1 bg-alpha-gold rounded-full animate-pulse"></span>
                         <span className="w-1 h-1 bg-alpha-gold rounded-full animate-pulse delay-75"></span>
                         <span className="w-1 h-1 bg-alpha-gold rounded-full animate-pulse delay-150"></span>
                     </div>
                </div>
            )}

            {/* AI Bubble (Terminal Style) */}
            {response && (
                <div className="flex justify-start animate-slide-up pb-4">
                    <div className="flex flex-col gap-1 max-w-[95%] w-full">
                        <div className="flex items-center gap-2 pl-1">
                             <Bot size={12} className="text-alpha-gold" />
                             <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">System Response</span>
                        </div>
                        
                        <div className="bg-black border border-zinc-800 p-5 rounded-2xl rounded-tl-none text-sm text-zinc-300 shadow-xl relative group">
                            {/* Decorative terminal header */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 opacity-50"></div>
                            
                            <ReactMarkdown 
                                components={{
                                    strong: ({node, ...props}) => <span className="text-alpha-gold font-bold font-mono text-xs uppercase tracking-wider bg-alpha-gold/10 px-1 rounded" {...props} />,
                                    ul: ({node, ...props}) => <ul className="space-y-3 my-3" {...props} />,
                                    li: ({node, ...props}) => <li className="flex gap-3 text-zinc-400" {...props}><span className="text-zinc-600 mt-1.5 select-none text-[8px]">&gt;</span><span className="leading-relaxed">{props.children}</span></li>,
                                    p: ({node, ...props}) => <p className="mb-3 last:mb-0 leading-relaxed" {...props} />
                                }}
                            >
                                {response}
                            </ReactMarkdown>
                            
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button 
                                    onClick={() => navigator.clipboard.writeText(response)}
                                    className="p-1.5 text-zinc-600 hover:text-alpha-gold transition-colors bg-zinc-900 border border-zinc-800 rounded opacity-0 group-hover:opacity-100"
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Tactical Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-black/95 backdrop-blur-md border-t border-zinc-800 p-3 pb-safe z-50 shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
             
             {/* Pills Selector */}
             <div className="flex gap-2 mb-3 overflow-x-auto custom-scrollbar pb-2 px-1">
                 {MODES.map((mode) => {
                     const isActive = goal === mode.id;
                     return (
                         <button
                            key={mode.id}
                            onClick={() => setGoal(mode.id as any)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                                isActive 
                                ? 'bg-alpha-gold text-black border-alpha-gold shadow-[0_0_10px_rgba(245,158,11,0.4)]' 
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                            }`}
                         >
                             <mode.icon size={12} className={isActive ? 'text-black' : mode.color} />
                             {mode.label}
                         </button>
                     )
                 })}
             </div>
             
             <div className="relative flex items-end gap-2">
                <div className="relative flex-1">
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Insira os dados da missão..."
                        disabled={isLocked}
                        className="w-full bg-zinc-900 text-white pl-4 pr-4 py-4 rounded-xl text-sm border border-zinc-800 focus:border-alpha-gold/50 focus:outline-none resize-none h-[60px] custom-scrollbar disabled:opacity-50 font-medium placeholder:text-zinc-600"
                    />
                </div>
                
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !inputText || isLocked}
                    className="bg-alpha-gold text-black h-[60px] w-[60px] rounded-xl flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 disabled:grayscale shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-95 group"
                >
                    {loading ? (
                        <RefreshCw size={20} className="animate-spin" /> 
                    ) : (
                        <Send size={24} className="ml-0.5 group-hover:rotate-45 transition-transform duration-300" strokeWidth={2.5} />
                    )}
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCoach;
