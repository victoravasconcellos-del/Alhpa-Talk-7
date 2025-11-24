import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { createUserProfile } from '../services/userService';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMode === 'LOGIN') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name || 'Agente' } }
        });
        if (error) throw error;
        if (data.session) await createUserProfile(data.user!.id, email, name || 'Agente');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-4">
      <div className="glass-card p-8 rounded-3xl border border-zinc-800 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {authMode === 'LOGIN' ? 'Identifique-se' : 'Inicie sua Jornada'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'REGISTER' && (
                <input type="text" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 text-white" />
            )}
            <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 text-white" />
            <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded bg-zinc-900 border border-zinc-800 text-white" />
            <button type="submit" disabled={loading} className="w-full bg-alpha-gold p-3 rounded font-bold flex justify-center">
                {loading ? <Loader2 className="animate-spin" /> : (authMode === 'LOGIN' ? 'Entrar' : 'Cadastrar')}
            </button>
        </form>
        <button onClick={() => setAuthMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')} className="w-full text-center text-zinc-500 text-sm mt-4 hover:text-white">
            {authMode === 'LOGIN' ? 'Criar conta' : 'Já tenho conta'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
