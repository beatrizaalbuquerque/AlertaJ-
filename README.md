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

Requisito do projeto completo: Node.js `>=22.12.0` e npm. O Vite aceita também
Node 20.19+, mas a versão travada de `better-sqlite3` (13.2.0) requer Node 22 ou
superior. No Windows, a instalação normal compila o módulo nativo via
`node-gyp` e requer Python 3 e Visual Studio 2022 Build Tools com o workload
**Desktop development with C++** (incluindo MSVC e Windows SDK).

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
npm ci
```

Se o projeto for usado apenas no Windows e a compilação nativa falhar por falta
do toolchain acima, a versão publicada do pacote inclui binário pré-compilado
para Windows x64. Nesse caso, instale os pacotes sem executar scripts de
compilação e confira que o módulo pré-compilado carrega:

```powershell
npm ci --ignore-scripts
node -e "require('better-sqlite3'); console.log('better-sqlite3 carregado')"
```

Esse modo ignora scripts de instalação de todas as dependências; use-o apenas
se a verificação do módulo passar. Não use `--ignore-scripts` como substituto
geral em outros ambientes.

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

A API persiste usuários, relatos, votos e sessões no SQLite. O caminho padrão
é `server/data/alertaja.sqlite`, ignorado pelo Git; em produção, configure
`DATABASE_PATH` em um volume persistente. O banco ativa chaves estrangeiras e
WAL. Senhas são armazenadas com bcrypt, nunca em texto puro.

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

Em produção, `FRONTEND_URL` precisa corresponder exatamente à origem publicada
do front-end; o proxy da Vercel encaminha `/api` para a API hospedada no Render.
As mutações validam o cabeçalho `Origin`, o CORS permite credenciais apenas para
a origem configurada e o cookie da sessão usa `HttpOnly`, `SameSite=Strict` e
`Secure` em produção.

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
As consultas à Open-Meteo e ao OSRM têm limite de 12 segundos; erros HTTP,
respostas inválidas e tempo excedido são exibidos como falha, sem substituir
dados por valores simulados.

A página de rotas usa `src/assets/services/routeService.js` para consultar o
serviço público OSRM. Origem e destino são escolhidos no mapa. O serviço pode
ficar indisponível ou limitado e não avalia as condições atuais das vias. Como
ele não exclui individualmente pontos de alagamento, a interface bloqueia o
cálculo quando há relatos confirmados carregados na região e mostra seus
marcadores. Também não permite calcular quando não foi possível carregar os
relatos. Na ausência de relatos confirmados, OSRM ainda não verifica as vias
contra alagamentos, bloqueios ou condições atuais: os trajetos são apenas
alternativas calculadas pela rede viária e não são apresentados como seguros.
A página não faz geocodificação de endereços.

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

Na validação de interface registrada em 18/11/2026 e nas rodadas de comandos e
interface de 19/11/2026:

- `npm run build` e `npm run lint` passaram. Após carregar páginas sob demanda,
  o bundle de entrada ficou em aproximadamente 276 kB e os chunks gerados
  ficaram abaixo do limite de aviso de 500 kB.
- `npm run test:api` passou com 9 testes.
- Os testes cobrem validação de payloads JSON inválidos, erros HTTP, origem
  permitida/bloqueada, autenticação, CRUD, regras da região, limite de criação,
  persistência após reabrir o SQLite e validação/timeout dos clientes
  Open-Meteo e OSRM.
- As 9 rotas foram verificadas em larguras de 360, 390, 768, 820, 1366 e 1440 px;
  não houve overflow horizontal nos elementos verificados.
- Menu móvel, navegação, filtros de mapa e alertas, busca de abrigos, painéis
  expansíveis, seleção de pontos no mapa de rotas e consulta meteorológica foram
  verificados no navegador.
- Na checagem visual mais recente, dashboard, prevenção, login e cadastro foram
  verificados em 360, 390, 820 e 1440 px; também foram exercitados o menu móvel
  e o painel expansível do modelo matemático.
- Em banco SQLite temporário, o cadastro pela interface criou a sessão, a
  sessão persistiu após recarregar e o login válido voltou à página de relatos.
  Login com senha inválida e cadastro com e-mail repetido apresentaram os erros
  esperados; logout foi confirmado por nova consulta de sessão sem usuário.
  Esses dados foram isolados da base local e da produção.
- O servidor foi iniciado localmente com um SQLite temporário, reiniciado com
  o mesmo arquivo e segredo de sessão, e confirmou a persistência de um relato
  e de uma sessão. O relato temporário foi excluído e a sessão encerrada.
- A consulta pública OSRM retornou um trajeto GeoJSON em teste de conectividade.
  A interface bloqueia a consulta quando relatos confirmados existem ou quando
  não foi possível carregar os relatos.
- A resposta atual da Open-Meteo foi conferida: coordenadas do centro municipal,
  horário, valores e unidades retornados pela API.
- Open-Meteo e OSRM responderam HTTP 200 na verificação externa de 19/11/2026.
  Os testes automatizados de parsing e timeout usam respostas controladas; não
  prometem disponibilidade contínua dos serviços.
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
