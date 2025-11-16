# Filmes App - Backend API

Especificação completa da API REST para o sistema de gerenciamento de filmes.

## 📋 Índice

- [Base URL](#base-url)
- [Autenticação](#autenticação)
- [Endpoints](#endpoints)
  - [Autenticação](#1-autenticação)
  - [Filmes](#2-filmes)
- [Modelos de Dados](#modelos-de-dados)
- [Códigos de Status HTTP](#códigos-de-status-http)
- [Tratamento de Erros](#tratamento-de-erros)

## 🌐 Base URL

```
http://localhost:3000/api
```

Todas as rotas devem ser prefixadas com `/api`.

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via **Bearer Token** no header:

```
Authorization: Bearer {token}
```

O token é obtido através do endpoint de login e deve ser enviado em todas as requisições protegidas.

---

## 📡 Endpoints

### 1. Autenticação

#### 1.1 Login

Autentica um usuário e retorna um token de acesso.

**Endpoint:** `POST /auth/login`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

**Response 200 (Success):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@email.com",
    "name": "Nome do Usuário"
  }
}
```

**Response 401 (Unauthorized):**

```json
{
  "message": "Email ou senha inválidos",
  "error": "Invalid credentials"
}
```

**Response 400 (Bad Request):**

```json
{
  "message": "Email e senha são obrigatórios",
  "error": "Validation error"
}
```

---

### 2. Filmes

#### 2.1 Buscar Filmes

Busca filmes no sistema com base em uma query de busca.

**Endpoint:** `GET /movies`

**Headers:**

```
Authorization: Bearer {token}
```

**Query Parameters:**

- `query` (string, obrigatório) - Termo de busca

**Exemplo:**

```
GET /movies?query=matrix
```

**Response 200 (Success):**

```json
[
  {
    "id": 1,
    "title": "Matrix",
    "year": 1999,
    "genre": "Ficção Científica",
    "director": "Lana Wachowski, Lilly Wachowski",
    "rating": 8.7,
    "description": "Um programador descobre que a realidade é uma simulação..."
  },
  {
    "id": 2,
    "title": "Matrix Reloaded",
    "year": 2003,
    "genre": "Ficção Científica",
    "director": "Lana Wachowski, Lilly Wachowski",
    "rating": 7.2,
    "description": "Continuação da saga Matrix..."
  }
]
```

**Response 200 (Nenhum resultado):**

```json
[]
```

**Response 400 (Bad Request):**

```json
{
  "message": "Query de busca é obrigatória",
  "error": "Validation error"
}
```

**Response 401 (Unauthorized):**

```json
{
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

**Nota:** A busca deve procurar em todos os campos do filme (título, diretor, gênero, descrição).

---

#### 2.2 Inserir Filme

Adiciona um novo filme ao sistema.

**Endpoint:** `POST /movies`

**Headers:**

```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**

```json
{
  "title": "O Poderoso Chefão",
  "year": 1972,
  "genre": "Drama",
  "director": "Francis Ford Coppola",
  "rating": 9.2,
  "description": "A história da família Corleone, uma das mais poderosas famílias do crime organizado..."
}
```

**Response 201 (Created):**

```json
{
  "id": 3,
  "title": "O Poderoso Chefão",
  "year": 1972,
  "genre": "Drama",
  "director": "Francis Ford Coppola",
  "rating": 9.2,
  "description": "A história da família Corleone, uma das mais poderosas famílias do crime organizado...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Response 400 (Bad Request - Validação):**

```json
{
  "message": "Erro de validação",
  "error": "Validation error",
  "details": {
    "title": "Título é obrigatório",
    "year": "Ano deve ser um número válido",
    "rating": "Nota deve ser entre 0 e 10"
  }
}
```

**Response 401 (Unauthorized):**

```json
{
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

**Response 409 (Conflict - Filme já existe):**

```json
{
  "message": "Filme com este título e ano já existe",
  "error": "Duplicate entry"
}
```

---

## 📊 Modelos de Dados

### Usuário (User)

```typescript
{
  id: number;
  email: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Filme (Movie)

```typescript
{
  id: number;
  title: string;
  year: number;
  genre: string;
  director: string;
  rating: number; // 0-10, aceita decimais
  description: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### Token de Autenticação

```typescript
{
  token: string; // JWT token
  user: User;
}
```

---

## 📈 Códigos de Status HTTP

| Código | Descrição             | Uso                                       |
| ------ | --------------------- | ----------------------------------------- |
| 200    | OK                    | Requisição bem-sucedida (GET, PUT)        |
| 201    | Created               | Recurso criado com sucesso (POST)         |
| 400    | Bad Request           | Erro de validação ou dados inválidos      |
| 401    | Unauthorized          | Token ausente, inválido ou expirado       |
| 403    | Forbidden             | Acesso negado (não usado no escopo atual) |
| 404    | Not Found             | Recurso não encontrado                    |
| 409    | Conflict              | Conflito (ex: filme duplicado)            |
| 500    | Internal Server Error | Erro interno do servidor                  |

---

## ⚠️ Tratamento de Erros

### Formato Padrão de Erro

Todas as respostas de erro seguem o formato:

```json
{
  "message": "Mensagem de erro amigável",
  "error": "Tipo do erro (opcional)"
}
```

### Exemplos de Erros

**Validação:**

```json
{
  "message": "Erro de validação",
  "error": "Validation error",
  "details": {
    "campo": "Mensagem específica do campo"
  }
}
```

**Autenticação:**

```json
{
  "message": "Token inválido ou expirado",
  "error": "Unauthorized"
}
```

**Servidor:**

```json
{
  "message": "Erro interno do servidor",
  "error": "Internal Server Error"
}
```

---

## 🔍 Exemplos de Requisições

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@email.com",
    "password": "senha123"
  }'
```

### Buscar Filmes

```bash
curl -X GET "http://localhost:3000/api/movies?query=matrix" \
  -H "Authorization: Bearer {token}"
```

### Inserir Filme

```bash
curl -X POST http://localhost:3000/api/movies \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Matrix",
    "year": 1999,
    "genre": "Ficção Científica",
    "director": "Lana Wachowski, Lilly Wachowski",
    "rating": 8.7,
    "description": "Um programador descobre que a realidade é uma simulação..."
  }'
```
