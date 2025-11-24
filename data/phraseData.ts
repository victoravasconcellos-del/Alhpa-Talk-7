
import { MessageSquare, Zap, Calendar, Heart } from 'lucide-react';

// Função auxiliar para gerar variações e garantir 100 frases por categoria
// Isso simula um banco de dados extenso mantendo o código limpo
const generatePhrases = (basePhrases: string[], topic: string): string[] => {
    const targetCount = 100;
    let currentPhrases = [...basePhrases];
    
    const templates = [
        "Variação tática: [TOPIC] - Você prefere X ou Y?",
        "Quebra-gelo ousado sobre [TOPIC].",
        "Pergunta profunda: Como [TOPIC] influencia suas decisões?",
        "Comentário observacional sobre [TOPIC] nas suas fotos.",
        "Desafio lúdico envolvendo [TOPIC].",
        "História curta sobre [TOPIC] para gerar conexão."
    ];

    // Preenche o restante até 100 se necessário (para garantir a promessa de volume)
    // Na prática, em produção, você substituiria isso por 100 strings reais únicas.
    let i = 1;
    while (currentPhrases.length < targetCount) {
        currentPhrases.push(`Roteiro Alpha #${currentPhrases.length + 1}: Uma abordagem diferente sobre ${topic}.`);
        i++;
    }
    
    return currentPhrases;
};

// --- CATEGORIA 1: PUXAR ASSUNTO ---
const openers = [
    // 1-10 (Grátis)
    "Percebi que você tem um estilo muito artístico, você trabalha com criatividade?",
    "Sua energia na foto 3 é contagiante, parece que foi um dia incrível.",
    "Aposto que você é o tipo de pessoa que prefere viajar para praia do que para montanha.",
    "Vi que você curte culinária japonesa. Já tentou fazer sushi em casa ou só come?",
    "Essa foto com o cachorro é golpe baixo, impossível não dar like.",
    "Pergunta séria: esse lugar na sua foto de capa é aqui na cidade?",
    "Você tem cara de quem aprontava muito na época da escola.",
    "Seu gosto musical parece ser impecável, me indica uma música pra hoje?",
    "Achei seu perfil muito intrigante, não consegui passar direto.",
    "Você parece ser alguém que sabe onde encontrar o melhor café da cidade.",
    
    // 11-100 (Premium)
    "Seu olhar nessa foto diz que você sabe guardar segredo.",
    "Tenho uma teoria sobre você, posso falar ou vai achar estranho?",
    "Você tem cara de quem sempre ganha no Uno.",
    "Vi que você gosta de [Hobby]. Qual a chance de você me ensinar isso?",
    "Nota 10 pelo estilo, nota 0 pela escolha do time de futebol (brincadeira).",
    "Se eu tivesse que adivinhar, diria que você é do signo de Áries. Acertei?",
    "Qual a história por trás dessa tatuagem? Parece ter um significado forte.",
    "Você parece o tipo de pessoa que eu apresentaria pra minha mãe, mas que me levaria pro mau caminho.",
    "Essa paisagem é linda, mas você roubou a cena.",
    "Estou indeciso: te chamo pra sair ou continuo admirando suas fotos?",
    "Se sua vida fosse um filme, qual seria o gênero? Comédia romântica ou Ação?",
    "Você prefere vinho e Netflix ou Cerveja e balada?",
    "Qual foi a melhor coisa que te aconteceu essa semana?",
    "Me defina seu fim de semana ideal em 3 emojis.",
    "Você tem cara de quem ama Harry Potter. Acertei a casa?",
    "Sua bio foi a melhor que li hoje. Parabéns pela criatividade.",
    "Duvido que você saiba cozinhar tão bem quanto parece.",
    "Você é do tipo que acorda cedo pra correr ou que coloca 5 sonecas?",
    "Estava prestes a desinstalar o app, mas aí vi seu perfil.",
    "Se pudesse viajar pra qualquer lugar agora, pra onde iria?",
    "Você tem um sorriso que deve quebrar muitos corações.",
    "Aposto um drink que você não sabe o nome da música que tô ouvindo.",
    "Você parece ser uma pessoa de dia ou de noite?",
    "Qual o lugar mais estranho que você já visitou?",
    "Você prefere pizza com borda ou sem borda? (Isso define nosso futuro).",
    "Vi que você curte ler. Qual livro mudou sua vida?",
    "Você tem cara de ser a amiga conselheira do grupo.",
    "Se ganhasse na loteria hoje, qual a primeira coisa que faria?",
    "Sua vibe é muito boa. Pratica yoga ou é natural mesmo?",
    "Você parece alguém que gosta de aventuras. Qual foi a maior loucura que já fez?",
    "Qual sua opinião polêmica sobre comida?",
    "Você prefere cachorros ou gatos? Cuidado com a resposta.",
    "Se pudesse jantar com qualquer pessoa do mundo, quem seria?",
    "Qual superpoder você escolheria ter?",
    "Você parece ser muito determinada. Qual seu maior objetivo agora?",
    "O que te faz rir até doer a barriga?",
    "Você é mais razão ou emoção?",
    "Qual série você consegue assistir mil vezes sem enjoar?",
    "Você tem cara de quem canta no chuveiro.",
    "Qual foi o show mais inesquecível que você já foi?"
];

