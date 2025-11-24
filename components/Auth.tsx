import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { createUserProfile } from '../services/userService';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2, Shield, FileText, X } from 'lucide-react';

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
        setInfoMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
      } else if (authMode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || 'Agente' } }
        });
        
        if (error) throw error;
        
        if (data.session && data.user) {
           await createUserProfile(data.user.id, email, name || 'Agente');
        } else if (data.user && !data.session) {
            setInfoMessage("Conta criada! Verifique seu e-mail.");
            setAuthMode('LOGIN');
            return;
        }
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      // Mensagem mais amigável para o erro "Failed to fetch"
      if (err.message === 'Failed to fetch') {
          setError("Erro de conexão. Verifique sua internet ou se as chaves do Supabase estão configuradas.");
      } else {
          setError(err.message || "Ocorreu um erro. Tente novamente.");
      }
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
    <div className="min-h-screen w-full bg-black flex flex-col relative overflow-y-auto p-4 items-center justify-center">
      
      {/* Modal Legal */}
      {legalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={() => setLegalModal(null)}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setLegalModal(null)} className="absolute top-4 right-4 text-zinc-500"><X size={20}/></button>
                <h3 className="text-lg font-bold text-white mb-4">{legalModal === 'TERMS' ? 'Termos de Uso' : 'Política de Privacidade'}</h3>
                <div className="text-zinc-400 text-sm space-y-2 max-h-60 overflow-y-auto">
                    <p>O AlphaTalk utiliza inteligência artificial para gerar sugestões. As respostas são para fins de entretenimento.</p>
                    <p>Não nos responsabilizamos pelas interações resultantes do uso do aplicativo.</p>
                    <p>Seus dados de login são processados de forma segura.</p>
                </div>
                <button onClick={() => setLegalModal(null)} className="w-full bg-white text-black font-bold py-2 rounded mt-4">Entendi</button>
            </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md z-10">
        
        {/* LOGO - Usando cores padrão yellow-600 para garantir visibilidade */}
        <div className="text-center mb-8 w-full">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] mx-auto mb-6 relative overflow-hidden group">
                <span className="text-5xl font-black text-black relative z-10">A</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">
                ALPHA <span className="text-yellow-500">TALK</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Acesso Restrito</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-zinc-800 shadow-2xl w-full mb-6 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

            <h2 className="text-2xl font-bold text-white mb-2 text-center">
                {authMode === 'LOGIN' && 'Entrar'}
                {authMode === 'REGISTER' && 'Criar Conta'}
                {authMode === 'RECOVERY' && 'Recuperar'}
            </h2>
            
            {infoMessage && (
                <div className="bg-blue-900/30 border border-blue-800 p-3 rounded-xl flex items-start gap-2 mb-4 text-blue-300 text-sm">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{infoMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-900/30 border border-red-800 p-3 rounded-xl flex items-start gap-2 mb-4 text-red-300 text-sm">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'REGISTER' && (
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input 
                            type="text" 
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none"
                            required
                        />
                    </div>
                )}

                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input 
                        type="email" 
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none"
                        required
                    />
                </div>

                {authMode !== 'RECOVERY' && (
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                        <input 
                            type="password" 
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none"
                            required
                        />
                    </div>
                )}

                {authMode === 'LOGIN' && (
                    <div className="flex justify-end">
                        <button 
                            type="button"
                            onClick={() => switchMode('RECOVERY')}
                            className="text-xs text-zinc-500 hover:text-yellow-500 transition-colors"
                        >
                            Esqueci a senha
                        </button>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-yellow-600 text-black font-bold uppercase tracking-wider py-4 rounded-xl hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            {authMode === 'LOGIN' && 'Acessar'}
                            {authMode === 'REGISTER' && 'Cadastrar'}
                            {authMode === 'RECOVERY' && 'Enviar'}
                            {!loading && authMode !== 'RECOVERY' && <ArrowRight size={20} />}
                        </>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                {authMode === 'RECOVERY' ? (
                    <button onClick={() => switchMode('LOGIN')} className="text-zinc-500 text-sm hover:text-white">Voltar</button>
                ) : (
                    <p className="text-zinc-500 text-sm">
                        {authMode === 'LOGIN' ? 'Não tem conta?' : 'Já tem conta?'}
                        <button 
                            onClick={() => switchMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                            className="text-yellow-500 font-bold ml-2 hover:underline"
                        >
                            {authMode === 'LOGIN' ? 'Criar Agora' : 'Entrar'}
                        </button>
                    </p>
                )}
            </div>
        </div>
      </div>

      <footer className="w-full py-6 flex justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-zinc-600">
        <button onClick={() => setLegalModal('TERMS')} className="hover:text-white">Termos</button>
        <span>•</span>
        <button onClick={() => setLegalModal('PRIVACY')} className="hover:text-white">Privacidade</button>
      </footer>
    </div>
  );
};

export default Auth;
