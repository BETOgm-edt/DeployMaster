# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

static HTML/CSS/JavaScript with Tailwind CSS (CDN), Monaco Editor, Lucide Icons, and GitHub/Vercel REST APIs.

## Users

Desenvolvedores, criadores de conteúdo e designers que precisam criar, editar e publicar sites e aplicações web na Vercel via GitHub de forma instantânea, direto do navegador, sem configurar ambiente local ou pipelines de CI/CD.

## Product Purpose

Prover uma plataforma web leve, gratuita e 100% client-side (sem backend) que combina uma landing page de alta conversão com um ambiente de desenvolvimento (IDE estilo VS Code no navegador) e gerenciador de deploys integrando GitHub e Vercel em 1 clique.

## Positioning

A ponte serverless direta entre repositórios do GitHub e a infraestrutura Edge da Vercel, executada 100% no navegador do usuário, com zero custo, sem necessidade de servidores intermediários ou cadastro obrigatório.

## Operating Context

1. **Landing Page (`home/index.html`):** Apresentação persuasiva da plataforma, destacando a proposta de valor, o fluxo em 3 etapas, métricas de velocidade e casos de uso.
2. **Dashboard / Web IDE (`index.html`):** Aplicação interativa com explorer de arquivos, Monaco Editor, console de logs/terminal e acompanhamento de status de deploys em tempo real.

## Capabilities and Constraints

- **Segurança & Armazenamento:** Tokens do GitHub e Vercel mantidos exclusivamente em `localStorage` no navegador do usuário.
- **IDE no Navegador:** Monaco Editor (engine do VS Code) com suporte a múltiplos arquivos, busca e árvore de repositório.
- **Deploys em 1 Clique:** Criação automatizada de repositórios no GitHub e vínculos com projetos Vercel via REST API.
- **Status em Tempo Real:** Polling automático de readyState na Vercel (READY, BUILDING, ERROR).

## Brand Commitments

- **Nome:** Deploymaster (ou DeployMaster v2)
- **Assinatura Visual:** Modo escuro minimalista, superfícies de vidro (glassmorphism), tipografia limpa (Inter & JetBrains Mono), acentos em verde esmeralda (`#34D399`) e alto contraste.
- **Slogan / Proposta:** "Seu projeto online. Sem complicação."

## Evidence on Hand

- `home/index.html`: Base da Landing Page (Hero, Como funciona, Console preview, Velocidade, Casos de uso, CTA final).
- `index.html`: Aplicação Web / IDE / Dashboard principal.
- `README.md`: Especificação técnica, recursos e instruções de uso.

## Product Principles

1. **Zero Fricção:** Sem cadastro, sem backend, uso imediato.
2. **Clareza & Autoridade Visual:** Interface rápida, previsível, com feedback visual em tempo real para cada ação de deploy.
3. **Foco no Resultado:** Reduzir ao mínimo o tempo entre o código e o projeto online.
