# Banco de Português — Mobile

Aplicativo em React Native com Expo para acesso ao Banco de Questões de Língua Portuguesa.

## Funcionalidades

- Login pelo endpoint `POST /api/auth/login` e sessão JWT persistida no SecureStore do dispositivo.
- Questões de Gramática e Literatura com filtros de matéria, banca e dificuldade.
- Exibição de alternativas, resposta, comentário e material de apoio.
- Navegação por abas e opção para encerrar a sessão.

## Executar

1. Instale as dependências com `npm install`.
2. Copie `.env.example` para `.env` e configure `EXPO_PUBLIC_API_URL` com a URL base do backend (sem `/api`), por exemplo:

   ```env
   EXPO_PUBLIC_API_URL=https://seu-backend.example.com
   ```

3. Inicie o Expo com `npx expo start` e abra no Expo Go ou em um emulador.

O endereço publicado informado para o site é usado como padrão quando `EXPO_PUBLIC_API_URL` não está definida. No momento da migração, as rotas `/api/auth/login` e `/api/questoes` nesse domínio respondiam com 404; configure a URL de um backend que esteja servindo essas rotas para autenticar e carregar questões.

## API utilizada

- `POST /api/auth/login`, corpo `{ "email": "...", "password": "..." }`, resposta `{ "token": "..." }`.
- `GET /api/questoes?nomet=...&instituicao=...&nomed=...`, resposta em lista de questões.

Não inclua credenciais ou segredos em variáveis `EXPO_PUBLIC_`: elas ficam visíveis no app compilado. O token de sessão no Android/iOS é guardado pelo Expo SecureStore.
