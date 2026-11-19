# Uso de inteligência artificial

Este arquivo registra o uso de IA conhecido no desenvolvimento do AlertaJá.
Ele não atribui tarefas a integrantes nem substitui a revisão da equipe.

## Ferramentas utilizadas

- **ChatGPT:** apoio na discussão de requisitos, organização de ideias e
  avaliação de alternativas para o projeto. As respostas foram tratadas como
  sugestões; não há atribuição de código específico ao ChatGPT neste registro.
- **VS Code AI (Copilot SDK):** apoio durante a análise e implementação no
  repositório aberto no VS Code, incluindo leitura de código existente,
  alterações pontuais de interface e serviços, documentação e execução de
  verificações.

Este registro cobre as interações conhecidas nesta revisão. A equipe deve
complementá-lo se outras ferramentas ou usos relevantes tiverem ocorrido.

## Exemplos representativos de interações

| Ferramenta | Pedido representativo | Resposta ou uso no projeto |
|---|---|---|
| ChatGPT | Organizar os requisitos do AlertaJá sem reconstruir o projeto existente. | Apoio à discussão de escopo e alternativas; este registro não atribui alterações específicas de código ao ChatGPT. |
| VS Code AI (Copilot SDK) | Melhorar a interface React existente sem substituir integrações nem inventar dados. | Análise dos componentes e alterações pontuais de apresentação e interação. |
| VS Code AI (Copilot SDK) | Consultar rotas sem desenhar trajetos fictícios ou afirmar que são seguras. | Identificação da limitação do OSRM e manutenção do bloqueio geral quando relatos confirmados estão carregados, com aviso explícito na página. |
| VS Code AI (Copilot SDK) | Organizar a integração Open-Meteo mantendo estado e ciclo de vida no hook. | Requisição separada em `weatherService.js`, com o hook responsável pelo estado da consulta. |
| VS Code AI (Copilot SDK) | Preencher Prevenção com orientações confiáveis e manter abrigos somente com dados verificáveis. | Página com sete orientações referenciadas; página de abrigos sem registros inventados e com mensagem de cadastramento quando vazia. |

Os pedidos estão resumidos, não são transcrições completas. As respostas
ajudaram a identificar arquivos, propor alterações e descrever limitações. A
decisão de aceitar, ajustar ou rejeitar cada sugestão cabe à equipe.

## Aplicação no projeto

Com apoio do VS Code AI, foram analisados e ajustados arquivos existentes de
páginas, componentes, hooks e serviços. Entre as funcionalidades e revisões
documentadas no projeto estão:

- estados de carregamento, erro, lista vazia e feedback para ações;
- menu móvel, filtros, busca e painéis expansíveis;
- seleção de pontos no mapa para origem e destino e consulta de trajetos pelo
  serviço público OSRM;
- bloqueio da consulta de rotas quando existem relatos confirmados carregados,
  pois o OSRM não recebe os pontos de alagamento como restrições;
- chamada Open-Meteo centralizada em `src/assets/services/weatherService.js`,
  com estado e ciclo de vida mantidos em `useWeather.js`;
- conteúdo de prevenção com sete orientações e links para o Ministério da Saúde
  e a Defesa Civil do Estado de São Paulo;
- mensagem de cadastramento na página de abrigos quando não há locais
  retornados pela API, sem criar nomes ou endereços.

As alterações não autorizam afirmar que todo o código foi gerado por IA. A
equipe continua responsável por revisar e compreender o código entregue.

## Validação conhecida

Em 19/11/2026, durante a revisão registrada:

- `npm run build` passou, com aviso do Vite de que o bundle JavaScript excede
  500 kB após minificação antes da divisão de código.
- `npm run lint` passou.
- Na rodada final desta revisão, `npm run test:api` passou com 9 testes,
  incluindo payload inválido, CORS/origem, persistência SQLite e caminhos de
  erro/timeout dos clientes Open-Meteo e OSRM.
- Foram verificadas páginas e interações no navegador em larguras de 360, 390,
  820 e 1440 px, incluindo navegação móvel, painéis expansíveis e ausência de
  rolagem horizontal nas telas verificadas.
- A consulta Open-Meteo e uma consulta de conectividade ao serviço OSRM
  retornaram dados; isso não comprova disponibilidade contínua desses serviços.
- Leituras públicas da API publicada foram verificadas, mas não foi realizado
  CRUD em produção nem novo deploy.
- A divisão sob demanda das páginas foi verificada por build: o bundle de
  entrada ficou em aproximadamente 276 kB e nenhum chunk ultrapassou 500 kB.
- Build e lint passaram novamente após os ajustes da API e dos timeouts. O
  bundle inicial permaneceu em aproximadamente 276 kB, sem chunks acima de
  500 kB.
- Em API e SQLite temporários, foram testados pela interface cadastro, sessão
  após recarga, logout, login válido, mensagem para senha incorreta e mensagem
  para e-mail já cadastrado. A sessão foi consultada no servidor; nenhuma
  operação de autenticação foi feita na produção.
- O servidor local foi reiniciado com o mesmo banco e segredo temporários; uma
  sessão e um relato sobreviveram ao reinício. O relato foi removido e a sessão
  encerrada antes da limpeza do banco temporário.
- Open-Meteo e OSRM responderam HTTP 200 na verificação externa. Os clientes
  impõem timeout de 12 segundos e os testes automatizados verificam caminhos de
  timeout/erro sem tratar respostas simuladas como dados reais.

Verificações anteriores documentadas no histórico incluíram o CRUD de relatos
com dados de teste, regras da API e consultas públicas. Isso não substitui uma
repetição desses fluxos nesta revisão.

Nesta rodada de ajustes finais, a primeira tentativa de `npm ci` retornou
`EPERM` ao tentar substituir o módulo nativo
`lightningcss.win32-x64-msvc.node`, que estava em uso. Após encerrar o processo
Vite do projeto e repetir o comando, a instalação parou ao compilar
`better-sqlite3`: não há Python instalado/configurado no ambiente para o
`node-gyp` (Node.js v24.19.0). Portanto, a instalação limpa não foi concluída.
Como alternativa de validação, `npm ci --ignore-scripts` instalou os pacotes
necessários para as verificações; em seguida, build, lint e os testes da API
passaram. Essa alternativa não substitui uma instalação limpa padrão e não
remove nem desativa os testes. Ao final, a instalação alternativa foi repetida
após encerrar os servidores locais e novamente completou. O binário Windows x64
do pacote carregou diretamente em Node.js v24.19.0 e respondeu a consultas
SQLite. As instruções de instalação no README distinguem a instalação com
toolchain da alternativa específica para esse pacote e ambiente.

## Limitações e análise crítica

- O OSRM calcula trajetos a partir da rede viária disponível, mas não analisa
  alagamentos, bloqueios ou condições em tempo real. Por isso, o AlertaJá não
  apresenta os resultados como seguros e bloqueia a consulta quando há relatos
  confirmados carregados. Não há desvio individual de ocorrências.
- Open-Meteo e OSRM são serviços externos e podem ficar indisponíveis.
- A lista de abrigos depende de dados cadastrados e verificáveis. Nenhum local
  deve ser inventado para preencher a página.
- Não foi feita avaliação completa de acessibilidade com leitor de tela.
- A IA acelera exploração e implementação, mas pode produzir informações
  incorretas, desatualizadas ou incompatíveis com o código. As alterações
  precisam ser conferidas por meio de leitura do projeto, build, lint, testes e
  validação funcional adequada.
