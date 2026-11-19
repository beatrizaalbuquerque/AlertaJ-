# Uso de inteligência artificial

Durante o desenvolvimento do AlertaJá, usamos um assistente de IA integrado
ao VS Code (Copilot SDK) como apoio para entender o código existente, revisar
problemas do front-end, sugerir ajustes e organizar a documentação. As decisões
finais e a responsabilidade pelo projeto continuam sendo da equipe.

## Exemplos de pedidos feitos

- Revisar o front-end atual e melhorar a experiência em celulares sem recriar
  o projeto.
- Não alterar o back-end nem substituir informações reais por dados inventados.
- Verificar rótulos, contraste, foco e navegação por teclado.
- Investigar os eventos `ERR_ABORTED` sem presumir que fossem falhas do servidor.
- Conferir a URL padrão da API com o `.env.example`.
- “Remover a necessidade de digitar manualmente latitude e longitude” e permitir
  definir o ponto do relato com geolocalização ou no mapa.
- Revisar a seção “Prevenir” sem inventar conteúdo não aprovado pela equipe.

## Exemplos de respostas e uso no projeto

- Para o pedido de facilitar a localização, o assistente identificou que o
  formulário precisava continuar enviando `location`, `latitude`, `longitude`
  e `waterLevel`. A solução implementada substituiu a digitação das
  coordenadas por geolocalização do navegador e seleção de ponto no mapa.
  Também foi explicado que não havia busca automática de endereço no projeto:
  o endereço ou bairro é descrito pelo usuário e o ponto correspondente é
  marcado no mapa.
- Para o pedido sobre “Prevenir”, a resposta foi manter a página e deixar
  explícito que as orientações aprovadas ainda não foram cadastradas, em vez de
  escrever recomendações sem validação do grupo.
- Na investigação de `ERR_ABORTED`, a conclusão registrada foi que houve
  respostas HTTP 204, 401 e 429 em operações específicas, mas a causa exata de
  `ERR_ABORTED` não foi comprovada. O evento não foi descrito como falha
  confirmada do servidor.

## Parte do front-end

O projeto continua usando as páginas e os componentes React que já existiam.
O front-end está dividido entre páginas, componentes visuais, hooks e um
serviço central de requisições HTTP. Os hooks cuidam, entre outras coisas, da
sessão, dos relatos, da região e do clima.

Nos ajustes recentes:

- O menu pode ser aberto e fechado em telas pequenas.
- A tela de relatos mostra estados de carregamento, erro, lista vazia e
  confirmação das operações.
- A exclusão pede confirmação na própria interface.
- Os campos têm rótulos e indicadores de foco para navegação por teclado.
- O formulário de relatos oferece geolocalização do dispositivo e seleção
  manual do ponto no mapa municipal, sem exigir que a pessoa conheça
  coordenadas. Endereço ou bairro continua sendo informado como descrição.
- O cartão “Relatos registrados” no dashboard é um link para a lista e indica
  visualmente que pode ser aberto.
- O serviço HTTP usa `http://localhost:3000/api` em desenvolvimento local e
  `/api` em produção, salvo configuração por `VITE_API_URL`.

O assistente ajudou a revisar e implementar esses ajustes. README e este
arquivo também foram atualizados com o apoio da ferramenta.

As sugestões foram comparadas com o código do projeto e verificadas com build,
lint e testes no navegador. Na melhoria de localização, nenhuma regra do
servidor, endpoint ou estrutura do banco foi alterada.

## Verificações registradas

- Em 19/11/2026, `npm run build` e `npm run lint` passaram após os ajustes de
  localização e da página Prevenção.
- Em 19/11/2026, `npm run test:api` passou com 6 testes.
- No navegador, foram verificadas 9 páginas em larguras de 360, 390, 768, 820,
  1366 e 1440 px, além de navegação, filtros, formulários, mapa e clima.
- Em uma API e um banco temporários isolados, foram testados localização
  concedida e recusada, rejeição de ponto fora da região, seleção pelo mapa e
  criação de relato. A requisição manteve latitude e longitude como números.
  O banco temporário foi removido após o teste.
- A página “Prevenção” abriu e informou que ainda não há conteúdo aprovado. Em
  360 px, a tela testada não apresentou overflow horizontal.
- Um teste de interface com conta sintética cobriu criação, consulta após
  recarregar, edição, exclusão e logout.
- A exclusão respondeu HTTP 204; após atualizar, o relato não apareceu.
- O logout respondeu HTTP 204; a consulta de sessão retornou `user: null` e
  uma tentativa sem sessão foi recusada com HTTP 401.
- Uma criação que ultrapassaria o limite recebeu HTTP 429 e não gerou relato.
- O navegador também registrou `ERR_ABORTED` em algumas requisições de exclusão
  e logout, inclusive junto de respostas HTTP 204. A causa não foi comprovada;
  por isso, o evento não foi registrado como falha confirmada do servidor.
- Os relatos temporários foram removidos e a lista vazia foi confirmada em nova
  consulta. A conta sintética continua cadastrada: não há procedimento
  autorizado de remoção documentado e não foi feita alteração direta no banco.

## Limitações

Os testes de acessibilidade foram básicos; não foi feita avaliação completa com
leitor de tela. A busca automática de endereço não foi implementada: o endereço
ou bairro é digitado como descrição e o ponto é escolhido no mapa. A página
“Prevenção” ainda depende de conteúdo aprovado pelo grupo. O endereço da
Vercel e a API Render responderam HTTP 200 em consultas GET de saúde, região e
relatos em 19/11/2026. Não foi feito CRUD com dados de produção nessa verificação.
A aplicação também não calcula rotas nem lista abrigos sem dados oficiais
fornecidos.

A IA ajudou a acelerar algumas tarefas, mas suas sugestões precisaram ser
conferidas: uma sugestão pode não corresponder ao código ou ao comportamento
real. A equipe deve revisar o que será entregue e confirmar eventuais usos de
outras ferramentas de IA que não estejam registrados aqui.
