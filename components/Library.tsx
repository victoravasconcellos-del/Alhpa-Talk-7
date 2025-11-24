import React, { useState } from 'react';
import { ChevronRight, Copy, ChevronDown, Search, CheckCircle, Lock, Crown } from 'lucide-react';
import { categories } from '../data/phraseData';

interface LibraryProps {
    isPremium: boolean;
    onUpgrade: () => void;
}

const Library: React.FC<LibraryProps> = ({ isPremium, onUpgrade }) => {
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<{catId: number, lineIdx: number} | null>(null);
  const [searchTerms, setSearchTerms] = useState<{[key: number]: string}>({});

  const toggleCategory = (id: number) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  const handleCopy = (text: string, catId: number, lineIdx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex({ catId, lineIdx });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSearch = (catId: number, term: string) => {
    setSearchTerms(prev => ({ ...prev, [catId]: term }));
  };

  return (
    <div className="space-y-6 pb-24 pt-4 animate-slide-up">
      <header>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Banco de <span className="text-alpha-gold">Frases</span></h1>
        <p className="text-zinc-400 text-sm">Centenas de roteiros testados para usar agora.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat: any) => {
            const searchTerm = searchTerms[cat.id] || '';
            const allLines = cat.lines;
            const filteredLines = allLines.filter((line: string) => 
                line.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            const visibleLines = isPremium ? filteredLines : filteredLines.slice(0, 10);
            const hiddenCount = filteredLines.length - visibleLines.length;

            return (
              <div 
                key={cat.id} 
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    openCategory === cat.id 
                    ? 'bg-zinc-900 border-alpha-gold/30 shadow-[0_0_15px_rgba(0,0,0,0.5)]' 
                    : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900'
                }`}
              >
                <div 
                    onClick={() => toggleCategory(cat.id)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center ${cat.color} shadow-lg`}>
                            <cat.icon size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-base">{cat.title}</h4>
                            <p className="text-zinc-500 text-[10px] mt-1 uppercase tracking-wider font-bold flex gap-2">
                                {isPremium ? cat.lines.length : 10} Frases Disp. <span className="text-zinc-700">•</span> {cat.description}
                            </p>
                        </div>
                    </div>
                    {openCategory === cat.id ? (
                        <ChevronDown className="text-alpha-gold" size={20} />
                    ) : (
                        <ChevronRight className="text-zinc-600" size={20} />
                    )}
                </div>

                <div className={`bg-black/50 border-t border-zinc-800 transition-all duration-300 ${openCategory === cat.id ? 'max-h-[60vh] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="p-4 flex flex-col h-full max-h-[60vh]">
                        <div className="relative mb-4">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder={`Buscar em ${cat.title}...`}
                                value={searchTerm}
                                onChange={(e) => handleSearch(cat.id, e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-alpha-gold/50 outline-none placeholder:text-zinc-600"
                            />
                        </div>

                        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar pb-4 flex-1">
                            {visibleLines.length > 0 ? (
                                visibleLines.map((line: string, idx: number) => {
                                    const isCopied = copiedIndex?.catId === cat.id && copiedIndex?.lineIdx === idx;
                                    return (
                                        <div 
                                            key={idx} 
                                            className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl relative group active:scale-[0.98] transition-all hover:border-zinc-700 cursor-pointer"
                                            onClick={() => handleCopy(line, cat.id, idx)}
                                        >
                                            <p className="text-zinc-300 text-sm pr-8 italic leading-relaxed">"{line}"</p>
                                            <button 
                                                className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-colors ${isCopied ? 'text-green-500' : 'text-zinc-600 hover:text-alpha-gold'}`}
                                            >
                                                {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                                            </button>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="text-center py-8 text-zinc-600 text-sm">
                                    Nenhuma frase encontrada.
                                </div>
                            )}

                            {!isPremium && hiddenCount > 0 && (
                                <div className="mt-4 p-4 bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl text-center">
                                    <div className="bg-zinc-800 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Lock size={16} className="text-zinc-500" />
                                    </div>
                                    <p className="text-zinc-400 text-sm font-bold mb-1">
                                        +{hiddenCount} Frases Bloqueadas
                                    </p>
                                    <button 
                                        onClick={onUpgrade}
                                        className="text-alpha-gold text-xs uppercase font-bold hover:underline flex items-center justify-center gap-1 mx-auto mt-2"
                                    >
                                        <Crown size={12} />
                                        Liberar Acesso Total
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              </div>
            );
        })}
      </div>
      
      <div className="mt-8 text-center p-6 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
        <p className="text-zinc-500 text-xs mb-2 uppercase tracking-widest font-bold">Dica Alpha</p>
        <p className="text-zinc-300 text-sm italic">
          "A frase é apenas 10% da comunicação. Os outros 90% são o tom de voz e o contato visual. Use com confiança."
        </p>
      </div>
    </div>
  );
};

export default Library;
