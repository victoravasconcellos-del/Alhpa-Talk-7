import React, { useState } from 'react';
import { Send, RefreshCw, Bot, Copy, Lock, Crown } from 'lucide-react';
import { getCoachingAdvice } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface MessageCoachProps {
  onUsage: () => void;
  usageCount: number;
  isPremium: boolean;
  onUpgrade: () => void;
}

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
      {isLocked && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center shadow-2xl max-w-sm">
                    <div className="bg-gradient-to-br from-alpha-gold to-yellow-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                        <Lock className="text-black" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Limite Diário Atingido</h2>
                    <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                        Sua cota diária gratuita do Coach expirou. Torne-se Premium para ter conversas ilimitadas.
                    </p>
                    <button 
                        onClick={onUpgrade}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                    >
                        <Crown size={16} />
                        Ser Alpha Pro
                    </button>
              </div>
          </div>
      )}

      <header className="mb-4 flex items-center justify-between px-2">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Alpha Coach</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                {isPremium ? 'Acesso Ilimitado' : `${1 - usageCount} Restante Hoje`}
            </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Online</span>
        </div>
      </header>

      <div className="flex-1 bg-black rounded-3xl border border-zinc-900 overflow-hidden flex flex-col relative shadow-inner">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-10 custom-scrollbar">
            {!response && !inputText && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-zinc-700 opacity-60">
                    <Bot size={64} strokeWidth={1} className="mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Aguardando Mensagem</p>
                </div>
            )}

            {inputText && loading && (
                 <div className="flex justify-end animate-slide-up">
                    <div className="bg-zinc-800 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-md border border-zinc-700">
                        {inputText}
                    </div>
                 </div>
            )}

            {loading && (
                <div className="flex justify-start">
                     <div className="bg-zinc-900 rounded-2xl rounded-tl-sm p-4 border border-zinc-800 flex gap-2 items-center w-fit">
                         <span className="w-1.5 h-1.5 bg-alpha-gold rounded-full animate-bounce"></span>
                         <span className="w-1.5 h-1.5 bg-alpha-gold rounded-full animate-bounce delay-100"></span>
                         <span className="w-1.5 h-1.5 bg-alpha-gold rounded-full animate-bounce delay-200"></span>
                     </div>
                </div>
            )}

            {response && (
                <div className="flex justify-start animate-slide-up pb-4">
                    <div className="flex flex-col gap-2 max-w-[95%]">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-alpha-gold flex items-center justify-center">
                                <Bot size={14} className="text-black" />
                             </div>
                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">AlphaBot</span>
                        </div>
                        
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-alpha-gold/20 p-5 rounded-2xl rounded-tl-sm text-sm text-zinc-300 shadow-xl relative group">
                            <ReactMarkdown 
                                components={{
                                    strong: ({node, ...props}) => <span className="text-alpha-gold font-bold" {...props} />,
                                    ul: ({node, ...props}) => <ul className="space-y-2 my-2" {...props} />,
                                    li: ({node, ...props}) => <li className="flex gap-2" {...props}><span className="text-alpha-gold select-none">•</span><span>{props.children}</span></li>,
                                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />
                                }}
                            >
                                {response}
                            </ReactMarkdown>
                            
                            <button 
                                onClick={() => navigator.clipboard.writeText(response)}
                                className="absolute top-2 right-2 p-2 text-zinc-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Copy size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <div className="bg-zinc-900/90 backdrop-blur border-t border-zinc-800 p-3">
             <div className="flex items-center gap-2 mb-2 px-1">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Modo:</span>
                <select 
                    value={goal} 
                    onChange={(e) => setGoal(e.target.value as any)}
                    className="bg-black text-alpha-gold text-xs font-bold py-1 px-2 rounded border border-zinc-800 outline-none cursor-pointer hover:border-alpha-gold/50 transition-colors"
                >
                    <option value="flirty">Sedutor</option>
                    <option value="funny">Engraçado</option>
                    <option value="mysterious">Misterioso</option>
                    <option value="direct">Direto</option>
                    <option value="intellectual">Intelectual</option>
                </select>
             </div>
             
             <div className="relative flex items-end gap-2">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Cole a mensagem ou digite aqui..."
                    disabled={isLocked}
                    className="w-full bg-black text-white p-4 rounded-xl text-sm border border-zinc-800 focus:border-alpha-gold/50 focus:outline-none resize-none h-[60px] custom-scrollbar disabled:opacity-50"
                />
                
                <button 
                    onClick={handleSubmit}
                    disabled={loading || !inputText || isLocked}
                    className="bg-alpha-gold text-black h-[60px] w-[60px] rounded-xl flex items-center justify-center hover:bg-white transition-all disabled:opacity-50 disabled:grayscale shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                >
                    {loading ? <RefreshCw size={20} className="animate-spin" /> : <Send size={24} className="ml-0.5" />}
                </button>
             </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCoach;
