import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { createUserProfile } from '../services/userService';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2, ArrowLeft, KeyRound, Shield, FileText, X } from 'lucide-react';

type AuthMode = 'LOGIN' | 'REGISTER' | 'RECOVERY';

const Auth: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<'TERMS' | 'PRIVACY' | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    try {
      if (authMode === 'RECOVERY') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (error) throw error;
        setInfoMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada (e spam).");
      } else if (authMode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Register
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
                name: name || 'Agente'
            }
          }
        });
        
        if (error) throw error;
        
        if (data.session && data.user) {
           await createUserProfile(data.user.id, email, name || 'Agente');
        } else if (data.user && !data.session) {
            setInfoMessage("Conta criada! Verifique seu e-mail para confirmar antes de entrar.");
            setAuthMode('LOGIN');
            return;
        }
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro de autenticação.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: AuthMode) => {
      setAuthMode(mode);
      setError(null);
      setInfoMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col relative overflow-y-auto">
      <div className="fixed inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none"></div>
      
      {legalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setLegalModal(null)}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b border-zinc-800 flex justify-between items-center bg-zinc-900 sticky top-0 z-10">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {legalModal === 'TERMS' ? <FileText size={20} className="text-alpha-gold"/> : <Shield size={20} className="text-alpha-gold"/>}
                        {legalModal === 'TERMS' ? 'Termos de Uso' : 'Política de Privacidade'}
                    </h3>
                    <button onClick={() => setLegalModal(null)} className="text-zinc-500 hover:text-white transition-colors p-2 rounded-full hover:bg-zinc-800">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto custom-scrollbar text-sm text-zinc-300 space-y-4 leading-relaxed flex-1 bg-zinc-900">
                    {legalModal === 'TERMS' ? (
                        <>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Última atualização: {new Date().toLocaleDateString()}</p>
                            <p><strong className="text-white block mb-1">1. Aceitação dos Termos</strong> Ao criar uma conta e utilizar o AlphaTalk, você concorda expressamente com estes termos. O serviço utiliza Inteligência Artificial para fornecer sugestões de comunicação.</p>
                            <p><strong className="text-white block mb-1">2. Isenção de Responsabilidade (Disclaimer)</strong> O AlphaTalk é uma ferramenta de entretenimento e educação social. As análises de conversas e sugestões de respostas são geradas automaticamente por modelos de IA e podem conter imprecisões. O AlphaTalk não garante resultados em relacionamentos.</p>
                        </>
                    ) : (
                        <>
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-2">Conformidade LGPD/GDPR</p>
                            <p><strong className="text-white block mb-1">1. Coleta de Dados</strong> Coletamos e-mail e nome para autenticação. Dados de uso são usados para gamificação.</p>
                            <p><strong className="text-white block mb-1">2. Processamento de Imagens e IA</strong> As imagens enviadas para o Scanner IA são processadas para extração de texto e análise, não sendo armazenadas permanentemente nos nossos servidores públicos.</p>
                        </>
                    )}
                </div>
                
                <div className="p-4 border-t border-zinc-800 bg-zinc-900 text-right flex justify-end">
                    <button onClick={() => setLegalModal(null)} className="bg-white text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-zinc-200 transition-colors shadow-lg active:scale-95">
                        Li e Concordo
                    </button>
                </div>
            </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-md mx-auto z-10">
        <div className="flex-grow-[1] hidden sm:block"></div>

        <div className="text-center mb-8 mt-4 w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-alpha-gold to-orange-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] mx-auto mb-6 relative overflow-hidden group">
                <span className="text-5xl font-black text-black relative z-10">A</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">
                ALPHA <span className="text-alpha-gold">TALK</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Acesso Restrito</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-zinc-800 shadow-2xl relative w-full mb-6">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-alpha-gold to-transparent"></div>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {authMode === 'LOGIN' && 'Identifique-se'}
                {authMode === 'REGISTER' && 'Inicie sua Jornada'}
                {authMode === 'RECOVERY' && 'Recuperar Acesso'}
            </h2>
            
            <p className="text-zinc-500 text-xs text-center mb-6">
                {authMode === 'RECOVERY' 
                    ? 'Enviaremos um link mágico para o seu e-mail.' 
                    : 'Entre para dominar a arte da conquista.'}
            </p>

            {infoMessage && (
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl flex items-start gap-2 mb-6 text-blue-400 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{infoMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-2 mb-6 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'REGISTER' && (
                    <div className="relative group animate-in fade-in slide-in-from-bottom-2">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-alpha-gold transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Seu Codinome (Nome)"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-alpha-gold outline-none transition-all"
                            required
                        />
                    </div>
                )}

                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-alpha-gold transition-colors" size={20} />
                    <input 
                        type="email" 
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-alpha-gold outline-none transition-all"
                        required
                    />
                </div>

                {authMode !== 'RECOVERY' && (
                    <div className="relative group animate-in fade-in slide-in-from-bottom-2">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-alpha-gold transition-colors" size={20} />
                        <input 
                            type="password" 
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-600 focus:border-alpha-gold outline-none transition-all"
                            required
                        />
                    </div>
                )}

                {authMode === 'LOGIN' && (
                    <div className="flex justify-end">
                        <button 
                            type="button"
                            onClick={() => switchMode('RECOVERY')}
                            className="text-xs text-zinc-500 hover:text-alpha-gold transition-colors"
                        >
                            Esqueci minha senha
                        </button>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black uppercase tracking-wider py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : (
                        <>
                            {authMode === 'LOGIN' && 'Entrar'}
                            {authMode === 'REGISTER' && 'Cadastrar'}
                            {authMode === 'RECOVERY' && 'Enviar Link'}
                            {authMode !== 'RECOVERY' && <ArrowRight size={20} />}
                            {authMode === 'RECOVERY' && <KeyRound size={20} />}
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                {authMode === 'RECOVERY' ? (
                    <button 
                        onClick={() => switchMode('LOGIN')}
                        className="text-zinc-500 text-sm hover:text-white flex items-center justify-center gap-2 mx-auto"
                    >
                        <ArrowLeft size={16} /> Voltar para o Login
                    </button>
                ) : (
                    <p className="text-zinc-500 text-sm">
                        {authMode === 'LOGIN' ? 'Ainda não é um membro?' : 'Já tem uma conta?'}
                        <button 
                            onClick={() => switchMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                            className="text-alpha-gold font-bold ml-2 hover:underline"
                        >
                            {authMode === 'LOGIN' ? 'Cadastre-se' : 'Entrar'}
                        </button>
                    </p>
                )}
            </div>
        </div>

        <div className="flex-grow-[1] hidden sm:block"></div>
      </div>

      <footer className="w-full py-8 px-4 flex flex-col items-center justify-center gap-3 relative z-50 shrink-0 bg-gradient-to-t from-black via-black/95 to-transparent mt-auto">
        <p className="text-[10px] text-zinc-600 text-center max-w-xs leading-relaxed select-none">
            As análises são geradas por IA para fins de entretenimento.<br/>
            O AlphaTalk não se responsabiliza por suas interações.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
            <button 
                type="button"
                onClick={(e) => { e.preventDefault(); setLegalModal('TERMS'); }} 
                className="text-zinc-500 hover:text-alpha-gold transition-colors text-[10px] font-bold uppercase tracking-widest border-b border-transparent hover:border-alpha-gold pb-0.5 cursor-pointer"
            >
                Termos de Uso
            </button>
            <button 
                type="button"
                onClick={(e) => { e.preventDefault(); setLegalModal('PRIVACY'); }} 
                className="text-zinc-500 hover:text-alpha-gold transition-colors text-[10px] font-bold uppercase tracking-widest border-b border-transparent hover:border-alpha-gold pb-0.5 cursor-pointer"
            >
                Privacidade & LGPD
            </button>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
