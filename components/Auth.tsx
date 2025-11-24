import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createUserProfile } from '../services/userService';
import { Lock, Mail, User, ArrowRight, AlertCircle, Loader2, X, WifiOff, CheckCircle } from 'lucide-react';

type AuthMode = 'LOGIN' | 'REGISTER' | 'RECOVERY';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [legalModal, setLegalModal] = useState<'TERMS' | 'PRIVACY' | null>(null);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);

    // Validação básica
    if (!email || !password) {
        setError("Preencha todos os campos.");
        return;
    }

    if (!isValidEmail(email)) {
        setError("Por favor, insira um endereço de e-mail válido.");
        return;
    }

    if (authMode === 'REGISTER' && !name) {
        setError("Por favor, informe um nome.");
        return;
    }

    setLoading(true);

    try {
      if (authMode === 'RECOVERY') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/login',
        });
        if (error) throw error;
        setInfoMessage("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
        setLoading(false);
      } else if (authMode === 'LOGIN') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;
        
        // Verifica se o usuário realmente foi logado
        if (data?.session) {
             setInfoMessage("Sucesso! Entrando no sistema...");
             
             // Pequeno delay para garantir que o AuthContext receba o evento de mudança de sessão
             setTimeout(() => {
                 navigate('/app');
             }, 800); 
        } else {
             throw new Error("Não foi possível iniciar a sessão. Tente novamente.");
        }
        
      } else {
        // REGISTER
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name: name || 'Agente' } }
        });
        
        if (error) throw error;
        
        if (data.session && data.user) {
           // Criação de perfil pode falhar sem impedir o login, então fazemos separadamente
           try {
             await createUserProfile(data.user.id, email, name || 'Agente');
           } catch (profileError) {
             console.error("Profile creation warning:", profileError);
           }
           setInfoMessage("Conta criada! Acessando...");
           setTimeout(() => {
               navigate('/app');
           }, 800);
        } else if (data.user && !data.session) {
            setInfoMessage("Conta criada com sucesso! Verifique seu e-mail para confirmar antes de entrar.");
            setAuthMode('LOGIN');
            setLoading(false);
        }
      }
    } catch (err: any) {
      console.error("Auth Error Full:", err);
      setLoading(false);
      
      let msg = "Erro de autenticação.";
      
      if (err.message === "TIMEOUT") {
          msg = "O servidor demorou para responder. Verifique sua conexão.";
      } else if (err.message === 'Failed to fetch') {
          msg = "Erro de conexão. Verifique se você está conectado à internet.";
      } else if (err.message?.includes("Invalid login credentials")) {
          msg = "E-mail ou senha incorretos.";
      } else if (err.message?.includes("User already registered")) {
          msg = "Este e-mail já está cadastrado.";
      } else if (err.message) {
          msg = err.message;
      }
      
      setError(msg);
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
                <button onClick={() => setLegalModal(null)} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20}/></button>
                <h3 className="text-lg font-bold text-white mb-4">{legalModal === 'TERMS' ? 'Termos de Uso' : 'Política de Privacidade'}</h3>
                <div className="text-zinc-400 text-sm space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    <p>1. O AlphaTalk utiliza inteligência artificial para gerar sugestões. Não garantimos resultados reais em relacionamentos.</p>
                    <p>2. Seus dados são processados de forma anônima.</p>
                    <p>3. O uso indevido da plataforma resultará em banimento.</p>
                </div>
                <button onClick={() => setLegalModal(null)} className="w-full bg-white text-black font-bold py-3 rounded-xl mt-6 hover:bg-zinc-200">Entendi</button>
            </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md z-10 py-10">
        <div className="text-center mb-8 w-full cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-700 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] mx-auto mb-6 relative overflow-hidden group">
                <span className="text-5xl font-black text-black relative z-10">A</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </div>
            <h1 className="text-4xl font-black text-white italic tracking-tighter">
                ALPHA <span className="text-yellow-500">TALK</span>
            </h1>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">Área de Membros</p>
        </div>

        <div className="glass-card p-8 rounded-3xl border border-zinc-800 shadow-2xl w-full mb-6 relative overflow-hidden animate-slide-up">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>

            <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {authMode === 'LOGIN' && 'Acessar Conta'}
                {authMode === 'REGISTER' && 'Criar Nova Conta'}
                {authMode === 'RECOVERY' && 'Recuperar Senha'}
            </h2>
            
            {infoMessage && (
                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-xl flex items-start gap-3 mb-6 text-green-300 text-sm animate-in fade-in slide-in-from-top-2">
                    {infoMessage.includes("Sucesso") ? <CheckCircle size={20} className="mt-0.5" /> : <AlertCircle size={20} className="mt-0.5" />}
                    <span className="leading-relaxed font-bold">{infoMessage}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl flex items-start gap-3 mb-6 text-red-300 text-sm animate-in fade-in slide-in-from-top-2">
                    <WifiOff size={20} className="mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{error}</span>
                </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'REGISTER' && (
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                        <input 
                            type="text" 
                            placeholder="Seu Nome ou Codinome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none transition-all placeholder:text-zinc-600"
                            disabled={loading}
                        />
                    </div>
                )}

                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                    <input 
                        type="email" 
                        placeholder="Seu E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none transition-all placeholder:text-zinc-600"
                        disabled={loading}
                    />
                </div>

                {authMode !== 'RECOVERY' && (
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
                        <input 
                            type="password" 
                            placeholder="Sua Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white focus:border-yellow-500 outline-none transition-all placeholder:text-zinc-600"
                            disabled={loading}
                        />
                    </div>
                )}

                {authMode === 'LOGIN' && (
                    <div className="flex justify-end pt-1">
                        <button 
                            type="button"
                            onClick={() => switchMode('RECOVERY')}
                            className="text-xs font-bold text-zinc-500 hover:text-yellow-500 transition-colors"
                        >
                            Esqueci minha senha
                        </button>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black uppercase tracking-wider py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:grayscale shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Processando...</span>
                        </>
                    ) : (
                        <>
                            {authMode === 'LOGIN' && 'Entrar no Sistema'}
                            {authMode === 'REGISTER' && 'Finalizar Cadastro'}
                            {authMode === 'RECOVERY' && 'Enviar Link'}
                            {authMode !== 'RECOVERY' && <ArrowRight size={20} />}
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
                {authMode === 'RECOVERY' ? (
                    <button onClick={() => switchMode('LOGIN')} className="text-zinc-500 text-sm font-bold hover:text-white transition-colors">Voltar para Login</button>
                ) : (
                    <p className="text-zinc-500 text-sm">
                        {authMode === 'LOGIN' ? 'Ainda não é membro?' : 'Já tem uma conta?'}
                        <button 
                            onClick={() => switchMode(authMode === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                            className="text-yellow-500 font-bold ml-2 hover:underline"
                        >
                            {authMode === 'LOGIN' ? 'Criar Conta Grátis' : 'Fazer Login'}
                        </button>
                    </p>
                )}
            </div>
        </div>
      </div>

      <footer className="w-full py-4 flex justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-zinc-700">
        <button onClick={() => setLegalModal('TERMS')} className="hover:text-zinc-400 transition-colors">Termos de Uso</button>
        <span>•</span>
        <button onClick={() => setLegalModal('PRIVACY')} className="hover:text-zinc-400 transition-colors">Privacidade</button>
      </footer>
    </div>
  );
};

export default Auth;
