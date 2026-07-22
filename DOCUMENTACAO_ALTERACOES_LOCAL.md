# Documentação local das alterações implementadas

Arquivo criado apenas para uso local do desenvolvedor.

## Visão geral

Este documento registra as mudanças aplicadas no player e na navegação de músicas do front-end, com foco em experiência de reprodução, troca entre playlists e exibição de anúncios.

## 1. Player

### Alterações no componente `front-end/src/components/Player.jsx`

- Ativação de botões de avanço e retrocesso com navegação entre músicas.
- Suporte à navegação pela playlist atual do artista.
- Quando a música selecionada vem da lista global (`/songs`), a navegação passa a considerar a playlist global inteira, e não apenas a playlist do artista.
- Barra de progresso agora interativa com mouse:
  - clique para mudar o ponto de reprodução;
  - arraste para avançar/retroceder na faixa.
- Botão de play/pause funcionando como controle principal do player.
- Auto-play ao trocar de música por navegação.
- Reset do tempo para o início ao trocar de faixa.
- Exibição de anúncio em overlay ao final de cada música ou quando a troca de faixa atingir o gatilho configurado.

## 2. Navegação entre músicas e playlists

### Arquivos envolvidos

- `front-end/src/pages/Song.jsx`
- `front-end/src/components/SongItem.jsx`
- `front-end/src/components/SingleItem.jsx`

### Comportamento

- A página de música agora identifica se a origem da seleção foi a lista global de músicas.
- Se a origem for a lista global, o `Player` recebe a playlist completa do app como contexto de navegação.
- Se a origem for uma página de artista, o player continua navegando pela playlist daquele artista.
- Os botões de avançar e voltar passam a alternar entre faixas de forma contínua dentro do contexto adequado.

## 3. Anúncios

### Novos arquivos criados

- `front-end/src/components/Ad.jsx`
- `front-end/src/components/Ad.css`
- `front-end/src/assets/database/ads.js`

### Comportamento

- Foi implementado um modal/overlay de anúncio com layout visual padronizado.
- O anúncio possui:
  - título;
  - descrição;
  - logo;
  - link externo;
  - botão para fechar o anúncio.
- Os anúncios passam a ser variados, com lista centralizada em `ads.js`.
- A seleção do anúncio foi estruturada para permitir expansão futura com novos itens na base de anúncios.
- A lógica atual usa a identificação da música para rotacionar anúncios de forma previsível e reutilizável.

## 4. Observações de implementação

### Observações importantes

- As alterações foram feitas diretamente no front-end React/Vite.
- Não houve commit realizado.
- O documento atual é apenas um registro local para facilitar manutenção e continuidade do desenvolvimento.

## 5. Arquivos impactados

- `front-end/src/components/Player.jsx`
- `front-end/src/pages/Song.jsx`
- `front-end/src/components/SongItem.jsx`
- `front-end/src/components/SingleItem.jsx`
- `front-end/src/components/Ad.jsx`
- `front-end/src/components/Ad.css`
- `front-end/src/assets/database/ads.js`

## 6. Próximo passo recomendado

- Caso seja necessário, adicionar mais itens no array `adsArray` em `ads.js` sem alterar a lógica de exibição.
- Caso queira, a próxima etapa pode ser mover os anúncios para uma API, banco ou CMS para gestão externa.
