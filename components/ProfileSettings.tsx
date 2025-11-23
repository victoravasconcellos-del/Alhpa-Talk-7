import React, { useState } from 'react';
import { UserStats } from '../types';
import { Save, ChevronLeft, Camera, User } from 'lucide-react';

interface ProfileSettingsProps {
    stats: UserStats;
    onSave: (name: string, avatarUrl: string) => Promise<void>;
    onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ stats, onSave, onBack }) => {
    const [name, setName] = useState(stats.name);
    const [avatarUrl, setAvatarUrl] = useState(stats.avatarUrl || '');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        await onSave(name, avatarUrl);
        setLoading(false);
        onBack();
    };

    return (
        <div className="space-y-6 pb-24 pt-4 animate-slide-up">
            <header className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-white border border-zinc-800">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-2xl font-black text-white tracking-tight">Editar Perfil</h1>
            </header>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-32 h-32 rounded-full border-4 border-zinc-800 p-1 mb-4 relative group">
                        <div className="w-full h-full rounded-full bg-zinc-800 overflow-hidden flex items-center justify-center">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" onError={(e) => {
                                    (e.target as HTMLImageElement).src = ''; 
                                    setAvatarUrl('');
                                }} />
                            ) : (
                                <div className="text-4xl font-black text-zinc-600">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-alpha-gold text-black p-2 rounded-full border border-black shadow-lg">
                            <Camera size={16} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Codinome (Nome)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-alpha-gold outline-none transition-all font-bold"
                                placeholder="Seu nome"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">URL da Imagem</label>
                        <div className="relative">
                            <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                            <input 
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-alpha-gold outline-none transition-all text-xs font-mono"
                                placeholder="https://..."
                            />
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-2">
                            Dica: Copie o link de uma imagem do Google ou Instagram.
                        </p>
                    </div>

                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-alpha-gold text-black font-black uppercase tracking-wider py-4 rounded-xl hover:bg-white transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                        <Save size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
