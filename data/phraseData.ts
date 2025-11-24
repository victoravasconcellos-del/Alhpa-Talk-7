import { MessageSquare, Zap, Calendar, Heart } from 'lucide-react';

export const categories = [
  { 
    id: 1, 
    title: 'Puxar Assunto', 
    description: 'Abridores.',
    icon: MessageSquare, 
    color: 'text-blue-400',
    lines: ["Oi, tudo bem?", "Bela foto!", "Adorei seu estilo."]
  },
  { 
    id: 2, 
    title: 'Manter Conversa', 
    description: 'Tópicos.',
    icon: Zap, 
    color: 'text-alpha-gold',
    lines: ["Qual seu filme favorito?", "Gosta de viajar?"]
  },
  { 
    id: 3, 
    title: 'Marcar Encontro', 
    description: 'Convites.',
    icon: Calendar, 
    color: 'text-green-400',
    lines: ["Vamos tomar um café?", "Topa sair sexta?"]
  },
  { 
    id: 4, 
    title: 'Atração', 
    description: 'Flerte.',
    icon: Heart, 
    color: 'text-red-400',
    lines: ["Você é incrível.", "Gostei do seu sorriso."]
  }
];
