import React, { useState } from 'react';
import { ScanLine, MessageCircle, Zap, ChevronRight, Check } from 'lucide-react';

interface OnboardingProps {
  onFinish: () => void;
}

const steps = [
  {
    title: "Scanner IA",
    description: "Tire print de qualquer conversa. Nossa IA descobre o subtexto oculto e te diz se ela está interessada.",
    icon: ScanLine,
    color: "text-alpha-gold",
    bg: "bg-alpha-gold/10"
  },
  {
    title: "Estratégia Tática",
    description: "Receba análises precisas e 3 opções de resposta infalíveis. Nunca mais fique sem saber o que dizer.",
    icon: Zap,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    title: "Alpha Coach",
    description: "Use o Coach para gerar mensagens Sedutoras, Engraçadas ou Diretas. Domine a arte da comunicação.",
    icon: MessageCircle,
    color: "text-green-400",
    bg: "bg-green-400/10"
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  const StepIcon = steps[currentStep].icon;

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.15),transparent_60%)] pointer-events-none"></div>
      
      <button 
        onClick={onFinish}
        className="absolute top-6 right-6 text-zinc-600 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors z-20"
      >
        Pular
      </button>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10">
        <div key={currentStep} className="mb-12 relative group animate-in zoom-in-50 duration-500 slide-in-from-bottom-10">
            <div className={`absolute inset-0 ${steps[currentStep].bg} blur-2xl rounded-full opacity-50`}></div>
            <div className={`w-32 h-32 rounded-3xl ${steps[currentStep].bg} border border-white/10 flex items-center justify-center relative shadow-2xl`}>
                <StepIcon size={64} className={`${steps[currentStep].color} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`} />
            </div>
        </div>

        <div className="text-center space-y-4 mb-12 min-h-[140px]">
            <h2 key={`title-${currentStep}`} className="text-3xl font-black text-white tracking-tight animate-in slide-in-from-bottom-4 fade-in duration-500">
                {steps[currentStep].title}
            </h2>
            <p key={`desc-${currentStep}`} className="text-zinc-400 text-sm leading-relaxed max-w-[280px] mx-auto animate-in slide-in-from-bottom-4 fade-in duration-700">
                {steps[currentStep].description}
            </p>
        </div>

        <div className="flex gap-2 mb-8">
            {steps.map((_, idx) => (
                <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentStep ? 'w-8 bg-alpha-gold' : 'w-2 bg-zinc-800'
                    }`}
                ></div>
            ))}
        </div>

        <button 
            onClick={handleNext}
            className="w-full bg-gradient-to-r from-alpha-gold to-yellow-600 text-black font-black uppercase tracking-wider py-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)] flex items-center justify-center gap-2 group"
        >
            {currentStep === steps.length - 1 ? (
                <>Começar Agora <Check size={20} /></>
            ) : (
                <>Próximo <ChevronRight size={20} /></>
            )}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
