
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle2, Scan, Copy, Lock, Crown, History, Clock, ChevronLeft, Trash2, ShieldAlert, WifiOff, Target, Activity, Zap, Terminal } from 'lucide-react';
import { analyzeScreenshot } from '../services/geminiService';
import { MessageAnalysis, AnalysisHistoryItem } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface ChatAnalyzerProps {
    onAnalysisComplete: () => void;
    usageCount: number;
    isPremium: boolean;
    onUpgrade: () => void;
}

// Componente Helper para o Gauge Circular
const CircularScore = ({ score }: { score: number }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score > 60 ? '#22c55e' : score > 40 ? '#F59E0B' : '#ef4444';

    return (
        <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke="#1f1f22" // Zinc-900
                    strokeWidth="8"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    stroke={color}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{score}</span>
                <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-500">Score</span>
            </div>
        </div>
    );
};

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
            <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Target className="text-alpha-gold" />
                SCANNER <span className="text-zinc-600">v3.0</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest pl-1">
                {isPremium ? 'Sistemas Online' : `${1 - usageCount} Carga Restante`}
            </p>
        </div>
        
        <div className="flex gap-2">
            <button 
                onClick={() => setViewMode(viewMode === 'SCANNER' ? 'HISTORY' : 'SCANNER')}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                    viewMode === 'HISTORY' 
                    ? 'bg-alpha-gold text-black border-alpha-gold shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                    : 'bg-black border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'
                }`}
            >
                {viewMode === 'HISTORY' ? <Scan size={18} /> : <History size={18} />}
            </button>
        </div>
      </header>

      {viewMode === 'HISTORY' ? (
          <div className="animate-slide-up space-y-4">
              <div className="flex items-center justify-between mb-2 border-b border-zinc-800 pb-2">
                  <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Logs de Análise</h2>
                  <span className="text-xs text-zinc-600 font-mono">{history.length}/10</span>
              </div>
              
              {history.length === 0 ? (
                  <div className="text-center py-16 bg-zinc-900/20 rounded-2xl border border-dashed border-zinc-800">
                      <Terminal className="mx-auto text-zinc-700 mb-4" size={32} />
                      <p className="text-zinc-600 text-xs uppercase tracking-widest font-bold">Nenhum dado encontrado</p>
                  </div>
              ) : (
                  <div className="space-y-3">
                      {history.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => loadFromHistory(item)}
                            className="bg-black border border-zinc-800 rounded-xl p-3 flex gap-4 hover:border-alpha-gold/50 transition-all cursor-pointer group relative overflow-hidden animate-slide-up"
                          >
                              {/* Tech Decoration */}
                              <div className="absolute top-0 right-0 w-8 h-8 bg-zinc-900 rotate-45 translate-x-4 -translate-y-4 group-hover:bg-alpha-gold/20 transition-colors"></div>

                              <div className="w-16 h-16 rounded bg-zinc-900 overflow-hidden flex-shrink-0 border border-zinc-800 relative">
                                  <img src={item.imageBase64} alt="Print" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                  <div className="absolute inset-0 bg-scanline opacity-20 pointer-events-none"></div>
                              </div>
                              
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <div className="flex items-center gap-2 mb-1">
                                      <div className={`text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                          item.result.confidenceScore > 60 ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'
                                      }`}>
                                          <Activity size={10} />
                                          {item.result.confidenceScore}%
                                      </div>
                                      <span className="text-[10px] text-zinc-600 font-mono">
                                          {new Date(item.timestamp).toLocaleDateString()}
                                      </span>
                                  </div>
                                  <p className="text-zinc-400 text-xs truncate font-mono opacity-80">
                                      ID: {item.id.slice(-6)}
                                  </p>
                              </div>

                              <button 
                                onClick={(e) => deleteHistoryItem(e, item.id)}
                                className="self-center p-2 text-zinc-700 hover:text-red-500 transition-colors z-10"
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
            {/* SCANNER HUD */}
            <div className={`relative transition-all duration-500 ${result ? 'animate-slide-up' : ''}`}>
                {(result || error) && (
                    <button 
                        onClick={resetScanner}
                        className="absolute top-4 left-4 z-50 bg-black/80 backdrop-blur text-zinc-400 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:text-white border border-zinc-700 hover:border-zinc-500 transition-all"
                    >
                        <ChevronLeft size={12} />
                        Reiniciar Sistema
                    </button>
                )}

                <div 
                    onClick={(!result && !error) ? triggerInput : undefined}
                    className={`relative overflow-hidden rounded-xl h-[380px] flex flex-col items-center justify-center transition-all border ${
                        isLocked && !result && !error
                        ? 'border-zinc-800 bg-zinc-950 opacity-50 cursor-not-allowed'
                        : image 
                            ? error ? 'border-red-500/50 bg-red-950/10' : 'border-alpha-gold/50 bg-black cursor-default' 
                            : 'border-dashed border-zinc-800 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-alpha-gold/30 cursor-pointer group'
                    }`}
                >
                    {/* HUD CORNERS */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-zinc-700 pointer-events-none transition-colors group-hover:border-alpha-gold/50"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-zinc-700 pointer-events-none transition-colors group-hover:border-alpha-gold/50"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-zinc-700 pointer-events-none transition-colors group-hover:border-alpha-gold/50"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-zinc-700 pointer-events-none transition-colors group-hover:border-alpha-gold/50"></div>
                    
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
                             <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30 animate-pulse">
                                <WifiOff className="text-red-500" size={32} />
                            </div>
                            <h3 className="text-red-500 font-bold text-sm uppercase tracking-widest mb-2">Falha no Sistema</h3>
                            <p className="text-zinc-400 text-xs font-mono border border-red-900/50 bg-black/50 p-3 rounded">
                                ERROR_CODE: {error}
                            </p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); resetScanner(); }}
                                className="mt-6 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-widest underline"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    ) : isLocked && !result ? (
                        <div className="text-center p-6 relative z-10 flex flex-col items-center">
                            <div className="bg-black w-24 h-24 rounded-full flex items-center justify-center mb-6 border border-zinc-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <Lock className="text-zinc-600" size={32} />
                            </div>
                            <p className="font-black text-white text-lg uppercase tracking-tight">Acesso Negado</p>
                            <p className="text-xs text-zinc-500 mt-2 font-mono uppercase">
                                Cota diária excedida
                            </p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onUpgrade(); }}
                                className="mt-6 bg-alpha-gold text-black font-black text-xs px-6 py-3 rounded flex items-center gap-2 hover:bg-white transition-colors uppercase tracking-widest"
                            >
                                <Crown size={14} />
                                Liberar Acesso Pro
                            </button>
                        </div>
                    ) : image ? (
                        <>
                            <img src={image} alt="Preview" className={`h-full w-full object-contain relative z-10 ${error ? 'opacity-20 grayscale' : 'opacity-80'}`} />
                            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[11] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
                            {!result && !error && (
                                <div className="absolute inset-0 z-20 pointer-events-none">
                                    <div className="absolute inset-0 bg-alpha-gold/10 h-[2px] w-full animate-scan shadow-[0_0_20px_#F59E0B]"></div>
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-alpha-gold font-mono border border-alpha-gold/30">
                                        IMAGE_LOADED
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center p-6 relative z-10">
                            <div className="w-20 h-20 rounded-full border border-zinc-800 flex items-center justify-center mx-auto mb-6 bg-black group-hover:border-alpha-gold/50 transition-colors shadow-lg">
                                <Scan className="text-zinc-600 group-hover:text-alpha-gold transition-colors" size={32} strokeWidth={1.5} />
                            </div>
                            <p className="font-bold text-white text-sm uppercase tracking-widest group-hover:text-alpha-gold transition-colors">Carregar Imagem</p>
                            <p className="text-[10px] text-zinc-600 mt-2 font-mono">
                                [FORMATOS: JPG, PNG]
                            </p>
                        </div>
                    )}
                </div>

                {image && !result && !error && !isLocked && (
                    <div className="absolute bottom-6 left-0 right-0 z-40 px-6">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAnalyze(); }}
                            disabled={loading}
                            className={`w-full py-4 rounded font-black text-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(245,158,11,0.2)] flex items-center justify-center gap-3 transition-all clip-path-polygon ${
                                loading ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-wait' : 'bg-alpha-gold hover:bg-white'
                            }`}
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            {loading ? (
                                <>
                                    <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
                                    PROCESSANDO...
                                </>
                            ) : (
                                <>
                                    <Terminal size={16} />
                                    INICIAR ANÁLISE
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* RESULTS DASHBOARD */}
            {result && (
                <div key={Date.now()} className="space-y-4 pb-8">
                    {/* TOP ROW: SCORE & STATUS */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black border border-zinc-800 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-transparent opacity-50"></div>
                            <CircularScore score={result.confidenceScore} />
                        </div>
                        
                        <div className="bg-black border border-zinc-800 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden">
                             <div className={`absolute top-0 left-0 w-1 h-full ${result.confidenceScore > 60 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Diagnóstico</p>
                             <h3 className={`text-lg font-black uppercase italic ${
                                 result.confidenceScore > 60 ? 'text-green-500' : 'text-red-500'
                             }`}>
                                 {result.confidenceScore > 60 ? 'FAVORÁVEL' : 'RISCO ALTO'}
                             </h3>
                             <p className="text-[10px] text-zinc-400 mt-1 leading-tight">
                                 {result.confidenceScore > 60 ? 'Sinais de interesse detectados.' : 'Necessário cautela tática.'}
                             </p>
                        </div>
                    </div>

                    {/* DECODED SUBTEXT */}
                    <div className="bg-black border border-zinc-800 rounded-xl p-0 overflow-hidden relative group">
                        <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-alpha-gold" />
                            <span className="text-[10px] font-bold text-alpha-gold uppercase tracking-widest">Decodificação de Subtexto</span>
                        </div>
                        <div className="p-5 relative">
                             {/* Matrix rain effect subtle */}
                             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                             
                             <p className="font-mono text-sm text-zinc-300 leading-relaxed relative z-10">
                                 <span className="text-alpha-gold/50 mr-2">{'>'}</span>
                                 "{result.subtext}"
                             </p>

                             <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                 <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Análise Tática:</p>
                                 <p className="text-xs text-zinc-400 font-mono">{result.feedback}</p>
                             </div>
                        </div>
                    </div>

                    {/* TACTICAL RESPONSES */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-1 px-1">
                            <Zap size={14} className="text-alpha-gold" />
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Protocolos de Resposta</h3>
                        </div>
                        
                        {result.suggestedReplies.map((reply, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => navigator.clipboard.writeText(reply)}
                                className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl relative group active:scale-[0.99] transition-all cursor-pointer hover:bg-zinc-900 hover:border-zinc-600"
                            >
                                <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-zinc-700 p-1.5 rounded text-alpha-gold">
                                    <Copy size={14} />
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-[10px] font-mono text-zinc-600 mt-1">0{idx + 1}</span>
                                    <p className="text-white text-sm font-medium pr-6">{reply}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <button 
                        onClick={resetScanner}
                        className="w-full py-4 text-zinc-600 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors border border-transparent hover:border-zinc-800 rounded-xl"
                    >
                        Nova Varredura
                    </button>
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default ChatAnalyzer;
