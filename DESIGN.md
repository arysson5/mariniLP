---
name: Marini Casting
description: Landing fotográfica para marcas pedirem a equipe que sustenta a ação ao vivo.
colors:
  navy: "#1C226E"
  navy-deep: "#121648"
  coral: "#C35E5E"
  silk: "#F6F3EF"
  white: "#FFFFFF"
typography:
  display:
    fontFamily: "Hind, sans-serif"
    fontSize: "3rem"
    fontWeight: 600
    lineHeight: 1.05
  headline:
    fontFamily: "Hind, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: "Hind, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.16em"
rounded:
  pill: "999px"
  none: "0px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "48px"
  section: "112px"
components:
  button-quote:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "46px"
    padding: "0 24px"
  button-quote-pressed:
    backgroundColor: "{colors.navy-deep}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    height: "46px"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "11px 13px"
---

# Design System: Marini Casting

## Overview

**Creative North Star: "A equipe em campo"**

A página é uma prova fotográfica para quem contrata. Navy carrega a autoridade da casa. Coral é o detalhe da marca, raro. A seda clara dá respiro entre as faixas escuras. A fotografia de gente real é o conteúdo, não um fundo decorativo.

O visitante principal é a marca ou a agência. O talento existe numa porta mais baixa, por e-mail, sem disputar o pedido de orçamento. Não há números inventados, sobrancelha acima do título, contador de seção nem seta de "role".

**Key Characteristics:**

- Fotos reais de job, logo e time. Sem banco de imagem.
- Um só botão de compra, em metal líquido, com o rótulo "Solicitar orçamento".
- Hind nos títulos, Roboto no texto, ambas hospedadas no projeto.
- Movimento curto, em transform e opacidade. A intro da logo é a única cena longa, e só uma vez por visita.

## Colors

Navy e coral vêm do logo. O branco e a seda existem para a foto respirar.

### Primary

- **Navy da marca** (#1C226E): títulos no claro, faixas de clientes e de contato, header depois da rolagem.
- **Navy profundo** (#121648): miolo do botão, rodapé e a sombra tinta.

### Secondary

- **Coral da marca** (#C35E5E): cantoneira da logo, separador dos estados, sublinhado de link e o número do método. Não pinta bloco inteiro.

### Neutral

- **Seda** (#F6F3EF): fundo das faixas claras, com a foto de seda bem velada por cima.
- **Branco** (#FFFFFF): texto sobre foto e sobre navy, e a superfície dos serviços e do time.

### Named Rules

**A cor do logo não vira enfeite.** Coral marca um detalhe. Navy ocupa a faixa. Os dois não se misturam num degradê de texto.

## Typography

**Display Font:** Hind (sans-serif)
**Body Font:** Roboto (sans-serif)

**Character:** Hind é o nome da casa, firme e largo. Roboto é a fala corrida, sem pose de startup.

### Hierarchy

- **Display** (600, até 3.75rem, line-height 1.05): a promessa do hero.
- **Headline** (600, 2.25rem a 3rem): título de seção.
- **Title** (600, 1.5rem): bloco de serviço, diferença ou pessoa.
- **Body** (400, 1rem, line-height 1.6): parágrafo, medida curta.
- **Label** (500, 0.875rem, tracking 0.16em, caixa alta): a faixa dos estados.

## Layout

Uma coluna até o tablet. O miolo para em 72rem. O hero ocupa a primeira dobra, com a frase embaixo à esquerda sobre a foto da Porto.

A sequência é fixa: hero, estados, logos, diferença, serviços, método, jobs, origem, time, talentos, contato. Jobs é a maior faixa. Talentos fica mais quieto que o hero. No celular, a galeria rola na horizontal. A partir de 900px, o método e os jobs acompanham o scroll.

## Elevation & Depth

Sombra só com deslocamento e desfoque, tinta navy, nunca preto neutro. O botão usa `0 10px 18px rgba(18, 22, 72, 0.2)`. Os passos do método usam uma sombra mais baixa. O header, quando fica sólido, ganha `0 8px 18px rgba(18, 22, 72, 0.28)`.

## Shapes

Quase tudo é reto. O único raio cheio é o botão de orçamento, uma pílula de 46px de altura. Fotos de job e retratos não têm máscara.

## Components

- **Orçamento.** Metal líquido com miolo navy, rótulo branco e brilho puxado para o coral. Aparece no hero, no contato e, no celular, numa barra fixa depois que a página rola. Abre o WhatsApp 11 99492-9630. Pressão em 160ms, escala 0.97. Hover só com mouse fino. Com movimento reduzido, o metal fica parado.
- **Faixa de estados.** Texto navy em caixa alta sobre a seda, separador coral, sentido contrário, cerca de 22s. Com movimento reduzido, os sete nomes quebram a linha e param.
- **Faixa de clientes.** Logos brancos sobre navy, `mix-blend-mode: screen`, 56px de altura, volta de cerca de 40s. O hover alonga a volta só no mouse fino.
- **Campo.** No contato, borda branca translúcida, texto branco, cantos retos. O envio monta a mensagem e abre o mesmo WhatsApp.
- **Talentos.** Link de texto para casting01@marinicasting.com.br. Sem o botão de metal.

## Do's and Don'ts

- Faça a foto do job ser o argumento.
- Faça o rótulo do orçamento ser sempre "Solicitar orçamento".
- Faça a logo branca no header com `mix-blend-mode: screen`, porque o arquivo tem fundo preto.
- Não publique contagem antiga de eventos ou de promotores.
- Não use ilustração genérica de equipe, véu extra sobre os retratos, ícone de estoque nos serviços ou logo de demonstração.
- Não anime com `transition: all`, escala a partir de zero ou ease-in.
- Não repita a mesma família de movimento em duas seções vizinhas.
