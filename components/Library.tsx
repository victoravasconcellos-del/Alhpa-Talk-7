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
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Banco de Frases</h1>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat: any) => {
            const searchTerm = searchTerms[cat.id] || '';
            const filteredLines = cat.lines.filter((line: string) => 
                line.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const visibleLines = isPremium ? filteredLines : filteredLines.slice(0, 5);

            return (
              <div key={cat.id} className="rounded-2xl border bg-zinc-900/50 border-zinc-800">
                <div onClick={() => toggleCategory(cat.id)} className="p-5 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center ${cat.color}`}>
                            <cat.icon size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-base">{cat.title}</h4>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold">{cat.lines.length} Frases</p>
                        </div>
                    </div>
                    {openCategory === cat.id ? <ChevronDown size={20} className="text-alpha-gold"/> : <ChevronRight size={20} className="text-zinc-600"/>}
                </div>

                {openCategory === cat.id && (
                    <div className="p-4 border-t border-zinc-800 bg-black/50">
                        <div className="relative mb-4">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                            <input 
                                type="text" 
                                placeholder="Buscar..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(cat.id, e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:border-alpha-gold/50 outline-none"
                            />
                        </div>
                        <div className="space-y-3">
                            {visibleLines.map((line: string, idx: number) => (
                                <div key={idx} onClick={() => handleCopy(line, cat.id, idx)} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl cursor-pointer hover:border-zinc-700 flex justify-between">
                                    <p className="text-zinc-300 text-sm italic">"{line}"</p>
                                    {copiedIndex?.catId === cat.id && copiedIndex?.lineIdx === idx ? <CheckCircle size={16} className="text-green-500"/> : <Copy size={16} className="text-zinc-600"/>}
                                </div>
                            ))}
                            {!isPremium && filteredLines.length > 5 && (
                                <button onClick={onUpgrade} className="w-full py-3 text-alpha-gold text-xs font-bold uppercase border border-dashed border-zinc-800 rounded-xl hover:bg-zinc-900">
                                    <Lock size={12} className="inline mr-1 mb-0.5"/> Desbloquear Tudo
                                </button>
                            )}
                        </div>
                    </div>
                )}
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default Library;