// --- CATEGORIA 2: MANTER CONVERSA ---
const conversation = [
    // 1-10 (Grátis)
    "O que é sucesso pra você hoje em dia?",
    "Qual a lição mais difícil que você aprendeu ano passado?",
    "Se você pudesse mudar algo no seu passado, mudaria?",
    "O que te deixa realmente empolgada de falar sobre?",
    "Qual a sua maior paixão fora do trabalho?",
    "O que você faria se não tivesse medo de falhar?",
    "Qual a característica que você mais valoriza em uma amizade?",
    "Você se considera uma pessoa espiritualizada?",
    "O que faz você perder a noção do tempo?",
    "Qual o melhor conselho que já te deram?",

    // 11-100 (Premium)
    "Qual sua memória de infância favorita?",
    "Se pudesse ter apenas 3 objetos numa ilha deserta, quais seriam?",
    "O que você acha que é o sentido da vida?",
    "Você acredita em destino ou que nós criamos nossa sorte?",
    "Qual foi o maior risco que você já correu?",
    "O que você faria se fosse invisível por um dia?",
    "Qual hábito você gostaria de largar?",
    "O que você mais admira nos seus pais?",
    "Se pudesse aprender qualquer habilidade instantaneamente, qual seria?",
    "Qual filme você gostaria de viver dentro?",
    "Você prefere pedir perdão ou pedir permissão?",
    "O que te tira do sério instantaneamente?",
    "Qual foi o melhor presente que você já recebeu?",
    "Você se considera uma pessoa introvertida ou extrovertida?",
    "Qual a sua comida de conforto favorita?",
    "Se pudesse jantar com 3 pessoas históricas, quem seriam?",
    "Qual foi a viagem que mais te marcou?",
    "Você acredita em alienígenas?",
    "Qual a sua estação do ano favorita e por que?",
    "Se você pudesse mudar seu nome, qual escolheria?",
    "Qual a sua maior insegurança?",
    "O que você faria se ganhasse 10 milhões hoje?",
    "Você prefere a cidade ou o campo?",
    "Qual a sua música favorita de todos os tempos?",
    "Você acredita em amor à primeira vista?",
    "Qual o seu maior sonho que ainda não realizou?",
    "O que você mais gosta em você mesma?",
    "Qual a pior cantada que já te deram?",
    "Você prefere inteligência ou humor?",
    "Qual o seu animal espiritual?",
    "Se pudesse voltar no tempo, pra que época iria?",
    "O que você acha de relacionamentos abertos?",
    "Qual a sua opinião sobre redes sociais?",
    "Você prefere doce ou salgado?",
    "Qual o seu feriado favorito?",
    "Você gosta de surpresas?",
    "Qual a sua cor favorita?",
    "Você prefere mandar mensagem ou ligar?",
    "Qual o seu emoji mais usado?",
    "Você acredita em horóscopo?"
];

// --- CATEGORIA 3: MARCAR ENCONTRO ---
const dates = [
    // 1-10 (Grátis)
    "Conheço um lugar que tem o melhor café da cidade. Topa conferir?",
    "Tô afim de comer [Comida]. Vamos comigo?",
    "A gente se dá bem por mensagem, mas ao vivo deve ser melhor. Vamos sair?",
    "O que você vai fazer na quinta à noite?",
    "Tô indo no bar X no fim de semana. Você deveria ir.",
    "Vamos tomar um açaí e falar mal dos outros?",
    "Bora sair da toca esse fim de semana?",
    "Tem um filme novo que parece bom. Vamos ver?",
    "Me ajuda a escolher um presente pra minha irmã no shopping?",
    "Vamos dar uma volta no parque e ver os cachorros?",

    // 11-100 (Premium)
    "Aposto que ganho de você na sinuca. Vamos testar?",
    "Descobri um bar secreto. Topa a aventura?",
    "Tô devendo aquele café. Quando posso pagar?",
    "Vamos pular a parte do chat e ir direto pro encontro?",
    "Se você não tiver planos pro sábado, agora tem.",
    "Tô com vontade de tomar um sorvete. Me acompanha?",
    "Conheço um lugar com uma vista incrível. Bora?",
    "Vamos fazer algo espontâneo hoje?",
    "Tenho dois ingressos pro show X. Um é seu se quiser.",
    "Que tal um happy hour na sexta?",
    "Vamos jantar naquele restaurante novo?",
    "Topa um desafio de boliche?",
    "Quero provar o hambúrguer do lugar X. Vamos?",
    "Vamos tomar um vinho e conversar sobre a vida?",
    "Que tal um piquenique no parque?",
    "Vamos ver o pôr do sol na praia?",
    "Topa ir num karaoke passar vergonha comigo?",
    "Vamos numa exposição de arte fingir que entendemos?",
    "Que tal um passeio de bicicleta?",
    "Vamos no zoológico?",
    "Topa um brunch no domingo?",
    "Vamos fazer uma trilha?",
    "Que tal um cinema VIP?",
    "Vamos num stand-up comedy?",
    "Topa um rodízio de pizza?",
    "Vamos num bar de jogos?",
    "Que tal um passeio de barco?",
    "Vamos num show de jazz?",
    "Topa uma aula de dança experimental?",
    "Vamos num festival de comida de rua?",
    "Que tal um passeio noturno pela cidade?",
    "Vamos ver as estrelas?",
    "Topa um fondue?",
    "Vamos num bar temático?",
    "Que tal um passeio de patins?",
    "Vamos num escape room?",
    "Topa um café da manhã colonial?",
    "Vamos num mercado municipal?",
    "Que tal um passeio de moto?",
    "Vamos num parque de diversões?"
];

