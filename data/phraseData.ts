import { MessageSquare, Zap, Calendar, Heart } from 'lucide-react';

export const categories = [
  { 
    id: 1, 
    title: 'Puxar Assunto', 
    description: 'Quebra-gelos, abridores e mensagens iniciais.',
    icon: MessageSquare, 
    color: 'text-blue-400',
    lines: [
      "Percebi que você tem um estilo muito artístico, você trabalha com criatividade?",
      "Sua energia na foto 3 é contagiante, parece que foi um dia incrível.",
      "Aposto que você é o tipo de pessoa que prefere viajar para praia do que para montanha.",
      "Vi que você curte culinária japonesa. Já tentou fazer sushi em casa ou só come?",
      "Essa foto com o cachorro é golpe baixo, impossível não dar like.",
      "Pergunta séria: esse lugar na sua foto de capa é aqui na cidade?",
      "Você tem cara de quem aprontava muito na época da escola."
    ]
  },
  { 
    id: 2, 
    title: 'Manter Conversa', 
    description: 'Tópicos infinitos para evitar o silêncio.',
    icon: Zap, 
    color: 'text-alpha-gold',
    lines: [
      "O que é sucesso pra você hoje em dia?",
      "Qual a lição mais difícil que você aprendeu ano passado?",
      "Se você pudesse mudar algo no seu passado, mudaria?",
      "O que te deixa realmente empolgada de falar sobre?"
    ]
  },
  { 
    id: 3, 
    title: 'Marcar Encontro', 
    description: 'Converta a conversa digital para o mundo real.',
    icon: Calendar, 
    color: 'text-green-400',
    lines: [
      "Conheço um lugar que tem o melhor café da cidade. Topa conferir?",
      "Tô afim de comer [Comida]. Vamos comigo?",
      "A gente se dá bem por mensagem, mas ao vivo deve ser melhor. Vamos sair?"
    ]
  },
  { 
    id: 4, 
    title: 'Técnicas de Atração', 
    description: 'Crie tensão sexual, provoque e flerte.',
    icon: Heart, 
    color: 'text-red-400',
    lines: [
      "Você é bonitinha, pena que tem gosto duvidoso pra filmes.",
      "Adorei seu estilo, parece o da minha avó (brincadeira, tá linda).",
      "Você é inteligente demais pro meu gosto, vai me dar trabalho."
    ]
  }
];
