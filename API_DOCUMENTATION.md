# 🚀 API DOCUMENTATION - SERVITASK

## 📋 VISÃO GERAL
API REST para gerenciamento de tarefas no estilo Kanban.

**Base URL:** `http://localhost:8083/api`  
**Autenticação:** JWT Bearer Token  
**Content-Type:** `application/json`

---

## 🔐 AUTENTICAÇÃO

### 📝 **POST /auth/register**
Cadastra um novo usuário no sistema.

**Request Body:**
```json
{
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "password": "MinhaSenh@123",
  "confirmPassword": "MinhaSenh@123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "role": "USER"
}
```

**Possíveis Erros:**
- `400` - Dados inválidos
- `409` - Email já cadastrado

---

### 🚪 **POST /auth/login**
Autentica um usuário existente.

**Request Body:**
```json
{
  "email": "joao@exemplo.com",
  "password": "MinhaSenh@123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "userId": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "role": "USER"
}
```

**Possíveis Erros:**
- `400` - Dados inválidos
- `401` - Credenciais incorretas

---

### 👤 **GET /auth/me**
Retorna informações do usuário autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "role": "USER",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Possíveis Erros:**
- `401` - Token inválido/expirado
- `404` - Usuário não encontrado

---

### ✏️ **PUT /auth/update-profile**
Atualiza o perfil do usuário.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "João Silva Santos"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Perfil atualizado com sucesso",
  "name": "João Silva Santos"
}
```

**Possíveis Erros:**
- `400` - Dados inválidos
- `401` - Token inválido/expirado

---

### 🔐 **PUT /auth/update-password**
Altera a senha do usuário.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "currentPassword": "MinhaSenh@123",
  "newPassword": "NovaSenha@456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Senha atualizada com sucesso"
}
```

**Possíveis Erros:**
- `400` - Dados inválidos / Nova senha igual à atual
- `401` - Token inválido / Senha atual incorreta

---

### 📧 **POST /auth/check-email**
Verifica se um email já está em uso.

**Request Body:**
```json
{
  "email": "teste@exemplo.com"
}
```

**Response (200):**
```json
{
  "exists": true
}
```

---

### 🔍 **GET /auth/test**
Endpoint de teste para verificar se a API está funcionando.

**Response (200):**
```
Endpoint de autenticação funcionando!
```

---

## 📋 QUADROS (BOARDS)

### 📊 **GET /boards**
Lista todos os quadros do usuário autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Projeto Principal",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T15:45:00Z",
    "columns": [
      {
        "id": 1,
        "name": "A Fazer",
        "position": 0,
        "cards": [
          {
            "id": 1,
            "title": "Implementar login",
            "description": "Criar tela de login com validações",
            "priority": "alta",
            "position": 0,
            "createdAt": "2024-01-15T11:00:00Z"
          }
        ]
      }
    ]
  }
]
```

---

### ➕ **POST /boards**
Cria um novo quadro.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "Novo Projeto"
}
```

**Response (201):**
```json
{
  "id": 2,
  "name": "Novo Projeto",
  "createdAt": "2024-01-15T16:00:00Z",
  "updatedAt": "2024-01-15T16:00:00Z",
  "columns": [
    {
      "id": 4,
      "name": "A Fazer",
      "position": 0,
      "cards": []
    },
    {
      "id": 5,
      "name": "Em Progresso",
      "position": 1,
      "cards": []
    },
    {
      "id": 6,
      "name": "Concluído",
      "position": 2,
      "cards": []
    }
  ]
}
```

---

### 🔍 **GET /boards/{id}**
Retorna um quadro específico com todas as colunas e cartões.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Projeto Principal",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T15:45:00Z",
  "columns": [...]
}
```

**Possíveis Erros:**
- `404` - Quadro não encontrado
- `403` - Usuário não tem acesso ao quadro

---

### ✏️ **PUT /boards/{id}**
Atualiza o nome de um quadro.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "Projeto Atualizado"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Projeto Atualizado",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T16:30:00Z"
}
```

---

### 🗑️ **DELETE /boards/{id}**
Exclui um quadro e todos os seus dados.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quadro excluído com sucesso"
}
```

---

## 📂 COLUNAS

### ➕ **POST /boards/{boardId}/columns**
Adiciona uma nova coluna ao quadro.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "Nova Coluna"
}
```

**Response (201):**
```json
{
  "id": 7,
  "name": "Nova Coluna",
  "position": 3,
  "boardId": 1,
  "cards": []
}
```

---

### ✏️ **PUT /boards/{boardId}/columns/{columnId}**
Atualiza o nome de uma coluna.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "name": "Coluna Atualizada"
}
```

**Response (200):**
```json
{
  "id": 7,
  "name": "Coluna Atualizada",
  "position": 3,
  "boardId": 1
}
```

---

### 🗑️ **DELETE /boards/{boardId}/columns/{columnId}**
Exclui uma coluna e todos os seus cartões.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Coluna excluída com sucesso"
}
```

---

## 🎫 CARTÕES

