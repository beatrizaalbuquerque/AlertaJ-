# AlertaJá

Aplicação acadêmica de monitoramento comunitário de relatos de alagamento.
O front-end existente usa React, Vite e Tailwind CSS; a API separada usa
Node.js, Express e SQLite.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação e execução

1. Instale as dependências: `npm install`.
2. Copie `.env.example` para `.env` se ainda não houver configuração local.
3. Execute `npm run dev` para iniciar a API e o front-end juntos.

Por padrão, a API atende em `http://localhost:3000/api`, o Vite em
`http://localhost:5173` (ou próxima porta livre), e o banco persistente é criado em
`server/data/alertaja.sqlite`. `VITE_API_URL` pode apontar o front-end para
outra URL base da API. Em desenvolvimento, se `SESSION_SECRET` não estiver
configurado, a API gera um segredo aleatório e o guarda localmente em
`server/data/session-secret` (pasta ignorada pelo Git). Em produção, configure
`SESSION_SECRET` com pelo menos 32 caracteres aleatórios. O arquivo `.env`
não deve ser versionado. `npm run dev:api` e `npm run dev:frontend` continuam
disponíveis para iniciar os serviços separadamente.

## Região piloto e fonte geográfica

A região piloto é o município de Itaquaquecetuba, SP (código IBGE `3523107`).
O polígono versionado em `server/geo/itaquaquecetuba-ibge.geojson` foi obtido
da [API oficial de Malhas do IBGE](https://servicodados.ibge.gov.br/api/v3/malhas/municipios/3523107?formato=application%2Fvnd.geo%2Bjson&qualidade=maxima),
solicitando `formato=application/vnd.geo+json` e `qualidade=maxima`. A
identificação do município foi conferida também na
[API de Localidades do IBGE](https://servicodados.ibge.gov.br/api/v1/localidades/municipios/3523107).
O arquivo contém o código oficial `3523107` e o limite municipal em GeoJSON;
as coordenadas seguem `[longitude, latitude]`. A malha foi consultada em
16/11/2026 e é mantida localmente para que a validação não dependa de
disponibilidade da API do IBGE durante a execução.

A validação de ocorrências é feita no backend contra esse polígono. A mesma
geometria é usada para filtrar consultas individuais e listas, incluindo
relatos que eventualmente existissem fora do limite. O ponto inicial do mapa
e as coordenadas da consulta meteorológica são o centroide planar calculado a
partir do próprio polígono oficial; não são coordenadas escolhidas
manualmente. A API expõe o limite, o centro e a fonte em `GET /api/region`.

A tabela SQLite `support_locations` e `GET /api/support-locations` deixam
preparado o catálogo de abrigos (`shelter`) e pontos de apoio
(`support_point`). Nenhum endereço ou ponto foi pré-cadastrado: a interface
permanece vazia até que o grupo forneça uma fonte oficial.

## Endpoints

- `GET /api/health`: estado da API e da configuração geográfica.
- `POST /api/auth/register`, `POST /api/auth/login`,
  `GET /api/auth/me`, `POST /api/auth/logout`.
- `GET /api/reports?status=...`, `GET /api/reports/:id`.
- `POST /api/reports`, `PUT /api/reports/:id`, `DELETE /api/reports/:id`.
- `POST /api/reports/:id/votes` com `{"type":"confirm"}` ou
  `{"type":"contest"}`.

A autenticação usa sessão em cookie HttpOnly persistido em SQLite. Senhas são
armazenadas com bcrypt. Apenas o autor pode editar ou remover seu relato.
Cada usuário pode votar uma vez em cada relato de outra pessoa. Duas
confirmações de moradores diferentes do autor confirmam o relato. Contestações
são registradas, mas não alteram o status. Relatos sem confirmação nova por
três horas são encerrados automaticamente e não são considerados elegíveis
para rotas.

O limite de cinco relatos por hora é aplicado no backend. Somente coordenadas
dentro do município de Itaquaquecetuba são aceitas ou incluídas nas consultas.

## Meteorologia

O hook existente consulta condições atuais na Open-Meteo usando o centroide
derivado dos limites oficiais de Itaquaquecetuba. Esses dados não são alertas
oficiais. O modelo do grupo
`f(t) = -2t² + 12t + 5` tem integral de 0 a 6 horas igual a 102 mm acumulados
no modelo, sem representar uma previsão meteorológica.

## Verificações

- `npm run build`
- `npm run lint`
- `npm run test:api`
