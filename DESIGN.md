---
name: Deploymaster
description: Zero-friction, client-side deployment platform integrating GitHub & Vercel
colors:
  primary: "#FFFFFF"
  neutral-bg: "#050505"
  surface: "#0A0A0A"
  surface-hover: "#141414"
  border: "rgba(255, 255, 255, 0.06)"
  border-hover: "rgba(255, 255, 255, 0.15)"
  accent: "#34D399"
  accent-muted: "rgba(52, 211, 153, 0.2)"
  secondary-text: "#A3A3A3"
  tertiary-text: "#525252"
typography:
  stat:
    fontFamily: "Inter, sans-serif"
    fontSize: "8rem"
    fontWeight: 800
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: "1.6"
  mono:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
  label-micro:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "10px"
    fontWeight: 500
  label-small:
    fontFamily: "JetBrains Mono, monospace"
    fontSize: "11px"
    fontWeight: 500
rounded:
  xs: "4px"
  sm: "6px"
  md: "12px"
  lg: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.secondary-text}"
---

# Design System: Deploymaster

## Overview

**Creative North Star: "The Obsidian Command Center"**

Deploymaster opera como um ambiente de comando minimalista de altíssima precisão. Sua estética combina a profundidade da cor obsidiana (`#050505`) com superfícies de vidro fosco de refração sutil, realçadas por acentos em verde esmeralda (`#34D399`) para simbolizar o status ativo, deploys bem-sucedidos e execução sem atrito. A experiência visual transmite velocidade instantânea, segurança *client-side* e sofisticação de nível pro-developer.

**Key Characteristics:**
- Fundo obsidian ultra-escuro com iluminação radial muito sutil.
- Vidro fosco (*glassmorphic panels*) com bordas translúcidas de 1px.
- Tipografia contrastante entre a clareza da sans-serif Inter e a precisão técnica da JetBrains Mono.
- Verde Esmeralda como única cor vibrante de destaque (usada exclusivamente para ação, status live e confirmação).

## Colors

A paleta é estritamente monocromática e focada na legibilidade técnica, com apenas um acento vibrante de alta visibilidade.

### Primary
- **Obsidian Core White** (`#FFFFFF`): Reservado para títulos principais, botões CTA primários e texto ativo de alto impacto.

### Accent
- **Emerald Pulse** (`#34D399`): Representa o status "Online", pipelines ativos, logs bem-sucedidos e brilho de foco. Usado com parcimônia para manter seu valor de atenção.
- **Emerald Tint** (`rgba(52, 211, 153, 0.2)`): Utilizado para backgrounds de badges, indicadores de status e efeitos glowing.

### Neutral
- **Void Background** (`#050505`): O plano de fundo absoluto da aplicação.
- **Glass Surface** (`#0A0A0A` / `rgba(10, 10, 10, 0.6)`): Camada base para cards, modais e containers.
- **Surface Hover** (`#141414`): Estado interativo para cards e linhas de tabelas.
- **Subtle Border** (`rgba(255, 255, 255, 0.06)`): Delimitador quase invisível para estruturas e divisores.
- **Border Hover** (`rgba(255, 255, 255, 0.15)`): Realce de borda em hover.
- **Secondary Text** (`#A3A3A3`): Descrições, subtítulos e labels secundárias.
- **Tertiary Text** (`#525252`): Metadados de menor prioridade, ícones inativos e comentários de código.

### Named Rules
**The Single Accent Rule.** A cor verde esmeralda (`#34D399`) deve cobrir no máximo 5% da superfície visual da tela em qualquer momento. Seu valor reside no contraste imediato contra o fundo preto.

## Typography

**Display Font:** Inter (`sans-serif`)
**Body Font:** Inter (`sans-serif`)
**Label/Mono Font:** JetBrains Mono (`monospace`)