### ➕ **POST /boards/{boardId}/columns/{columnId}/cards**
Adiciona um novo cartão à coluna.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "Nova Tarefa",
  "description": "Descrição da tarefa",
  "priority": "media"
}
```

**Response (201):**
```json
{
  "id": 15,
  "title": "Nova Tarefa",
  "description": "Descrição da tarefa",
  "priority": "media",
  "position": 2,
  "columnId": 1,
  "createdAt": "2024-01-15T17:00:00Z",
  "updatedAt": "2024-01-15T17:00:00Z"
}
```

---

### ✏️ **PUT /boards/{boardId}/columns/{columnId}/cards/{cardId}**
Atualiza um cartão existente.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "title": "Tarefa Atualizada",
  "description": "Nova descrição",
  "priority": "alta"
}
```

**Response (200):**
```json
{
  "id": 15,
  "title": "Tarefa Atualizada",
  "description": "Nova descrição",
  "priority": "alta",
  "position": 2,
  "columnId": 1,
  "createdAt": "2024-01-15T17:00:00Z",
  "updatedAt": "2024-01-15T17:30:00Z"
}
```

---

### 🔄 **PUT /boards/{boardId}/cards/{cardId}/move**
Move um cartão para outra coluna/posição.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "newColumnId": 2,
  "newPosition": 0
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cartão movido com sucesso"
}
```

---

### 🗑️ **DELETE /boards/{boardId}/columns/{columnId}/cards/{cardId}**
Exclui um cartão.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cartão excluído com sucesso"
}
```

---

## ❌ CÓDIGOS DE ERRO

### 🔍 **Estrutura Padrão de Erro**
```json
{
  "success": false,
  "message": "Descrição do erro",
  "error": "Detalhes técnicos (opcional)",
  "errors": {
    "campo": "Mensagem específica do campo"
  },
  "timestamp": "2024-01-15T17:30:00Z"
}
```

### 📋 **Códigos HTTP**

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| **200** | OK | Operação realizada com sucesso |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Dados inválidos na requisição |
| **401** | Unauthorized | Token inválido ou credenciais incorretas |
| **403** | Forbidden | Usuário não tem permissão |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Conflito (ex: email duplicado) |
| **500** | Internal Server Error | Erro interno do servidor |

### 🚨 **Exemplos de Erros Comuns**

**Dados Inválidos (400):**
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": {
    "email": "Email deve ter um formato válido",
    "password": "Senha deve ter pelo menos 8 caracteres"
  },
  "timestamp": "2024-01-15T17:30:00Z"
}
```

**Token Inválido (401):**
```json
{
  "success": false,
  "message": "Credenciais inválidas",
  "error": "Token JWT expirado ou inválido",
  "timestamp": "2024-01-15T17:30:00Z"
}
```

**Recurso Não Encontrado (404):**
```json
{
  "success": false,
  "message": "Quadro não encontrado",
  "timestamp": "2024-01-15T17:30:00Z"
}
```

**Email Duplicado (409):**
```json
{
  "success": false,
  "message": "Este email já está em uso",
  "timestamp": "2024-01-15T17:30:00Z"
}
```

---

## 🔧 INFORMAÇÕES TÉCNICAS

### 📡 **Headers Obrigatórios**
```
Content-Type: application/json
Authorization: Bearer {token} (exceto endpoints públicos)
```

### 🔄 **CORS**
A API está configurada para aceitar requisições de qualquer origem durante desenvolvimento:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

### ⏱️ **Rate Limiting**
- **Limite**: 100 requisições por minuto por IP
- **Headers de resposta**:
  - `X-RateLimit-Limit`: Limite máximo
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset

### 🔐 **Autenticação JWT**
- **Algoritmo**: HS256
- **Expiração**: 24 horas (configurável)
- **Header**: `Authorization: Bearer {token}`
- **Claims**: userId, email, role, exp, iat

### 📦 **Versionamento**
- **Versão atual**: v1
- **URL base**: `/api` (sem versão explícita)
- **Futuras versões**: `/api/v2`, `/api/v3`, etc.

---

## 🧪 EXEMPLOS DE TESTES

### 📝 **Teste de Cadastro (cURL)**
```bash
curl -X POST http://localhost:8083/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@exemplo.com",
    "password": "Teste@123",
    "confirmPassword": "Teste@123"
  }'
```

### 🚪 **Teste de Login (cURL)**
```bash
curl -X POST http://localhost:8083/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste@exemplo.com",
    "password": "Teste@123"
  }'
```

### 📋 **Teste de Criação de Quadro (cURL)**
```bash
curl -X POST http://localhost:8083/api/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "name": "Meu Quadro de Testes"
  }'
```

### 🎫 **Teste de Criação de Cartão (cURL)**
```bash
curl -X POST http://localhost:8083/api/boards/1/columns/1/cards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "title": "Minha Tarefa",
    "description": "Descrição da tarefa",
    "priority": "alta"
  }'
```

---

**📝 Documento criado em:** $(date)  
**🔄 Última atualização:** $(date)  
**👨‍💻 Responsável:** Equipe ServiTask  
**📋 Versão:** 1.0 