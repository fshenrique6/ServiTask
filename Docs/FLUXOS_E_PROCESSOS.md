🔄 FLUXOS E PROCESSOS - SERVITASK

🎯 FLUXOS PRINCIPAIS

🔐 **FLUXO DE CADASTRO**

1. Usuário acessa tela de registro
2. Preenche: nome, email, senha, confirmação
3. Sistema valida dados no frontend:
   - Nome: 2-100 caracteres
   - Email: formato válido
   - Senha: critérios de segurança
   - Confirmação: igual à senha
4. Dados são enviados para API
5. Backend valida novamente todos os campos
6. Sistema verifica se email já existe
7. Se único, cria usuário com senha criptografada
8. Gera token JWT
9. Retorna dados do usuário + token
10. Frontend salva token e redireciona para Kanban
```

🚪 **FLUXO DE LOGIN**
```
1. Usuário acessa tela de login
2. Preenche email e senha
3. Sistema valida formato básico
4. Dados são enviados para API
5. Backend busca usuário por email
6. Verifica se senha confere com hash
7. Se válido, gera novo token JWT
8. Retorna dados do usuário + token
9. Frontend salva token e redireciona para Kanban
10. Em caso de erro, exibe mensagem específica
```

📋 **FLUXO DE CRIAÇÃO DE QUADRO**
```
1. Usuário clica em "Novo Quadro"
2. Modal abre com campo de nome
3. Usuario digita nome e confirma
4. Sistema valida nome (obrigatório, 1-255 chars)
5. API cria quadro associado ao usuário
6. Sistema cria 3 colunas padrão automaticamente
7. Quadro é adicionado à lista
8. URL é atualizada com slug do quadro
9. Interface é atualizada com novo quadro ativo
```

🎫 **FLUXO DE CRIAÇÃO DE CARTÃO**
```
1. Usuário clica "+" em uma coluna
2. Modal abre com campos: título, descrição, prioridade
3. Usuario preenche dados
4. Sistema valida no frontend
5. API cria cartão na coluna especificada
6. Cartão é adicionado ao final da coluna
7. Interface é atualizada em tempo real
8. Modal é fechado automaticamente
```

🔄 **FLUXO DE DRAG & DROP**
```
1. Usuário arrasta cartão
2. Cartão recebe classe "dragging"
3. Sistema identifica coluna de destino
4. API é chamada para atualizar posição
5. Se sucesso, cartão permanece na nova posição
6. Se erro, cartão volta à posição original
7. Mensagem de feedback é exibida
```

🗑️ **FLUXO DE EXCLUSÃO (QUALQUER ITEM)**
```
1. Usuário clica no ícone de exclusão
2. Modal de confirmação é exibido
3. Modal mostra:
   - Nome do item a ser excluído
   - Aviso sobre irreversibilidade
   - Botões "Cancelar" e "Excluir"
4. Se usuário confirma, API é chamada
5. Item é removido do banco de dados
6. Interface é atualizada removendo o item
7. Mensagem de sucesso é exibida
```

---

🔧 REGRAS TÉCNICAS

### 📡 **COMUNICAÇÃO FRONTEND-BACKEND**
- **RT001**: Todas as requisições usam HTTPS em produção
- **RT002**: Token JWT é enviado no header `Authorization: Bearer <token>`
- **RT003**: Requisições POST/PUT usam Content-Type: application/json
- **RT004**: Timeout padrão de 30 segundos para requisições
- **RT005**: Retry automático em falhas de rede (máximo 3 tentativas)
- **RT006**: Fallback para cenários de API indisponível

🗄️ **ESTRUTURA DE BANCO DE DADOS**
```sql
-- Tabela de Usuários
users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)

-- Tabela de Quadros
boards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)

-- Tabela de Colunas
columns (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  board_id BIGINT NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
)