### Hierarchy
- **Stat Display** (Bold 800, `8rem`, 1): Utilizado nos contadores gigantes de performance ("0s", "100%", "0.0s").
- **Display** (Bold 700, `clamp(2.5rem, 5vw, 4.5rem)`, 1.1): Utilizado nos títulos do Hero e seções de grande impacto.
- **Headline** (SemiBold 600, `1.875rem` / `2.25rem`, 1.2): Títulos de seções funcionais e cards de destaque.
- **Title** (Medium 500 / SemiBold 600, `1.25rem`, 1.4): Títulos de recursos individuais e headers de tabela.
- **Body** (Regular 400, `1rem`, 1.6): Textos explicativos e narrativos de fluxo.
- **Label / Code Mono** (Regular 400 / Medium 500, `0.875rem` / `0.75rem` / `10px` / `11px`, `JetBrains Mono`): Utilizado para snippets de terminal, caminhos de arquivo, badges de status, comandos de CLI e contadores.

### Named Rules
**The Monospaced Reality Rule.** Todo dado dinâmico, tempo de execução, log de terminal, caminho de arquivo ou valor numérico de performance DEVE ser renderizado em JetBrains Mono.

## Layout

- **Container Máximo:** 1280px (`max-w-7xl`) centralizado com padding lateral responsivo de 24px (`px-6`).
- **Grid de Seções:** Estrutura responsiva adaptando-se de 1 coluna em mobile para 2 ou 3 colunas em desktop (`grid-cols-1 md:grid-cols-3`).
- **Ritmo Vertical:** Espaçamento generoso entre seções (mínimo `96px` / `py-24`) para proporcionar respiro e leitura fluida.
- **Grid de Fundo:** Padrão sutil de linhas de 40px com gradiente de máscara suave.

## Elevation & Depth

Deploymaster utiliza **Depth via Glassmorphism and Borders** ao invés de sombras difusas tradicionais.

### Named Rules
**The Flat Glass Rule.** As superfícies não flutuam com sombras pretas pesadas; o sentimento de camada vem da transparência de vidro (`backdrop-filter: blur(12px)`) e da borda fina translúcida (`border: 1px solid rgba(255, 255, 255, 0.06)`).

## Shapes

- **Botões CTA Principais:** Pílula completa (`rounded-full` / `9999px`).
- **Cards e Terminais:** Canto arredondado suave de 12px a 16px (`rounded-xl` / `rounded-2xl`).
- **Badges e Tags:** Cantos pílula (`rounded-full`) ou pequenos de 6px (`rounded-md`).
- **Divisores:** Linhas finas de 1px com transparência de 5% a 10%.

## Components

### Buttons
- **Primary CTA:** Fundo branco (`#FFFFFF`), texto preto (`#050505`), formato pílula, transição com leve hover zoom (`scale-105`) e sombra de brilho.
- **Secondary / Ghost:** Fundo transparente com borda translúcida, texto branco, hover em `#141414`.

### Terminal Mockup
- **Estilo:** Card escuro com barra superior contendo controles estilo macOS (três pontos discretos: vermelho, amarelo, verde) e título em código mono.
- **Conteúdo:** Texto simulando `git commit`, `vercel deployment` e `STATUS: 200 OK` com blinking cursor verde.

### Status Badge
- **Estilo:** Fundo verde translúcido (`rgba(52, 211, 153, 0.1)`), texto verde (`#34D399`), ponto pulsante animado.

## Do's and Don'ts

### Do:
- **Do** manter a interface limpa, focada em código e deploys reais.
- **Do** usar animações suaves com cubic-bezier (`cubic-bezier(0.16, 1, 0.3, 1)`).
- **Do** garantir que todos os dados simulados (logs, estatísticas) pareçam reais e autênticos para desenvolvedores.

### Don't:
- **Don't** adicionar cores vibrantes fora da paleta (evitar azuis neon, roxos ou vermelhos chamativos desnecessários).
- **Don't** utilizar sombras pesadas ou estilos skeuomórficos antigos.
- **Don't** esconder as ações primárias de deploy atrás de menus ou etapas desnecessárias.
