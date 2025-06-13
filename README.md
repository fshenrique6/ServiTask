# ServiTask - Sistema de Autenticação

Sistema de gerenciamento de tarefas com autenticação completa usando banco de dados.

## 🚀 Como usar

### 1. Iniciar o sistema
```bash
docker-compose up -d --build
```

### 2. Acessar a aplicação
- **Frontend**: http://localhost:3310
- **Backend API**: http://localhost:8083

### 3. Criar sua conta
1. Acesse http://localhost:3310
2. Clique em "Criar conta"
3. Preencha seus dados
4. Faça login automaticamente

### 4. Fazer login
1. Use seu email e senha cadastrados
2. Acesse o dashboard após o login

## 🔧 Características

- ✅ **Cadastro de usuários** no banco de dados MySQL
- ✅ **Login com JWT** para autenticação
- ✅ **Sem usuários padrão** - todos devem se cadastrar
- ✅ **Interface moderna** e responsiva
- ✅ **Validações completas** no frontend e backend
- ✅ **Tratamento de erros** com mensagens claras

## 🛠️ Tecnologias

- **Backend**: Spring Boot, Spring Security, JWT, Java
- **Frontend**: React, JavaScript
- **Banco**: MySQL
- **Deploy**: Docker Compose
