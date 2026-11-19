# AlertaJá

Aplicação web acadêmica desenvolvida para a Global Solution da FIAP. O AlertaJá
reúne informações comunitárias sobre alagamentos e condições meteorológicas
para a região piloto de Itaquaquecetuba, SP.

## Aplicação

O front-end permite consultar o dashboard, visualizar relatos no mapa, filtrar
ocorrências por status, registrar e gerenciar relatos autenticados, consultar
condições meteorológicas e acessar as páginas de abrigos, rotas e orientações.
Abrigos e pontos de apoio só serão listados quando houver dados oficiais
cadastrados. A página de rotas consulta trajetos viários pelo serviço público
OSRM quando não há relatos confirmados carregados; caso existam, bloqueia o
cálculo porque o roteador não consegue excluir pontos de alagamento.

## Tecnologias

- React 19, JavaScript e Vite 8.
- Tailwind CSS 4.
- React Router e React Leaflet/Leaflet.
- API separada em Node.js, Express e SQLite.
- Open-Meteo para condições meteorológicas atuais.
- OSRM público e dados OpenStreetMap para consulta de trajetos viários.

Requisito de execução do Vite instalado: Node.js `^20.19.0` ou `>=22.12.0` e npm.

## Estrutura principal

```text
src/
  App.jsx
  index.css
  assets/
    components/  # Componentes de layout, formulários, listas e mapa
    data/        # Conteúdos e referências de orientação
    hooks/       # Autenticação, região, relatos, meteorologia e rotas
    pages/       # Páginas da aplicação
    services/    # Comunicação com API, Open-Meteo e OSRM
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
para o Vite é `VITE_API_URL`. Em desenvolvimento, o padrão é
`http://localhost:3000/api`; em produção, o front-end usa `/api` na mesma origem,
salvo se `VITE_API_URL` for definida no ambiente de build.

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
O clima vem da Open-Meteo por `src/assets/services/weatherService.js` e não
equivale a alerta oficial da Defesa Civil.

A página de rotas usa `src/assets/services/routeService.js` para consultar o
serviço público OSRM. Origem e destino são escolhidos no mapa. O serviço pode
ficar indisponível ou limitado e não avalia as condições atuais das vias. Como
ele não exclui pontos de alagamento, a interface bloqueia o cálculo quando há
relatos confirmados na região e mostra seus marcadores. Os resultados não são
apresentados como rotas seguras. A página não faz geocodificação de endereços.

As orientações de prevenção incluem referências ao Ministério da Saúde e à
Defesa Civil do Estado de São Paulo. A lista de abrigos permanece sem locais
inventados; quando estiver vazia, informa que os dados oficiais estão em
processo de cadastramento.

## Links

- GitHub: [beatrizaalbuquerque/AlertaJ-](https://github.com/beatrizaalbuquerque/AlertaJ-)
- Aplicação publicada: [https://alerta-ja.vercel.app](https://alerta-ja.vercel.app)

## Deploy

Deploy publicado: [https://alerta-ja.vercel.app](https://alerta-ja.vercel.app).
A API está hospedada separadamente e é encaminhada pelo proxy configurado em
`vercel.json`; o front-end usa a mesma origem (`/api`) para preservar os cookies
de sessão. Na verificação de 19/11/2026, `/api/health`, `/api/reports` e
`/api/region` responderam HTTP 200 pelo domínio da Vercel.
Na revisão final, a rota de saúde da API no Render também respondeu HTTP 200.
Esta revisão não publicou nem atualizou o deploy.

O arquivo `render.yaml` descreve o serviço Render e o disco persistente do
SQLite. Para conferir ou atualizar o deploy, compare o domínio atribuído no
painel do Render com o destino em `vercel.json`. Após mudar essa configuração,
publique um novo deploy da Vercel. Operações de escrita no ambiente publicado
devem ser testadas somente com uma conta de teste autorizada; os testes de CRUD
automatizados usam banco isolado.

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
  não houve overflow horizontal nos elementos verificados.
- Menu móvel, navegação, filtros de mapa e alertas, busca de abrigos, painéis
  expansíveis, seleção de pontos no mapa de rotas e consulta meteorológica foram
  verificados no navegador.
- A consulta pública OSRM retornou um trajeto GeoJSON em teste de conectividade.
  A interface bloqueia a consulta quando relatos confirmados existem ou quando
  não foi possível carregar os relatos.
- A resposta atual da Open-Meteo foi conferida: coordenadas do centro municipal,
  horário, valores e unidades retornados pela API.
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

## Integrantes:

Nicole Couto — RM 569191
Beatriz Albuquerque — RM 572055
Leticia Couto — RM 569516
