import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle2, Scan, Copy, Lock, Crown, History, Clock, ChevronLeft, Trash2, ShieldAlert, WifiOff } from 'lucide-react';
import { analyzeScreenshot } from '../services/geminiService';
import { MessageAnalysis, AnalysisHistoryItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ChatAnalyzerProps {
    onAnalysisComplete: () => void;
    usageCount: number;
    isPremium: boolean;
    onUpgrade: () => void;
}

const ChatAnalyzer: React.FC<ChatAnalyzerProps> = ({ onAnalysisComplete, usageCount, isPremium, onUpgrade }) => {
  const [viewMode, setViewMode] = useState<'SCANNER' | 'HISTORY'>('SCANNER');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysis | null>(null);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  
  const isLocked = !isPremium && usageCount >= 1;

  useEffect(() => {
      if (user) {
          const stored = localStorage.getItem(`alpha_analysis_history_${user.id}`);
          if (stored) {
              try {
                  setHistory(JSON.parse(stored));
              } catch (e) {
                  console.error("Error loading history");
              }
          }
      }
  }, [user]);

  const saveToHistory = (img: string, analysis: MessageAnalysis) => {
      if (!user) return;
      
      const newItem: AnalysisHistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          imageBase64: img,
          result: analysis
      };

      const newHistory = [newItem, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem(`alpha_analysis_history_${user.id}`, JSON.stringify(newHistory));
  };

  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      if (!user) return;
      const newHistory = history.filter(item => item.id !== id);
      setHistory(newHistory);
      localStorage.setItem(`alpha_analysis_history_${user.id}`, JSON.stringify(newHistory));
  };

  const loadFromHistory = (item: AnalysisHistoryItem) => {
      setImage(item.imageBase64);
      setResult(item.result);
      setViewMode('SCANNER');
      setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeScreenshot(base64Data);
      
      setResult(analysis);
      saveToHistory(image, analysis);
      onAnalysisComplete();
    } catch (error: any) {
      setError(error.message || "Ocorreu um erro desconhecido.");
    } finally {
      setLoading(false);
    }
  };

  const triggerInput = () => {
      if (isLocked) return;
      fileInputRef.current?.click();
  };

  const resetScanner = () => {
      setImage(null);
      setResult(null);
      setError(null);
  };

  return (
    <div className="space-y-6 pb-24 pt-4 animate-slide-up relative">
      <header className="flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Scanner IA</h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                {isPremium ? 'Ilimitado' : `${1 - usageCount} Restante Hoje`}
            </p>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => setViewMode(viewMode === 'SCANNER' ? 'HISTORY' : 'SCANNER')}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    viewMode === 'HISTORY' 
                    ? 'bg-alpha-gold text-black border-alpha-gold' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
            >
                {viewMode === 'HISTORY' ? <Scan size={20} /> : <History size={20} />}
            </button>
        </div>
      </header>

      {viewMode === 'HISTORY' ? (
          <div className="animate-slide-up space-y-4">
              <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold text-white">Histórico Recente</h2>
                  <span className="text-xs text-zinc-500">{history.length} análises salvas</span>
              </div>
              
              {history.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
                      <History className="mx-auto text-zinc-600 mb-4" size={32} />
                      <p className="text-zinc-500 text-sm">Nenhuma análise salva ainda.</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                      {history.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex gap-4 hover:border-alpha-gold/30 transition-all cursor-pointer group relative overflow-hidden animate-slide-up"
                          >
                              <div className="w-16 h-16 rounded-lg bg-black overflow-hidden flex-shrink-0 border border-zinc-800">
                                  <img src={item.imageBase64} alt="Print" className="w-full h-full object-cover opacity-80" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-start">
                                      <div className="flex items-center gap-2 mb-1">
                                          <div className={`text-xs font-black px-1.5 py-0.5 rounded ${
                                              item.result.confidenceScore > 60 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                          }`}>
                                              {item.result.confidenceScore} pts
                                          </div>
                                          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                              <Clock size={10} />
                                              {new Date(item.timestamp).toLocaleDateString()}
                                          </span>
                                      </div>
                                  </div>
                                  <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                                      {item.result.subtext}
                                  </p>
                              </div>

                              <button 
                                onClick={(e) => deleteHistoryItem(e, item.id)}
                                className="absolute right-3 bottom-3 p-2 text-zinc-700 hover:text-red-500 transition-colors z-10"
                              >
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      ) : (
        <>
            <div className={`relative transition-all duration-500 ${result ? 'animate-slide-up' : ''}`}>
                {(result || error) && (
                    <button 
                        onClick={resetScanner}
                        className="absolute top-4 left-4 z-50 bg-black/50 backdrop-blur text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-black/80 transition-colors border border-white/10"
                    >
                        <ChevronLeft size={14} />
                        Voltar
                    </button>
                )}

                <div 
                    onClick={(!result && !error) ? triggerInput : undefined}
                    className={`relative overflow-hidden rounded-2xl h-[360px] flex flex-col items-center justify-center transition-all border-2 ${
                        isLocked && !result && !error
                        ? 'border-zinc-800 bg-zinc-900 opacity-50 cursor-not-allowed'
                        : image 
                            ? error ? 'border-red-500/50 bg-red-950/20' : 'border-alpha-gold bg-black cursor-default' 
                            : 'border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-zinc-700 cursor-pointer'
                    }`}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                        disabled={isLocked}
                    />
                    
                    {error ? (
                        <div className="text-center p-8 relative z-10 max-w-xs animate-in zoom-in-95 duration-300">
                             <div className="bg-red-500/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                                {error.includes("segurança") ? (
                                    <ShieldAlert className="text-red-500" size={40} />
                                ) : (
                                    <WifiOff className="text-red-500" size={40} />
                                )}
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Ops! Algo deu errado.</h3>
                            <p className="text-red-400 text-sm leading-relaxed border border-red-500/20 bg-red-500/10 p-3 rounded-xl">
                                {error}
                            </p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); resetScanner(); }}
                                className="mt-6 text-zinc-400 hover:text-white text-xs font-bold underline"
                            >
                                Tentar outra imagem
                            </button>
                        </div>
                    ) : isLocked && !result ? (
                        <div className="text-center p-6 relative z-10 flex flex-col items-center">
                            <div className="bg-zinc-800 w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-zinc-700">
                                <Lock className="text-zinc-500" size={36} />
                            </div>
                            <p className="font-bold text-white text-lg">Limite Diário Atingido</p>
                            <p className="text-xs text-zinc-500 mt-2 max-w-[200px] leading-relaxed">
                                Usuários gratuitos podem fazer 1 análise por dia.
                            </p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onUpgrade(); }}
                                className="mt-6 bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform"
                            >
                                <Crown size={16} />
                                Desbloquear Ilimitado
                            </button>
                        </div>
                    ) : image ? (
                        <>
                            <img src={image} alt="Preview" className={`h-full w-full object-contain relative z-10 ${error ? 'opacity-20 grayscale' : 'opacity-70'}`} />
                            {!result && !error && (
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-alpha-gold/20 to-transparent h-[20%] w-full animate-scan border-b-2 border-alpha-gold shadow-[0_0_20px_#F59E0B]"></div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-6 relative z-10 group">
                            <div className="bg-zinc-900 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800 shadow-xl group-hover:scale-105 transition-transform group-hover:border-alpha-gold/50">
                                <Upload className="text-zinc-500 group-hover:text-alpha-gold transition-colors" size={36} />
                            </div>
                            <p className="font-bold text-white text-lg">Carregar Print</p>
                            <p className="text-xs text-zinc-500 mt-2 max-w-[200px] mx-auto leading-relaxed">
                                Tire um print da conversa no WhatsApp, Instagram ou Tinder.
                            </p>
                        </div>
                    )}

                    {!isLocked && !image && (
                        <>
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-zinc-700 rounded-tl-lg pointer-events-none"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-zinc-700 rounded-tr-lg pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-zinc-700 rounded-bl-lg pointer-events-none"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-zinc-700 rounded-br-lg pointer-events-none"></div>
                        </>
                    )}
                </div>

                {image && !result && !error && !isLocked && (
                    <div className="absolute bottom-8 left-0 right-0 z-40 px-8">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-black text-sm uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 transition-all ${
                                loading ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-wait' : 'bg-alpha-gold hover:bg-white hover:scale-[1.02]'
                            }`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-500 border-t-transparent"></div>
                                    Decodificando...
                                </>
                            ) : (
                                <>
                                    <Scan size={18} />
                                    Analisar
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Analysis Results with Staggered Animation */}
            {result && (
                <div key={Date.now()} className="space-y-4">
                    <div 
                        className="glass-card p-6 rounded-2xl flex items-center justify-between border-l-4 border-l-alpha-gold animate-slide-up"
                        style={{ animationFillMode: 'both', animationDuration: '0.6s' }}
                    >
                        <div>
                            <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">Potencial da Interação</p>
                            <div className="flex items-baseline gap-1">
                                <h2 className="text-4xl font-black text-white">{result.confidenceScore}</h2>
                                <span className="text-sm font-bold text-zinc-600">/100</span>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider ${
                            result.confidenceScore > 60 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}>
                            {result.confidenceScore > 60 ? 'Favorável' : 'Risco Alto'}
                        </div>
                    </div>

                    <div 
                        className="glass-card p-6 rounded-2xl animate-slide-up"
                        style={{ animationDelay: '150ms', animationFillMode: 'both', animationDuration: '0.6s' }}
                    >
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                            <AlertTriangle size={16} className="text-alpha-gold" />
                            O que ela quis dizer
                        </h3>
                        <p className="text-zinc-300 text-sm leading-relaxed border-l-2 border-zinc-700 pl-4 italic">
                            "{result.subtext}"
                        </p>
                        <div className="mt-5 pt-5 border-t border-white/5">
                            <p className="text-[10px] text-alpha-gold uppercase tracking-widest font-bold mb-2">Alpha Feedback</p>
                            <p className="text-zinc-400 text-sm">{result.feedback}</p>
                        </div>
                    </div>

                    <div 
                        className="animate-slide-up"
                        style={{ animationDelay: '300ms', animationFillMode: 'both', animationDuration: '0.6s' }}
                    >
                        <h3 className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-3 ml-1">Respostas Táticas</h3>
                        <div className="space-y-3">
                            {result.suggestedReplies.map((reply, idx) => (
                                <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-start gap-3 hover:border-zinc-600 transition-colors group cursor-pointer" onClick={() => navigator.clipboard.writeText(reply)}>
                                    <div className="mt-1 bg-zinc-800 p-1 rounded text-zinc-500 group-hover:text-alpha-gold transition-colors">
                                        <Copy size={14} />
                                    </div>
                                    <p className="text-white text-sm leading-relaxed">{reply}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        onClick={resetScanner}
                        className="w-full py-4 text-zinc-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors animate-slide-up"
                        style={{ animationDelay: '450ms', animationFillMode: 'both', animationDuration: '0.6s' }}
                    >
                        Nova Análise
                    </button>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default ChatAnalyzer;