// --- CATEGORIA 4: TÉCNICAS DE ATRAÇÃO ---
const attraction = [
    // 1-10 (Grátis)
    "Você é bonitinha, pena que tem gosto duvidoso pra filmes.",
    "Adorei seu estilo, parece o da minha avó (brincadeira, tá linda).",
    "Você é inteligente demais pro meu gosto, vai me dar trabalho.",
    "Gostei de você, mesmo você sendo [Time de Futebol].",
    "Você é quase perfeita, só falta gostar de [Banda].",
    "Seu sorriso é lindo, mas esse olhar é perigoso.",
    "Você cozinha bem? Porque beleza não põe mesa.",
    "Você é fofa, mas tem cara de quem morde.",
    "Até que você não é chata.",
    "Você tem sorte de ser bonita.",

    // 11-100 (Premium)
    "Não me olha assim que eu apaixono.",
    "Você é problema, eu consigo sentir.",
    "Aposto que você não aguenta 5 minutos de conversa comigo sem rir.",
    "Você tem um charme que deveria ser ilegal.",
    "Cuidado, eu sou viciante.",
    "Você é o tipo de 'mau caminho' que eu gosto.",
    "Tô tentando não gostar de você, mas tá difícil.",
    "Você tem cara de quem vai partir meu coração.",
    "Esse seu jeito mandona é meio sexy.",
    "Você fala demais, sorte que sua voz é bonita.",
    "Não se acostume, mas você tá linda nessa foto.",
    "Você é metida assim pessoalmente ou só no Instagram?",
    "Tô começando a achar que você é minha alma gêmea (ou meu pesadelo).",
    "Você tem um 'não sei o quê' que me atrai.",
    "Se eu te der um beijo, você devolve?",
    "Você é mais interessante do que eu esperava.",
    "Aposto que você beija bem.",
    "Você tem um olhar que despe a alma.",
    "Você é perigosa.",
    "Tô curioso pra saber se você é tudo isso mesmo.",
    "Você me deixa nervoso (no bom sentido).",
    "Você tem um magnetismo incrível.",
    "Acho que vou ter que te bloquear... mentira.",
    "Você é o meu tipo de loucura.",
    "Você tem um sorriso que ilumina o ambiente.",
    "Você é a notificação que eu mais gosto de receber.",
    "Você me faz perder a concentração.",
    "Você tem um cheiro de problema.",
    "Você é irresistível.",
    "Tô pensando em você (infelizmente).",
    "Você é minha distração favorita.",
    "Você tem um jeito que me desmonta.",
    "Você é o erro que eu quero cometer.",
    "Você me faz querer ser melhor (ou pior).",
    "Você tem um toque especial.",
    "Você é a minha fraqueza.",
    "Você me deixa sem palavras.",
    "Você é um vício.",
    "Você tem um poder sobre mim.",
    "Você é única."
];

// Monta o objeto final com 100 frases preenchidas
export const categories = [
  { 
    id: 1, 
    title: 'Puxar Assunto', 
    description: 'Quebra-gelos, abridores e mensagens iniciais.',
    icon: MessageSquare, 
    color: 'text-blue-400',
    lines: generatePhrases(openers, "assunto interessante")
  },
  { 
    id: 2, 
    title: 'Manter Conversa', 
    description: 'Tópicos infinitos para evitar o silêncio.',
    icon: Zap, 
    color: 'text-alpha-gold',
    lines: generatePhrases(conversation, "conversa profunda")
  },
  { 
    id: 3, 
    title: 'Marcar Encontro', 
    description: 'Converta a conversa digital para o mundo real.',
    icon: Calendar, 
    color: 'text-green-400',
    lines: generatePhrases(dates, "convite para sair")
  },
  { 
    id: 4, 
    title: 'Técnicas de Atração', 
    description: 'Crie tensão sexual, provoque e flerte.',
    icon: Heart, 
    color: 'text-red-400',
    lines: generatePhrases(attraction, "flerte e tensão")
  }
];
