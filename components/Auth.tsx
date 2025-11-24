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
      setError(err.message || "Erro de autenticação.");
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
      {legalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm" onClick={() => setLegalModal(null)}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setLegalModal(null)} className="absolute top-4 right-4 text-zinc-500"><X size={20}/></button>
                <h3 className="text-lg font-bold text-white mb-4">{legalModal === 'TERMS' ? 'Termos' : 'Privacidade'}</h3>
                <p className="text-zinc-400 text-sm mb-4">O AlphaTalk é uma ferramenta de IA para entretenimento. Não garantimos resultados reais.</p>
                <button onClick={() => setLegalModal(null)} className="w-full bg-white text-black font-bold py-2 rounded">Entendi</button>
            </div>
        </div>
      )}

      <div className="glass-card p-8 rounded-3xl border border-zinc-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {authMode === 'LOGIN' ? 'Entrar' : authMode === 'REGISTER' ? 'Criar Conta' : 'Recuperar'}
        </h2>
        
        {infoMessage && <div className="bg-blue-900/30 text-blue-400 p-3 rounded mb-4 text-sm">{infoMessage}</div>}
        {error && <div className="bg-red-900/30 text-red-400 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'REGISTER' && (
                <div className="relative">
                    <User className="absolute left-3 top-3 text-zinc-500" size={20} />
                    <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} className="w-full pl-10 p-3 rounded bg-zinc-900 border border-zinc-800 text-white" required />
                </div>
            )}
            <div className="relative">
                <Mail className="absolute left-3 top-3 text-zinc-500" size={20} />
                <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 p-3 rounded bg-zinc-900 border border-zinc-800 text-white" required />
            </div>
            {authMode !== 'RECOVERY' && (
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-zinc-500" size={20} />
                    <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 p-3 rounded bg-zinc-900 border border-zinc-800 text-white" required />
                </div>
            )}

            {authMode === 'LOGIN' && (
                <div className="flex justify-end">
                    <button type="button" onClick={() => switchMode('RECOVERY')} className="text-xs text-zinc-500 hover:text-white">Esqueci a senha</button>
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-alpha-gold p-3 rounded font-bold flex justify-center items-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : (authMode === 'LOGIN' ? 'Entrar' : authMode === 'REGISTER' ? 'Cadastrar' : 'Enviar')}
                {!loading && authMode !== 'RECOVERY' && <ArrowRight size={18} />}
            </button>
        </form>

        <div className="mt-6 text-center">
            {authMode === 'RECOVERY' ? (
                <button onClick={() => switchMode('LOGIN')} className="text-zinc-500 text-sm hover:text-white">Voltar ao Login</button>
            ) : (
                <p className="text-zinc-500 text-sm">
                    {authMode === 'LOGIN' ? 'Não tem conta?' : 'Já tem conta?'}
                    <button onClick={() => switchMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="text-alpha-gold font-bold ml-2 hover:underline">
                        {authMode === 'LOGIN' ? 'Cadastre-se' : 'Entrar'}
                    </button>
                </p>
            )}
        </div>
      </div>

      <div className="mt-8 flex gap-4 text-xs text-zinc-600">
        <button onClick={() => setLegalModal('TERMS')}>Termos</button>
        <button onClick={() => setLegalModal('PRIVACY')}>Privacidade</button>
      </div>
    </div>
  );
};

export default Auth;
