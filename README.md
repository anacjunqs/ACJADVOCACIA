# ACJ Advocacia — site institucional (PT/EN)

Site bilíngue de um escritório de Direito de Família e Sucessões para famílias que vivem entre países.
Objetivo único: gerar pedidos de consulta qualificados.

**Tecnologia:** Next.js 16 (App Router) · TypeScript estrito · Tailwind CSS 4 · next-intl · Sanity (painel de edição) · Resend (e-mail do formulário) · Vercel.

> **Antes de tudo:** enquanto `NEXT_PUBLIC_SITE_INDEXABLE` não for `true`, o site pede aos buscadores que **não** o indexem. Só vire essa chave no lançamento, depois de resolver todas as pendências (veja [Lançamento](#7-lançamento)).

## Índice

1. [Para a fundadora: como editar o site](#1-para-a-fundadora-como-editar-o-site)
2. [O que precisa estar pronto (pré-requisitos)](#2-o-que-precisa-estar-pronto-pré-requisitos)
3. [Configuração passo a passo](#3-configuração-passo-a-passo)
4. [Variáveis de ambiente](#4-variáveis-de-ambiente)
5. [Deploy na Vercel](#5-deploy-na-vercel)
6. [Depoimentos (avaliações do Google)](#6-depoimentos-avaliações-do-google)
7. [Lançamento](#7-lançamento)
8. [Para quem desenvolve](#8-para-quem-desenvolve)
9. [O que não foi possível verificar durante a construção](#9-o-que-não-foi-possível-verificar-durante-a-construção)

---

## 1. Para a fundadora: como editar o site

Tudo o que é texto do site se edita no **painel**, sem programar e sem novo deploy. Abra `https://SEU-SITE/studio` e entre com o e-mail do convite.
Ao **Publicar**, o site se atualiza sozinho em poucos instantes.

### Regras de ouro para os textos

- Linguagem simples, frases curtas, e explique cada termo jurídico na primeira vez que ele aparecer.
- **Nunca** use: "premium", "exclusivo", "elite", "VIP", "alto padrão", "o melhor", "garantido", "100%", nem qualquer promessa ou sugestão de resultado, valores, gratuidade ou descontos.
- Nada de menção a clientes ou casos. Nada de depoimentos escritos por você.
- Quando um texto tem **`[PREENCHER: ...]`**, falta uma informação sua. Quando tem **`[REVISAR JURIDICAMENTE]`**, é um rascunho que precisa da sua revisão.
  Revise, corrija e **apague o marcador**. Em produção, o painel **não deixa publicar** um texto que ainda tenha esses marcadores.
- Todo campo tem **português** e **inglês**. Se o inglês ficar vazio, o site mostra o português naquele trecho (marcado como português para leitores de tela).
- Toda imagem precisa de **texto alternativo** (descreva a imagem para quem não a vê). O painel não deixa publicar sem ele.

### O que editar e onde

| Quero mudar… | Onde no painel |
|---|---|
| Nome, contatos, WhatsApp, endereço, horário, redes, etapas do atendimento, rodapé, aviso da OAB | **Configurações do escritório** (aparece só para Administrador) |
| Título e subtítulo da página inicial, textos de apresentação das páginas | **Textos das páginas** |
| Biografia, foto, trajetória, formação, idiomas, associações, citação | **Sobre a Fundadora** |
| Os valores do escritório (de 4 a 8, arrastando para reordenar) | **Nossos Valores** |
| Introdução, "para quem é", "quando procurar" e perguntas frequentes de cada área | **Áreas de atuação (textos e perguntas)** |
| Política de Privacidade, Termos de Uso, Cookies | **Páginas legais** |
| Artigos | **Artigos** |
| Vídeos | **Vídeos** |

### Editar a biografia e os valores

1. Abra **Sobre a Fundadora** (ou **Nossos Valores**).
2. Edite os campos em português e em inglês.
3. Clique em **Publicar**. Pronto: o site atualiza sozinho.

Seções sem conteúdo simplesmente não aparecem no site.

### Publicar um artigo

1. **Artigos → Todos os artigos → Novo**.
2. Escolha o **idioma** (cada idioma é um artigo separado).
3. Preencha título, resumo (até 200 caracteres), categoria, data e o texto. O texto aceita títulos, listas, citações, imagens (com texto alternativo) e tabelas.
4. Se o artigo tem tradução, escolha o outro artigo em **Tradução de**. O site liga os dois e oferece o link "Ler este artigo em…".
5. Opcional: **Área de atuação relacionada** (cria um link para a área) e **Vídeo relacionado**.
6. Clique em **Publicar**. O índice do artigo, o tempo de leitura e o compartilhamento são automáticos.

Um artigo salvo e não publicado fica como **rascunho** e não aparece no site.

### Adicionar um vídeo

1. **Vídeos → Novo**.
2. Cole o link do YouTube ou do Vimeo. Preencha título, descrição, categoria, idioma e (se quiser) a área relacionada.
3. **Publicar**. Para anexar o vídeo a um artigo ou a uma área, use o campo **Vídeo relacionado** de lá.

O vídeo só começa a carregar depois que a pessoa clica nele e permite o conteúdo do YouTube/Vimeo.

### Pré-visualizar antes de publicar

No painel, abra a aba **Presentation** (pré-visualização): você vê a página com o seu rascunho, ao lado do editor. Para sair do modo de pré-visualização no site, use o botão "Sair da pré-visualização".

### Convidar um editor

Quem administra o projeto convida pelas configurações do projeto no Sanity (veja [3.1](#31-sanity-painel-de-edição)). **Editor** cuida do conteúdo; **Administrador** também cuida das configurações.

---

## 2. O que precisa estar pronto (pré-requisitos)

Quem providencia está na coluna da direita. Marque conforme for concluindo.

| Item | Para quê |
|---|---|
| ☐ Projeto **Sanity** (plano gratuito) | Painel de edição |
| ☐ Conta **Resend** com **domínio verificado** | E-mail do formulário de contato |
| ☐ Projeto **Vercel** no plano **Pro** | Hospedagem. O plano gratuito (Hobby) é restrito a uso pessoal e não comercial |
| ☐ **Domínio** do site | Endereço e e-mail |
| ☐ Projeto **Google Cloud** com cobrança e **Places API (New)** ativas, e chave de API | Só se for ligar as avaliações do Google |
| ☐ **Place ID** do perfil da empresa no Google | Idem |
| ☐ **Logotipo** em SVG | Troca do nome em tipografia (opcional) |
| ☐ **Foto** da fundadora | Página inicial e Sobre |
| ☐ Número de **WhatsApp** (com código do país e DDD) | Botões de WhatsApp |
| ☐ **E-mail** que recebe os contatos | Variável `CONTACT_TO_EMAIL` |
| ☐ Endereço, horário, **fuso** e redes sociais | Página de Contato e rodapé |
| ☐ Quem é o **controlador de dados** (nome, documento, endereço) e o canal para pedidos da LGPD | Política de Privacidade |
| ☐ **Onde a fundadora pode exercer a advocacia** | Aviso de jurisdição |
| ☐ Decisão sobre **estatísticas** (Plausible ou GA4) | Opcional |

A lista completa e atualizada do que falta no **conteúdo** está em [`PENDENCIAS.md`](PENDENCIAS.md) (gerado por `npm run audit:content`).

---

## 3. Configuração passo a passo

> Os nomes de menus dos serviços externos mudam com o tempo. Em caso de dúvida, procure pelo termo em itálico na documentação do serviço.

### 3.1 Sanity (painel de edição)

1. Em [sanity.io/manage](https://www.sanity.io/manage), crie um projeto. Anote o **Project ID**. Use o dataset `production`.
2. **API → CORS origins → Add**: acrescente `https://SEU-SITE` e `http://localhost:3000`, **marcando "Allow credentials"**. Sem isso o painel não carrega no site.
3. **API → Tokens**:
   - crie um token **Viewer** (leitura) e use como `SANITY_API_READ_TOKEN`. Serve só para pré-visualizar rascunhos;
   - crie um token **Editor** (escrita) apenas para a importação inicial (passo 7). **Não** cadastre esse na Vercel.
4. **Membros**: convide as pessoas pelo e-mail. Papéis padrão: **Administrador** e **Editor**.
   - A tela "Configurações do escritório" é escondida para quem não é Administrador. Isso organiza a interface, mas **não é uma permissão de segurança**. Papéis personalizados com permissões finas costumam depender de plano pago; confira o plano atual.
5. **API → Webhooks → Create**:
   - **URL:** `https://SEU-SITE/api/revalidate`
   - **Dataset:** `production` · **Trigger on:** Create, Update, Delete · **Drafts:** desligado
   - **Filter:** `_type in ["siteSettings","founder","valuesList","pageTexts","pillarContent","legalPage","article","articleCategory","video"]`
   - **Projection:** `{_type, "slug": slug.current, language, pillarId, pageId}`
   - **HTTP method:** POST · **Secret:** o mesmo valor de `SANITY_REVALIDATE_SECRET`
6. Cadastre as variáveis do Sanity (seção 4) no seu `.env.local` e na Vercel.
7. **Importar os textos de exemplo** (uma vez, no seu computador, com o token de escrita):
   ```bash
   npm run seed:sanity:dry   # mostra o que será criado
   npm run seed:sanity       # cria, sem sobrescrever nada que já exista
   ```
   Os artigos e o vídeo de exemplo entram como **rascunho**.

Sem nenhuma variável do Sanity o site funciona normalmente, com os textos de `/content/seed`.

### 3.2 Resend (formulário de contato)

1. Em [resend.com](https://resend.com), adicione e **verifique o domínio** (registros SPF e DKIM no DNS; configure também DMARC).
2. Crie uma chave de API (`RESEND_API_KEY`).
3. Defina `CONTACT_FROM_EMAIL` (remetente em um endereço do domínio verificado, ex.: `ACJ Advocacia <contato@seudominio.com.br>`) e `CONTACT_TO_EMAIL` (quem recebe).
4. Gere o segredo do formulário: `openssl rand -hex 32` → `CONTACT_FORM_SECRET`.

O formulário **só envia um e-mail**. As mensagens não ficam em banco de dados do site. O provedor de e-mail, porém, mantém registros de envio: cite-o na Política de Privacidade (campo **Páginas legais**).

### 3.3 Limite de envios (anti-spam)

O site já tem honeypot, tempo mínimo de preenchimento, validação e um limite por IP **em memória** (vale por instância do servidor). Para proteção de verdade, crie também uma regra no **Firewall da Vercel**:
*Project → Firewall → Add rule → Rate limit*, nos caminhos `/pt/contato` e `/en/contact`, método `POST`, por exemplo 5 requisições a cada 10 minutos por IP. (Confira a disponibilidade no seu plano.)

### 3.4 WhatsApp

Cadastre o número em **Configurações do escritório → WhatsApp**, somente dígitos com código do país e DDD (ex.: `5562900000000`). O texto pré-preenchido (PT/EN) está no mesmo lugar.

### 3.5 Estatísticas (opcional)

Só carregam **depois do consentimento**.
- **Plausible** (sugerido: sem cookies): `NEXT_PUBLIC_ANALYTICS_PROVIDER=plausible` e `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=seudominio.com.br`.
- **GA4:** `NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4` e `NEXT_PUBLIC_GA4_ID=G-XXXXXXX`.

Se escolher uma ferramenta, atualize a lista de cookies na página **Cookies** (campo **Páginas legais**).

### 3.6 Mapa (opcional)

Sem configuração, a página de Contato mostra o link "Abrir no mapa". Para incorporar o mapa (com consentimento), ative a *Maps Embed API* no Google Cloud, crie uma chave **restrita por referenciador HTTP** ao seu domínio e cadastre `NEXT_PUBLIC_MAPS_EMBED_KEY`. O endereço para o mapa vai em **Configurações do escritório → Endereço**.

---

## 4. Variáveis de ambiente

Cadastre na Vercel (*Settings → Environment Variables*) e, para desenvolver, em `.env.local` (modelo: [`.env.example`](.env.example)).
Variáveis `NEXT_PUBLIC_*` são embutidas no build: **mudar o valor exige novo deploy**.
O site compila e roda **sem nenhuma** delas, usando `/content/seed`.

| Variável | Para quê |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Endereço público (links, sitemap, Open Graph) |
| `NEXT_PUBLIC_SITE_INDEXABLE` | `false` (padrão): `noindex` + `robots` bloqueando tudo. `true` só no lançamento |
| `SHOW_SEED_DRAFTS` | Mostra os artigos/vídeo de exemplo. Padrão: ligado fora de produção |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION` | Ligam o painel de edição |
| `SANITY_API_READ_TOKEN` | Pré-visualização de rascunhos (somente servidor) |
| `SANITY_API_WRITE_TOKEN` | Só local, para `npm run seed:sanity`. Nunca na Vercel |
| `SANITY_REVALIDATE_SECRET` | Segredo do webhook que atualiza o site ao publicar |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_FORM_SECRET` | Formulário de contato |
| `NEXT_PUBLIC_ENABLE_TESTIMONIALS` | `false` (padrão). Veja a seção 6 |
| `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID` | Avaliações do Google (somente servidor) |
| `GOOGLE_REVIEWS_URL_OVERRIDE`, `GOOGLE_WRITE_REVIEW_URL_OVERRIDE` | Opcionais: trocam os links derivados do Place ID |
| `NEXT_PUBLIC_ANALYTICS_PROVIDER`, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_GA4_ID` | Estatísticas (após consentimento) |
| `NEXT_PUBLIC_MAPS_EMBED_KEY` | Mapa incorporado (após consentimento) |

---

## 5. Deploy na Vercel

1. **Add New → Project** e importe este repositório. Framework: Next.js (detectado). Node: 22 ou superior.
2. Cadastre as variáveis de ambiente (Production e Preview).
3. **Deploy.** O build roda `npm run build`, que inclui a [trava de lançamento](#7-lançamento).
4. Em *Domains*, adicione o domínio e ajuste o DNS conforme a Vercel indicar.
5. Faça o primeiro teste num **deploy de Preview** (com `NEXT_PUBLIC_SITE_INDEXABLE=false`): painel em `/studio`, envio do formulário, publicação de um texto (o site deve atualizar sozinho).

Cabeçalhos de segurança (HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy) já vêm configurados em `next.config.ts`.

---

## 6. Depoimentos (avaliações do Google)

**Desligado por padrão.** Com `NEXT_PUBLIC_ENABLE_TESTIMONIALS=false`: a rota `/depoimentos` responde 404, o item some do menu e da página inicial, e o site **não faz nenhuma chamada ao Google**.

**Só ligue com confirmação por escrito da advogada**, que depende de validação com a OAB.

Para ligar:
1. No Google Cloud, ative a **Places API (New)** (com cobrança) e crie uma chave restrita a essa API → `GOOGLE_PLACES_API_KEY`.
2. Encontre o **Place ID** do perfil (ferramenta *Place ID Finder* do Google) → `GOOGLE_PLACE_ID`.
3. Troque `NEXT_PUBLIC_ENABLE_TESTIMONIALS` para `true` e faça novo deploy.

Como funciona: mostra a nota média, o total e até 5 avaliações (estrelas, texto original sem alteração, nome como o Google entrega, data relativa), sempre com a fonte "Google". Sem fotos de avaliadores. Os botões "Ver avaliações no Google" e "Avaliar no Google" usam links derivados do Place ID. Se a API falhar ou não houver chave, a seção some sem erro e fica só o botão "Ver avaliações no Google". Não há `aggregateRating` nem `Review` nos dados estruturados, e não é possível escolher ou esconder avaliações individuais.

**Atenção:** a página reutiliza a resposta do Google por até 12 horas (cache do Next). Os termos do Google Maps Platform restringem o armazenamento em cache de conteúdo da API. **Confira os termos vigentes antes de ligar**; se necessário, reduza o cache em `src/lib/reviews/google.ts` (`REVIEWS_REVALIDATE_SECONDS`) ou renderize sem cache.

---

## 7. Lançamento

1. Resolva as pendências: `npm run audit:live` (ou `npm run audit:content`, enquanto o painel não estiver em uso). Cada `[PREENCHER]`, cada `[REVISAR JURIDICAMENTE]` e cada campo obrigatório vazio precisa ser resolvido.
2. Revise as conferências manuais ao final de [`PENDENCIAS.md`](PENDENCIAS.md) (títulos em inglês dos serviços, logotipo, redes).
3. Teste no Preview: formulário (chega o e-mail?), publicação no painel (o site atualiza?), seletor PT/EN, banner de cookies.
4. Mude `NEXT_PUBLIC_SITE_INDEXABLE` para `true` e faça novo deploy. **A trava de lançamento falha o build se ainda houver pendências**, listando o que falta.
5. Cadastre o domínio no Google Search Console e envie `https://SEU-SITE/sitemap.xml`.
6. Mantenha os depoimentos desligados até a confirmação por escrito.

---

## 8. Para quem desenvolve

### Comandos

```bash
npm install
npm run dev            # http://localhost:3000
npm run check          # lint + typecheck + testes unitários + termos proibidos
npm run build && npm start
npm run test:e2e       # Playwright (compila o site; usa um Resend simulado)
npm run audit:content  # gera PENDENCIAS.md
npm run check:words    # varre os textos atrás de termos proibidos
npm run seed:sanity:dry
```

Medir o Lighthouse (precisa do site indexável, senão o SEO cai):
```bash
SKIP_LAUNCH_GATE=true NEXT_PUBLIC_SITE_INDEXABLE=true NEXT_PUBLIC_SITE_URL=http://localhost:3000 npm run build
SHOW_SEED_DRAFTS=false npm start &
npm run perf
```
(`SKIP_LAUNCH_GATE` só existe para testes e medições.)

### Estrutura

```
content/services.ts    catálogo de serviços (fornecido; não alterar a estrutura)
content/seed/          textos de exemplo e dados autorizados (usados quando o CMS não está configurado)
messages/              textos de interface (botões, rótulos, erros), PT e EN
src/app/(site)/[locale]/   páginas públicas localizadas
src/app/(studio)/studio/   painel Sanity embutido
src/app/api/               revalidate (webhook), draft-mode, form-token
src/lib/content/       camada de dados: Sanity quando configurado, seed quando não
src/lib/i18n/          rotas localizadas (pathnames), seletor de idioma
src/lib/form/          validação, token de tempo mínimo, limite por IP, e-mail
src/lib/reviews/       avaliações do Google (atrás da flag)
src/sanity/            schemas, estrutura do painel, clientes
scripts/               importação do seed, auditoria, trava de lançamento, medições
tests/unit, tests/e2e  Vitest e Playwright
```

### Decisões técnicas

- **Conteúdo:** nenhum texto factual fica em componentes. Dados autorizados e rascunhos ficam em `content/seed`; interface em `messages`. O catálogo `content/services.ts` é consumido sem alterações.
- **Rotas localizadas:** `next-intl` com `pathnames`. Os endereços dos pilares e do hub vêm de `path` em `services.ts`. Não há cookie de idioma (nenhum cookie antes do consentimento).
- **Cache:** páginas estáticas com tags; o webhook do Sanity chama `/api/revalidate`. Erros de rede do Sanity **não** substituem a última página boa por textos de exemplo.
- **Consentimento:** cookie próprio `acj_consent`. Estatísticas, vídeo e mapa de terceiros só carregam depois do "sim". Miniaturas de vídeo são buscadas pelo servidor (o navegador não contata o YouTube antes do consentimento).
- **CSP:** estática (sem nonce, que forçaria renderização dinâmica) com `script-src 'self' 'unsafe-inline'` e sem `'unsafe-eval'`. O Studio tem uma política própria, mais aberta, só na rota `/studio`.
- **Listas de artigos/vídeos:** filtro, busca e paginação rodam no navegador sobre a lista já carregada (página estática, sem pulo de layout), com estado na URL.
- **Datas, nomes de países e outros textos gerados por `Intl`** são montados no servidor e enviados prontos, porque o ICU do navegador difere do Node e causa erro de hidratação.
- **Sanity:** valores como lista dentro de um documento único (arrastar e soltar nativo, 4 a 8 itens); documentos de conjunto fixo (áreas, páginas legais) são criados pela importação do seed.

### Qualidade

- Lint e typecheck sem avisos.
- Testes unitários: catálogo, contraste dos tokens, palavras proibidas, regras de conteúdo, i18n, formulário (inclui a ação de servidor), avaliações do Google, trava de lançamento, mapeamento seed ↔ CMS.
- Testes e2e (celular e desktop): todas as rotas em PT e EN com **axe (WCAG 2.1 AA) sem violações**, hreflang, erros de console e de CSP, cabeçalhos, formulário, consentimento, depoimentos desligados.
- Lighthouse (celular): ≥ 90 em Desempenho, Acessibilidade, Boas práticas e SEO nas páginas principais.
- Nenhum texto dourado sobre fundo claro (verificado por teste de contraste dos tokens e por varredura do código).

---

## 9. O que não foi possível verificar durante a construção

O ambiente em que o site foi construído não alcança `sanity.io` nem `resend.com`. Por isso:

- **Painel Sanity ao vivo** (login, publicar, webhook, pré-visualização) foi coberto por testes com dados simulados e por revisão dos tipos, **não** por um teste real. Faça o roteiro do passo 5 da seção 5 no primeiro Preview.
- **Envio real de e-mail** foi testado com um servidor Resend simulado (ponta a ponta, no navegador). Falta um teste real com o domínio verificado.
- **Avaliações do Google** foram testadas com respostas simuladas.
- **Firewall da Vercel** (limite de envios) precisa ser criado por você (seção 3.3).
- O `npm audit` aponta vulnerabilidades em dependências indiretas do pacote `sanity` (ferramentas de linha de comando e de build do painel, não o código que roda para os visitantes). A correção automática exigiria **rebaixar** o Sanity (mudança incompatível). Reavalie ao atualizar o Sanity.
