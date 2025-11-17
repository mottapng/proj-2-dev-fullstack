# 🎬 Projeto 2 — Sistema de Recomendação de Filmes (Web Fullstack)

### Disciplina: ES47B - Programação Web Fullstack

### Professor: Willian Massami Watanabe

### Grupo:

- **Victor Motta de Oliveira** - RA: 2346613
- **Vitor Encinas Negrão de Tulio** - RA: 2346621

---

## 1. Descrição do Projeto

O Projeto 2 teve como objetivo desenvolver uma aplicação web completa, baseada em uma arquitetura de **3 camadas**:  
**Frontend (SPA)** + **Backend HTTP** + **Banco de Dados**.

A temática definida a partir do Projeto 1 — **recomendação e busca de filmes** — guiou os requisitos funcionais, que incluem:

- Login
- Busca de filmes
- Inserção de novos filmes

Todas as funcionalidades foram implementadas com foco em segurança, desempenho e aderência às exigências do professor.

---

## 2. Arquitetura do Sistema

### **Frontend (SPA)**

- Desenvolvido em **React.js**
- Estilização com **Bootstrap**
- Comunica com o backend via **REST API**

### **Backend HTTP**

- Implementado com **Express.js**
- Arquitetura de pastas organizadas em:

```
src/routes/
src/models/
src/config/
```

### **Banco de Dados**

- Utilização do **MongoDB**

---

## 4. Segurança

### 🔐 Criptografia

- Hash de senhas

### 🛡 Prevenção a Injeções

- Sanitização aplicada na requisição do cliente
- Sanitização anti-injection no servidor
- Validação de parâmetros tanto no servidor quanto no cliente

### 🔑 Autenticação

- JWT assinado e validado
- Logout invalida token via blacklist
- Rate limiter por IP no login (5 tentativas/15 minutos)

---

## 5. Otimização

### ⚡ Frontend

- Compressão Gzip

### 🚀 Backend

- Middleware `compression` para reduzir o tamanho das respostas HTTP
- Rate Limite global de requisições (100 requests/15 minutos)
- Cache em memória com TTL
- Pool de conexões do MongoDB:

```
maxPoolSize: 10
serverSelectionTimeoutMS: 5000
socketTimeoutMS: 45000
```

---

## 7. Tecnologias Utilizadas

| Camada         | Tecnologias                     |
| -------------- | ------------------------------- |
| Frontend       | React.js, Bootstrap, Vite       |
| Backend        | Node.js, Express.js, JWT, mongo |
| Banco de Dados | MongoDB                         |
