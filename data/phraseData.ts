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
      "Você tem cara de quem aprontava muito na época da escola.",
      "Seu gosto musical parece ser impecável, me indica uma música pra hoje?",
      "Achei seu perfil muito intrigante, não consegui passar direto.",
      "Você parece ser alguém que sabe onde encontrar o melhor café da cidade."
    ]
  },
  { 
    id: 2, 
    title: 'Manter Conversa', 
    description: 'Tópicos infinitos para evitar o silêncio constrangedor.',
    icon: Zap, 
    color: 'text-alpha-gold',
    lines: [
      "O que é sucesso pra você hoje em dia?",
      "Qual a lição mais difícil que você aprendeu ano passado?",
      "Se você pudesse mudar algo no seu passado, mudaria?",
      "O que te deixa realmente empolgada de falar sobre?",
      "Qual a sua maior paixão fora do trabalho?",
      "O que você faria se não tivesse medo de falhar?",
      "Qual a característica que você mais valoriza em uma amizade?",
      "Você se considera uma pessoa espiritualizada?",
      "O que faz você perder a noção do tempo?",
      "Qual o melhor conselho que já te deram?"
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
      "A gente se dá bem por mensagem, mas ao vivo deve ser melhor. Vamos sair?",
      "O que você vai fazer na quinta à noite?",
      "Tô indo no bar X no fim de semana. Você deveria ir.",
      "Vamos tomar um açaí e falar mal dos outros?",
      "Bora sair da toca esse fim de semana?",
      "Tem um filme novo que parece bom. Vamos ver?",
      "Me ajuda a escolher um presente pra minha irmã no shopping?",
      "Vamos dar uma volta no parque e ver os cachorros?"
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
      "Você é inteligente demais pro meu gosto, vai me dar trabalho.",
      "Gostei de você, mesmo você sendo [Time de Futebol].",
      "Você é quase perfeita, só falta gostar de [Banda].",
      "Seu sorriso é lindo, mas esse olhar é perigoso.",
      "Você cozinha bem? Porque beleza não põe mesa.",
      "Você é fofa, mas tem cara de quem morde.",
      "Até que você não é chata.",
      "Você tem sorte de ser bonita."
    ]
  },
];
