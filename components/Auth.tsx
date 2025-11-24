import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { createUserProfile } from '../services/userService';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
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
      if (isLogin) {
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
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4">
      <div className="glass-card p-8 rounded-3xl border border-zinc-800 w-full max-w-md">
        <h2 className="text-white text-2xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Cadastro'}</h2>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && <input className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white" placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />}
            <input className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <input className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded text-white" type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} />
            <button disabled={loading} className="w-full bg-yellow-600 p-3 rounded font-bold text-black hover:bg-yellow-500">{loading ? '...' : isLogin ? 'Entrar' : 'Cadastrar'}</button>
        </form>
        <button onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-zinc-500 text-sm">{isLogin ? 'Criar conta' : 'Já tenho conta'}</button>
      </div>
    </div>
  );
};
export default Auth;