-- Tabela de Cartões
cards (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority ENUM('baixa', 'media', 'alta') DEFAULT 'media',
  column_id BIGINT NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
)
```

### 🔐 **SEGURANÇA**
- **RT007**: Senhas são criptografadas com BCrypt (cost factor 12)
- **RT008**: Tokens JWT têm expiração configurável (padrão: 24h)
- **RT009**: CORS configurado para permitir apenas origens específicas
- **RT010**: Headers de segurança obrigatórios:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
- **RT011**: Rate limiting por IP (100 req/min por padrão)
- **RT012**: Logs de segurança para tentativas de acesso não autorizado

### 📊 **PERFORMANCE**
- **RT013**: Conexões de banco configuradas com pool (min: 5, max: 20)
- **RT014**: Queries com LIMIT para evitar resultados muito grandes
- **RT015**: Índices nas colunas mais consultadas (email, foreign keys)
- **RT016**: Cache de dados do usuário por 15 minutos
- **RT017**: Lazy loading para relacionamentos JPA
- **RT018**: Compressão gzip habilitada no servidor

### 🔄 **TRANSAÇÕES**
- **RT019**: Operações de escrita usam transações explícitas
- **RT020**: Rollback automático em caso de erro
- **RT021**: Isolation level READ_COMMITTED por padrão
- **RT022**: Timeout de transação configurado (30 segundos)

---

## 📱 ESTADOS DA APLICAÇÃO

### 🔄 **ESTADOS DE LOADING**
- **Inicial**: Carregando dados do usuário
- **Quadros**: Carregando lista de quadros
- **Quadro Ativo**: Carregando dados do quadro atual
- **Criação**: Criando novo item
- **Edição**: Salvando alterações
- **Exclusão**: Removendo item
- **Movimentação**: Atualizando posição

### ⚠️ **ESTADOS DE ERRO**
- **Sem Conexão**: Internet indisponível
- **Timeout**: Requisição demorou muito
- **Não Autorizado**: Token inválido/expirado
- **Não Encontrado**: Recurso não existe
- **Conflito**: Dados duplicados
- **Erro Interno**: Problema no servidor
- **Validação**: Dados inválidos

### ✅ **ESTADOS DE SUCESSO**
- **Login Realizado**: Usuário autenticado
- **Cadastro Concluído**: Conta criada
- **Item Criado**: Quadro/Coluna/Cartão adicionado
- **Item Atualizado**: Dados salvos
- **Item Removido**: Exclusão realizada
- **Posição Atualizada**: Drag & drop concluído

---

## 🎨 PADRÕES DE INTERFACE

### 📐 **LAYOUT RESPONSIVO**
```css
/* Breakpoints */
Mobile: 320px - 767px
Tablet: 768px - 1023px
Desktop: 1024px+

/* Grid System */
Container: max-width 1200px
Gutter: 16px
Columns: 12 (desktop), 8 (tablet), 4 (mobile)
```

### 🎨 **CORES E TEMAS**
```css
/* Cores Principais */
Primary: #a78bfa (Roxo)
Secondary: #06b6d4 (Azul)
Success: #10b981 (Verde)
Warning: #f59e0b (Amarelo)
Error: #ef4444 (Vermelho)
Info: #3b82f6 (Azul Info)

/* Cores de Fundo */
Background: linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e, #0f3460)
Card: rgba(255, 255, 255, 0.1)
Modal: rgba(255, 255, 255, 0.12)

/* Tipografia */
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
Font Sizes: 0.8rem, 0.9rem, 1rem, 1.1rem, 1.2rem, 1.4rem, 1.6rem, 2rem
Line Heights: 1.2, 1.4, 1.5, 1.6
```

### 🎭 **ANIMAÇÕES**
```css
/* Durações */
Fast: 0.2s (hover, click)
Normal: 0.3s (modal, alert)
Slow: 0.5s (page transition)

/* Easing */
Ease Out: cubic-bezier(0.25, 0.46, 0.45, 0.94)
Ease In Out: cubic-bezier(0.645, 0.045, 0.355, 1)
Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 📋 CHECKLIST DE QUALIDADE

### ✅ **FUNCIONALIDADE**
- [ ] Todas as funcionalidades básicas implementadas
- [ ] Validações frontend e backend funcionando
- [ ] Tratamento de erros apropriado
- [ ] Estados de loading implementados
- [ ] Confirmações para ações destrutivas
- [ ] Drag & drop funcional
- [ ] Responsividade em todos os dispositivos

### 🔒 **SEGURANÇA**
- [ ] Autenticação JWT implementada
- [ ] Senhas criptografadas adequadamente
- [ ] Validação de entrada em todos os endpoints
- [ ] CORS configurado corretamente
- [ ] Headers de segurança definidos
- [ ] Logs de segurança implementados
- [ ] Rate limiting configurado

### 📊 **PERFORMANCE**
- [ ] Queries otimizadas
- [ ] Índices nas colunas apropriadas
- [ ] Pool de conexões configurado
- [ ] Cache implementado onde necessário
- [ ] Compressão habilitada
- [ ] Timeouts configurados adequadamente

### 🎨 **USABILIDADE**
- [ ] Interface intuitiva
- [ ] Feedback visual para todas as ações
- [ ] Mensagens de erro claras
- [ ] Navegação consistente
- [ ] Acessibilidade básica implementada
- [ ] Responsividade em todos os breakpoints

### 🧪 **TESTES**
- [ ] Testes unitários para lógica de negócio
- [ ] Testes de integração para APIs
- [ ] Testes de interface para fluxos principais
- [ ] Testes de segurança
- [ ] Testes de performance
- [ ] Testes de responsividade

---

**📝 Documento criado em:** 19/06/2025
**🔄 Última atualização:** 21/06/2025
**👨‍💻 Responsável:** Equipe ServiTask  
**📋 Versão:** 1.3