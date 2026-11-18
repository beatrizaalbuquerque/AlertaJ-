# Registro de uso de Inteligência Artificial — AlertaJá

Este arquivo registra o uso de IA e as validações documentadas no histórico de
desenvolvimento disponível. A equipe deve revisar o texto para complementar
eventuais ferramentas ou interações ocorridas fora deste histórico.

## Ferramentas utilizadas

- **Assistente de IA integrado ao VS Code via Copilot SDK:** apoio à leitura do
  código existente, identificação de problemas, implementação pontual,
  documentação e preparação de comandos de validação.
- **PowerShell e npm:** execução de comandos e testes. São ferramentas de
  desenvolvimento, não ferramentas de IA.
- **Navegador integrado com automação Playwright:** verificação de páginas,
  operações pela interface, navegação por teclado, estados visuais e respostas
  HTTP. É ferramenta de teste, não uma ferramenta de IA.

Uma versão anterior deste documento mencionava ChatGPT, mas o histórico técnico
disponível não contém os prompts, respostas ou resultados dessa ferramenta.
Essa menção não é apresentada aqui como uso verificado; a equipe deve confirmá-la
e acrescentar as interações correspondentes se elas ocorreram fora do histórico
presente.

## Prompts relevantes registrados

Os trechos abaixo foram solicitações reais da equipe, reproduzidos de forma
breve:

1. **Revisão do front-end:** “Faça uma revisão completa e implemente as
   melhorias necessárias no Front-end do meu projeto AlertaJá”.
2. **Restrição de escopo:** “ATENÇÃO: NÃO MODIFIQUE O BACK-END.” e “Não substitua
   dados reais por dados fictícios para fingir que uma funcionalidade funciona.”
3. **Validação final:** “Verifique acessibilidade básica, incluindo contraste,
   labels, foco e navegação por teclado.”
4. **Investigação dos eventos:** “Se as operações foram concluídas corretamente
   no servidor.” e “Não altere o back-end, banco de dados ou endpoints.”
5. **Registro acadêmico:** “Use informações reais do histórico e dos arquivos.
   Não invente prompts, resultados, ferramentas ou testes.”

Esses exemplos são excertos das solicitações da equipe, não prompts de sistema
nem transcrições completas de conversas.

## Exemplos de sugestões de IA e aplicação

- A revisão identificou que a navegação existente apresentava todos os links
  em sequência no celular. Foi proposta e implementada uma navegação compacta,
  recolhível e acessível por teclado no componente `Sidebar`.
- Foram propostas mensagens visuais reutilizáveis para carregamento, erro,
  sucesso e listas vazias, e confirmação de exclusão integrada à interface,
  substituindo diálogos nativos.
- Foi identificada a necessidade de proteger a navegação por teclado no diálogo
  de exclusão; o foco passou a ficar contido no diálogo e a retornar após a
  operação ou cancelamento.
- A verificação do foco descobriu que classes Tailwind usadas anteriormente
  não produziam contorno visível no navegador. A classe foi corrigida e o
  resultado foi conferido no navegador.
- A revisão amostral de contraste identificou texto auxiliar com contraste
  baixo. O tom foi ajustado e algumas combinações representativas foram medidas.
- A equipe solicitou explicitamente preservar os dados reais, contratos da API,
  identidade visual e as páginas existentes. As sugestões foram limitadas a
  correções dentro do front-end.

## Alterações com auxílio de IA

O assistente auxiliou a revisar e atualizar componentes, páginas e hooks do
front-end. Entre as alterações finais registradas estão:

- Navegação móvel com estado expandido, rótulos acessíveis e fechamento ao
  navegar.
- Componentes compartilhados para feedback, carregamento, estado vazio e
  confirmação de exclusão.
- Integração desses estados às páginas já existentes, sem criar um projeto
  paralelo nem dados simulados.
- Melhoria de rótulos, foco visível, dimensões de controles e contenção de foco
  do diálogo.
- Ajuste de estados assíncronos dos hooks de relatos e meteorologia.
- Revisão de `README.md` e deste registro, explicitando comportamento real,
  execução e limitações.

As regras de negócio, autenticação do servidor, banco de dados e endpoints não
foram alterados durante a revisão final do front-end.

## Como as sugestões foram verificadas

As sugestões não foram consideradas corretas apenas por terem sido geradas por
IA. Foram verificadas com:

- `npm run build`.
- `npm run lint`.
- `npm run test:api` (6 testes).
- Navegação pelas 9 rotas nas larguras 360, 390, 768, 820, 1366 e 1440 px.
- Testes no navegador de navegação móvel, filtros, formulário, mapa, clima,
  CRUD de relatos e autenticação.
