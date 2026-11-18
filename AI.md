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
- O cartão “Relatos registrados” no dashboard é um link para a lista e indica
  visualmente que pode ser aberto.
- O serviço da API usa `http://localhost:3000/api` como endereço padrão, igual
  ao `.env.example`.

O assistente ajudou a revisar e implementar esses ajustes. README e este
arquivo também foram atualizados com o apoio da ferramenta.

As sugestões foram comparadas com o código do projeto e verificadas com build,
lint e testes no navegador. Nenhuma regra do servidor ou estrutura do banco foi
alterada nessas revisões.

## Verificações registradas

- `npm run build`: passou na última execução registrada em 18/11/2026.
- `npm run lint`: passou na última execução registrada em 18/11/2026.
- `npm run test:api`: 6 testes passaram na última execução registrada em
  18/11/2026.
- No navegador, foram verificadas 9 páginas em larguras de 360, 390, 768, 820,
  1366 e 1440 px, além de navegação, filtros, formulários, mapa e clima.
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
leitor de tela. Não há endereço de deploy confirmado no projeto. A aplicação
também não calcula rotas nem lista abrigos sem dados oficiais fornecidos.

A IA ajudou a acelerar algumas tarefas, mas suas sugestões precisaram ser
conferidas: uma sugestão pode não corresponder ao código ou ao comportamento
real. A equipe deve revisar o que será entregue e confirmar eventuais usos de
outras ferramentas de IA que não estejam registrados aqui.
