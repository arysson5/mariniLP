import { asset } from "@/lib/utils";
export const WHATSAPP_URL = "https://wa.me/5511994929630";

export const QUOTE_TEXT =
  "Olá, quero solicitar um orçamento para um evento ou ativação.";

export function quoteUrl(extra?: string) {
  const text = extra ? `${QUOTE_TEXT}\n\n${extra}` : QUOTE_TEXT;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

export const clients: { file: string; name: string }[] = [
  { file: "5.png", name: "Jeep" },
  { file: "6.png", name: "Seara" },
  { file: "7.png", name: "Tele Sena" },
  { file: "8.png", name: "Universal Music" },
  { file: "9.png", name: "Roca" },
  { file: "10.png", name: "Fiat" },
  { file: "11.png", name: "iFood" },
  { file: "12.png", name: "Ontex" },
  { file: "13.png", name: "Kiko Milano" },
  { file: "14.png", name: "Listerine" },
  { file: "15.png", name: "Club Social" },
  { file: "16.png", name: "Porsche" },
  { file: "17.png", name: "Vivo" },
  { file: "18.png", name: "Francis" },
  { file: "19.png", name: "Ticket" },
  { file: "20.png", name: "Bradesco" },
  { file: "21.png", name: "Porto Seguro" },
  { file: "22.png", name: "Elo" },
  { file: "23.png", name: "Lacta" },
  { file: "24.png", name: "Abarth" },
  { file: "25.png", name: "Brastemp" },
  { file: "26.png", name: "TikTok" },
  { file: "27.png", name: "Netflix" },
  { file: "28.png", name: "G20 Brasil 2024" },
  { file: "29.png", name: "Suvinil" },
  { file: "30.png", name: "Superbet" },
  { file: "31.png", name: "Santander" },
];

export const differences = [
  {
    title: "Valor, não volume.",
    text: "O perfil entra porque sustenta a linguagem da ação.",
  },
  {
    title: "Gente de bastidor.",
    text: "A seleção nasce de quem já foi promotora e produtora.",
  },
  {
    title: "Do briefing ao piso.",
    text: "Estratégia, agilidade e cuidado até a equipe estar em campo.",
  },
];

export const services = [
  {
    title: "Casting para eventos e ativações",
    text: "A equipe que a marca precisa ver no piso, alinhada ao briefing.",
  },
  {
    title: "Abordagem, blitz, sampling e degustação",
    text: "Presença que para a pessoa certa e entrega a experiência.",
  },
  {
    title: "Receptivo e coordenação",
    text: "Quem recebe, orienta e segura o tom da casa.",
  },
  {
    title: "Produção e supervisão",
    text: "A operação acompanhada, do call ao encerramento.",
  },
  {
    title: "Casting publicitário e audiovisual",
    text: "Perfis para campanha, filme e conteúdo da marca.",
  },
  {
    title: "Projetos especiais",
    text: "Ações fora do roteiro comum, ainda com a mesma escuta.",
  },
];

export const steps = [
  "A agência ou a marca manda o briefing.",
  "A Marini lê contexto, perfil e praça.",
  "A equipe é selecionada e alinhada.",
  "A operação acontece, com supervisão.",
];

export const jobs = [
  {
    src: asset("midias/galeria/photo8.jpg"),
    ratio: "4 / 5",
    brand: "Jeep",
    kind: "Evento",
    alt: "Equipe de preto ao lado do letreiro Jeep e de um Commander.",
  },
  {
    src: asset("midias/galeria/photo4-scaled.jpg"),
    ratio: "3 / 4",
    brand: "Seara",
    kind: "Ativação",
    alt: "Dupla de uniforme laranja no estande Seara.",
  },
  {
    src: asset("midias/galeria/Imagem-do-WhatsApp-de-2024-12-02-as-10.39.13_c31af1c7-scaled.jpg"),
    ratio: "9 / 16",
    brand: "Netflix · Senna",
    kind: "Ativação",
    alt: "Equipe de macacão vermelho com bandeiras Senna e Netflix.",
  },
  {
    src: asset("midias/galeria/photo7.jpg"),
    ratio: "4 / 5",
    brand: "RAM",
    kind: "Ativação",
    alt: "Promotora de uniforme RAM em frente a uma picape.",
  },
  {
    src: asset("midias/galeria/photo2.jpg"),
    ratio: "1170 / 1540",
    brand: "Magnum",
    kind: "Sampling",
    alt: "Profissional entrega uma sacola Magnum no quiosque.",
  },
  {
    src: asset("midias/galeria/photo9.jpg"),
    ratio: "4 / 5",
    brand: "Magnum",
    kind: "Degustação",
    alt: "Dois profissionais apresentam picolé e pote Magnum.",
  },
  {
    src: asset("midias/galeria/photo1.jpg"),
    ratio: "1142 / 1600",
    brand: "UBS",
    kind: "Receptivo",
    alt: "Profissional de preto em frente ao letreiro UBS.",
  },
  {
    src: asset("midias/galeria/photo5.png"),
    ratio: "3 / 4",
    brand: "Denza",
    kind: "Evento",
    alt: "Equipe reunida no estande Denza.",
  },
  {
    src: asset("midias/galeria/466504971_18026279777598922_8629603240788245655_n.jpg"),
    ratio: "4 / 5",
    brand: "Festival",
    kind: "Equipe em campo",
    alt: "Duas profissionais sorrindo em um festival.",
  },
];

export const team = [
  {
    name: "Marisa Marini",
    role: "CEO",
    src: asset("midias/time/2.png"),
  },
  {
    name: "Nicole Rodrigues",
    role: "Produção de Casting",
    src: asset("midias/time/4.png"),
  },
  {
    name: "Cris Jucá",
    role: "Financeiro",
    src: asset("midias/time/3.png"),
  },
  {
    name: "Danna Sitta",
    role: "Produção e Atendimento",
    src: asset("midias/time/conheca-o-time-Marini-Casting-POST-Post-para-Instagram-45.png"),
  },
];
