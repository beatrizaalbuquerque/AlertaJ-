# AlertaJá

Aplicação web acadêmica desenvolvida para a Global Solution da FIAP. O AlertaJá
reúne informações comunitárias sobre alagamentos e condições meteorológicas
para a região piloto de Itaquaquecetuba, SP.

## Aplicação

O front-end permite consultar o dashboard, visualizar relatos no mapa, filtrar
ocorrências por status, registrar e gerenciar relatos autenticados, consultar
condições meteorológicas e acessar as páginas de abrigos, rotas e orientações.
Abrigos e pontos de apoio só serão listados quando houver dados oficiais
cadastrados. A página de rotas informa que o projeto ainda não dispõe de rede
viária nem algoritmo de roteamento; não apresenta rotas fictícias.

## Tecnologias

- React 19, JavaScript e Vite 8.
- Tailwind CSS 4.
- React Router e React Leaflet/Leaflet.
- API separada em Node.js, Express e SQLite.
- Open-Meteo para condições meteorológicas atuais.

Requisito de execução do Vite instalado: Node.js `^20.19.0` ou `>=22.12.0` e npm.

## Estrutura principal

```text
src/
  App.jsx
  index.css
  assets/
    components/  # Componentes de layout, formulários, listas e mapa
    data/        # Conteúdo estático aprovado pelo grupo
    hooks/       # Autenticação, região, relatos e meteorologia
    pages/       # Páginas da aplicação
    services/    # Comunicação HTTP com a API
server/
  controllers/
  db/
  geo/
  middlewares/
  routes/
  services/
  tests/
```

## Instalação e execução

Na raiz do repositório:

```bash
npm install
```

Para executar API e front-end juntos:

```bash
npm run dev
```

O Vite informa no terminal a URL local (normalmente `http://localhost:5173`,
ou a próxima porta livre). A API usa `http://localhost:3000/api` por padrão.

Se a API já estiver iniciada separadamente, execute somente o front-end:

```bash
npm run dev:frontend
```

Para iniciar a API separadamente:

```bash
npm run dev:api
```

O front-end centraliza as chamadas HTTP em `src/assets/services/api.js` e
utiliza cookies de sessão (`credentials: 'include'`). A URL-base configurável
para o Vite é `VITE_API_URL`; por padrão, o projeto usa
`http://localhost:3000/api`.

## Variáveis de ambiente

O arquivo `.env.example` contém valores de desenvolvimento para o projeto
integrado. Crie uma cópia local antes de alterar configurações:

```powershell
Copy-Item .env.example .env
```

Variáveis:

| Variável | Uso |
|---|---|
| `VITE_API_URL` | URL-base da API consumida pelo front-end |
| `PORT` | Porta da API |
| `FRONTEND_URL` | Origem do front-end permitida pela API |
| `DATABASE_PATH` | Caminho do SQLite |
| `SESSION_SECRET` | Segredo da sessão; obrigatório em produção, com pelo menos 32 caracteres aleatórios |

Para executar só o front-end, a variável necessária é `VITE_API_URL` quando a API
não estiver na URL padrão. Não coloque credenciais no código nem versione o
arquivo `.env`. Em desenvolvimento local, o servidor gera e persiste um segredo
de sessão quando ele não é fornecido; em produção, deve ser configurado
explicitamente.

## Integração e dados

As páginas de relatos, mapa e dashboard consomem os dados da API. Cadastro e
login usam sessão no servidor; operações de escrita dependem de autenticação.
A API valida a região piloto e aplica as regras de negócio. A aplicação não
substitui respostas da API por dados fictícios.

A região é Itaquaquecetuba (código IBGE `3523107`). O mapa municipal utilizado
pela API está versionado em
`server/geo/itaquaquecetuba-ibge.geojson` e provém da
[API oficial de Malhas do IBGE](https://servicodados.ibge.gov.br/api/v3/malhas/municipios/3523107?formato=application%2Fvnd.geo%2Bjson&qualidade=maxima).
O centro usado pelo mapa e pela consulta meteorológica é calculado a partir
desse polígono.
O clima vem da Open-Meteo e não equivale a alerta oficial da Defesa Civil.

## Deploy

O repositório inclui uma configuração inicial de hospedagem da API no Render
(`render.yaml`) e de encaminhamento de `/api` pelo Vercel (`vercel.json`). O
serviço Render usa um disco persistente para o SQLite; esse tipo de serviço
exige um plano pago. Revise e confirme o custo no painel do Render antes de
criar o serviço.

Para publicar:

1. Importe este repositório no Render como Blueprint e revise o serviço
   `alertaja-api`, as variáveis e o disco persistente. O Render gera
   `SESSION_SECRET` automaticamente.
2. Crie o serviço e confirme no painel o domínio `onrender.com` atribuído.
   Se o domínio for diferente de `https://alertaja-api.onrender.com`, atualize
   o destino do rewrite em `vercel.json` para o domínio real, mantendo o
   caminho `/api/:path*`.
3. Na Vercel, configure `VITE_API_URL` como `/api` para produção e publique um
   novo deploy. Se havia uma URL `localhost` nessa variável, substitua-a.
4. Verifique `https://alerta-ja.vercel.app/api/health` e depois teste login,
   cadastro e operações de relatos pela interface.

O proxy mantém as chamadas e os cookies de sessão na origem do front-end. Não
configure a URL pública do Render diretamente em `VITE_API_URL`, pois a sessão
usa cookies `SameSite=Strict`. A API permite a origem de produção por meio de
`FRONTEND_URL`, definida no `render.yaml` como
`https://alerta-ja.vercel.app`. A publicação precisa ser concluída nas contas
Render e Vercel da equipe; não há credenciais de hospedagem no repositório.

## Testes e validação

Comandos disponíveis:

```bash
npm run build
npm run lint
npm run test:api
```

Os testes da API usam bancos em memória e, no teste de persistência, uma pasta
temporária removida ao final; eles não devem alterar o banco local da aplicação.

Na validação de interface registrada em 18/11/2026 e na rodada final de
comandos executada para esta entrega:

- `npm run build` e `npm run lint` passaram.
- `npm run test:api` passou com 6 testes.
- As 9 rotas foram verificadas em larguras de 360, 390, 768, 820, 1366 e 1440 px;
  não houve overflow nos elementos visíveis verificados.
- Menu móvel, navegação, filtros, formulários, mapa e clima foram verificados.
- O CRUD foi exercitado pela interface com dados de teste sintéticos: criação,
  consulta após recarga, edição e exclusão com confirmação.
- O logout retornou HTTP 204; `GET /api/auth/me` retornou `user: null` e uma
  operação protegida sem sessão retornou HTTP 401.
- Uma tentativa de criação acima do limite de cinco relatos por hora recebeu
  HTTP 429; a operação recusada não criou um relato.
- Foram observados eventos `ERR_ABORTED` em algumas exclusões e no logout,
  inclusive quando as mesmas requisições tiveram respostas HTTP 204. A causa
  exata não foi comprovada e o evento está documentado como ponto a investigar,
  não como falha confirmada do servidor.
- Os relatos temporários foram removidos e sua ausência foi confirmada em nova
  consulta.

Uma conta sintética usada na validação permanece cadastrada: não existe fluxo
de remoção de conta nem procedimento autorizado de limpeza documentado. Não foi
feita exclusão direta no banco. Não use credenciais reais para reproduzir testes;
consulte `AI.md` para o registro detalhado da validação e de suas limitações.

## Uso de IA

O registro do uso de inteligência artificial, exemplos de prompts, alterações,
verificações e limitações está em [AI.md](./AI.md).
