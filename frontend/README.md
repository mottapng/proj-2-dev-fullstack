# Filmes App - Frontend

Aplicação React para gerenciamento de filmes.

## 🚀 Tecnologias

- **React 19.2.0** - Biblioteca JavaScript para construção de interfaces
- **Vite 7.2.2** - Build tool e dev server
- **React Router DOM 7.9.6** - Roteamento
- **Bootstrap 5.3.8** - Framework CSS

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Layout.jsx      # Layout principal com header
│   │   ├── ProtectedRoute.jsx  # Proteção de rotas
│   │   └── Toast.jsx        # Componente de notificação
│   ├── context/             # Contextos React
│   │   └── AuthContext.jsx # Contexto de autenticação
│   ├── pages/               # Páginas da aplicação
│   │   ├── LoginPage.jsx    # Página de login
│   │   ├── SearchPage.jsx   # Página de busca
│   │   └── InsertPage.jsx   # Página de inserção
│   ├── services/            # Serviços de API
│   │   └── api.js          # Configuração do Axios e funções de API
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Ponto de entrada
├── package.json
└── vite.config.js
```

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend:

```env
VITE_API_URL=http://localhost:3000/api
```

Se não especificado, o padrão é `http://localhost:3000/api`.

## 🎨 Funcionalidades

### Autenticação

- Login com email e senha
- Token armazenado no localStorage
- Verificação automática de autenticação ao carregar
- Logout com limpeza de dados

### Páginas

#### Login (`/login`)

- Formulário de autenticação
- Validação de campos
- Feedback visual de erros via Toast
- Redirecionamento automático após login

#### Busca (`/search`)

- Busca de filmes com debounce (500ms)
- Exibição de resultados em tabela
- Campos: Título, Ano, Gênero, Diretor, Nota, Descrição
- Mensagens de feedback via Toast

#### Inserção (`/insert`)

- Formulário completo para adicionar filmes
- Validação de todos os campos
- Feedback de sucesso/erro via Toast
- Limpeza automática após sucesso

## 🔐 Rotas Protegidas

As rotas `/search` e `/insert` são protegidas e requerem autenticação. O componente `ProtectedRoute` redireciona automaticamente para `/login` se o usuário não estiver autenticado.