- Testes de teclado no foco do formulário e no diálogo de exclusão.
- Medições amostrais de contraste e inspeção do estilo computado do foco.
- Verificação do estado HTTP e da persistência aparente após recarregar, sem
  alterar diretamente o banco.

## Última rodada de validação de operações e eventos

Os testes de ponta a ponta utilizaram uma conta sintética e local. Nenhum dado
real de morador foi usado.

- A criação de relato teve resposta HTTP 201. O relato começou como
  “não confirmado”, foi exibido na lista e permaneceu após recarregar a página.
- A edição refletiu a localização atualizada na lista.
- A exclusão confirmada pela interface teve resposta HTTP 204. O relato
  desapareceu da interface e não foi retornado após recarregar e consultar
  novamente.
- O logout teve resposta HTTP 204. Em seguida, `GET /api/auth/me` retornou
  `user: null`; uma tentativa de criação sem sessão recebeu HTTP 401. O
  formulário de escrita não foi exibido após o logout.
- Em outra tentativa, o servidor respondeu HTTP 429 porque a conta sintética
  havia alcançado cinco relatos na última hora. A criação foi recusada; a lista
  continuou vazia.
- O navegador registrou `ERR_ABORTED` durante algumas operações de exclusão e
  logout, inclusive nas repetições em que também foi observada resposta HTTP
  204. A causa exata não foi comprovada. A possibilidade de interrupção ou
  instrumentação da automação/navegação permanece uma hipótese, não uma
  conclusão.
- Os relatos temporários foram excluídos e sua ausência foi confirmada em uma
  consulta posterior. A conta sintética permanece cadastrada: não existe fluxo
  de exclusão de conta nem procedimento autorizado de limpeza documentado. Não
  houve exclusão direta no banco.

As respostas HTTP 204, 429 e 401 têm significados distintos e foram tratadas
conforme o resultado observado: exclusão/logout concluídos; criação bloqueada
por limite; tentativa protegida sem autenticação recusada. O evento
`ERR_ABORTED`, por si só, não foi classificado como falha confirmada.

## Testes e resultados documentados

| Verificação | Resultado registrado |
|---|---|
| Build de produção (`npm run build`), reexecutado nesta finalização em 18/11/2026 | Passou |
| Lint (`npm run lint`), reexecutado nesta finalização em 18/11/2026 | Passou |
| Testes da API (`npm run test:api`), reexecutados nesta finalização em 18/11/2026 | 6 testes passaram |
| Rotas e larguras responsivas | 9 rotas em 6 larguras; sem overflow nos elementos verificados |
| CRUD no navegador | Criar, consultar após recarga, editar e excluir confirmados |
| Sessão e autorização | Logout confirmado; consulta sem usuário e criação protegida com 401 |
| Limite por hora | Uma tentativa acima do limite recebeu 429 e não criou relato |
| Teclado e foco | Tab, Shift+Tab, Escape e Enter verificados no diálogo; foco visível corrigido e conferido |
| Meteorologia e mapa | Carregamento observado no navegador |

Os comandos de build, lint e testes da API foram executados novamente durante
esta finalização. Os testes visuais e de interação indicados na tabela são os
resultados da rodada de navegador documentada acima; não foram repetidos durante
esta última rodada de documentação.

## Limitações e análise crítica

- A automação observou `ERR_ABORTED` junto a respostas HTTP 204. Sem evidência
  adicional, não é possível determinar a origem precisa do evento.
- A conta sintética permanece na base local e atingiu o limite horário de
  criação durante os testes. Não há procedimento autorizado de remoção
  documentado; não foram alterados dados diretamente.
- Não foi executada avaliação integral por leitor de tela nem auditoria
  automática completa de acessibilidade. As verificações foram básicas e
  amostrais.
- Não há URL de deploy validada. A aplicação ainda precisa ser executada no
  ambiente local ou publicada pela equipe.
- A página de rotas não calcula caminhos, e abrigos/pontos de apoio não têm
  dados oficiais cadastrados. Essas limitações são apresentadas claramente,
  sem dados ou funcionalidades fictícias.

A IA acelerou a leitura, a implementação e a validação, mas pode sugerir
alterações incorretas ou interpretar eventos de forma precipitada. Por isso,
mudanças foram confrontadas com o código existente, respostas HTTP, persistência
observável, testes, lint, build e comportamento no navegador. A equipe continua
responsável por compreender o código, revisar esta documentação, confirmar as
ferramentas usadas fora do histórico disponível e aprovar a entrega acadêmica.
