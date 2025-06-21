# 📋 REGRAS DE NEGÓCIO - SERVITASK

## 🎯 VISÃO GERAL
Sistema de gerenciamento de tarefas no estilo Kanban, permitindo organização de projetos através de quadros, colunas e cartões.

---

## 👤 REGRAS DE USUÁRIO

### 📝 **Cadastro de Usuário**
- **RN001**: Email deve ser único no sistema
- **RN002**: Nome deve ter entre 2 e 100 caracteres
- **RN003**: Email deve ter formato válido (regex: `^[^\s@]+@[^\s@]+\.[^\s@]+$`)
- **RN004**: Senha deve ter no mínimo 8 caracteres
- **RN005**: Senha deve conter pelo menos:
  - 1 letra minúscula
  - 1 letra maiúscula  
  - 1 número
  - 1 caractere especial `(!@#$%^&*()_+-=[]{};"\\|,.<>/?)`
- **RN006**: Confirmação de senha deve ser idêntica à senha
- **RN007**: Nome será normalizado (trim) antes de salvar
- **RN008**: Email será normalizado (lowercase + trim) antes de salvar
- **RN009**: Tentativa de cadastro com email existente retorna erro 409 Conflict

### 🔐 **Autenticação**
- **RN010**: Login requer email e senha válidos
- **RN011**: Email deve ter formato válido no login
- **RN012**: Senha deve ter no mínimo 6 caracteres no login
- **RN013**: Credenciais inválidas retornam erro 401 Unauthorized
- **RN014**: Login bem-sucedido gera token JWT
- **RN015**: Token JWT é válido por tempo determinado
- **RN016**: Email é normalizado (lowercase + trim) no login

### 👤 **Perfil do Usuário**
- **RN017**: Usuário pode alterar seu nome
- **RN018**: Nome no perfil deve ter entre 2 e 100 caracteres
- **RN019**: Usuário pode alterar sua senha
- **RN020**: Para alterar senha, deve informar senha atual correta
- **RN021**: Nova senha deve ser diferente da senha atual
- **RN022**: Nova senha deve atender critérios de segurança (RN005)
- **RN023**: Alteração de perfil requer autenticação via token JWT

---

## 📋 REGRAS DE QUADROS (BOARDS)

### 📊 **Criação de Quadros**
- **RN024**: Usuário autenticado pode criar quadros
- **RN025**: Nome do quadro é obrigatório
- **RN026**: Nome do quadro deve ter entre 1 e 255 caracteres
- **RN027**: Quadro criado automaticamente recebe 3 colunas padrão:
  - "A Fazer"
  - "Em Progresso" 
  - "Concluído"
- **RN028**: Quadro é associado ao usuário que o criou
- **RN029**: URL do quadro usa slug baseado no nome

### 🔍 **Visualização de Quadros**
- **RN030**: Usuário só vê quadros que criou
- **RN031**: Lista de quadros é ordenada por data de criação
- **RN032**: Primeiro quadro da lista é selecionado automaticamente
- **RN033**: Quadro ativo é destacado visualmente na navegação

### ✏️ **Edição de Quadros**
- **RN034**: Usuário pode editar nome dos próprios quadros
- **RN035**: Nome editado deve atender critérios de RN026
- **RN036**: Alteração do nome atualiza a URL (slug)

### 🗑️ **Exclusão de Quadros**
- **RN037**: Usuário pode excluir apenas próprios quadros
- **RN038**: Exclusão de quadro requer confirmação explícita
- **RN039**: Modal de confirmação deve exibir:
  - Nome do quadro a ser excluído
  - Aviso que ação é irreversível
  - Botões "Cancelar" e "Excluir Quadro"
- **RN040**: Exclusão remove quadro e todos seus dados (colunas + cartões)
- **RN041**: Se quadro excluído era o ativo, sistema redireciona para primeiro quadro restante
- **RN042**: Se era o último quadro, redireciona para tela inicial

---

## 📂 REGRAS DE COLUNAS

### ➕ **Criação de Colunas**
- **RN043**: Usuário pode adicionar colunas aos próprios quadros
- **RN044**: Nova coluna recebe nome padrão "Nova Coluna"
- **RN045**: Coluna é adicionada ao final da lista
- **RN046**: Máximo de colunas por quadro não definido (limitado pela interface)

### ✏️ **Edição de Colunas**
- **RN047**: Usuário pode editar nome das colunas dos próprios quadros
- **RN048**: Nome da coluna é obrigatório
- **RN049**: Nome da coluna deve ter entre 1 e 255 caracteres
- **RN050**: Edição abre modal com campo pré-preenchido

### 🗑️ **Exclusão de Colunas**
- **RN051**: Usuário pode excluir colunas dos próprios quadros
- **RN052**: Exclusão de coluna requer confirmação explícita
- **RN053**: Modal de confirmação deve exibir:
  - Nome da coluna a ser excluída
  - Aviso que ação é irreversível
  - Aviso que cartões da coluna serão perdidos
- **RN054**: Exclusão remove coluna e todos seus cartões
- **RN055**: Não é possível excluir se restar apenas 1 coluna

---

## 🎫 REGRAS DE CARTÕES (CARDS)

### ➕ **Criação de Cartões**
- **RN056**: Usuário pode adicionar cartões às colunas dos próprios quadros
- **RN057**: Título do cartão é obrigatório
- **RN058**: Título deve ter entre 1 e 255 caracteres
- **RN059**: Descrição é opcional
- **RN060**: Descrição pode ter até 100 caracteres
- **RN060.1**: Campo de descrição exibe contador dinâmico (0/100)
- **RN060.2**: Contador fica vermelho quando excede limite
- **RN060.3**: Botão salvar fica desabilitado quando excede limite
- **RN060.4**: Mensagem de erro é exibida quando excede limite
- **RN061**: Prioridade é obrigatória com opções:
  - "baixa" (padrão)
  - "media"
  - "alta"
- **RN062**: Cartão é adicionado ao final da coluna
- **RN063**: Data de criação é registrada automaticamente

### 👁️ **Visualização de Cartões**
- **RN064**: Cartões são exibidos em ordem de criação
- **RN065**: Prioridade é indicada por cores visuais:
  - Baixa: Verde
  - Média: Amarela/Laranja
  - Alta: Vermelha
- **RN066**: Data de criação é exibida em formato relativo
- **RN067**: Descrição é truncada se muito longa
- **RN068**: Hover no cartão aplica efeito visual (elevação)

### ✏️ **Edição de Cartões**
- **RN069**: Usuário pode editar cartões dos próprios quadros
- **RN070**: Modal de edição pré-preenche todos os campos
- **RN071**: Mesmas regras de validação da criação se aplicam
- **RN072**: Alterações são salvas imediatamente após confirmação

### 🗑️ **Exclusão de Cartões**
- **RN073**: Usuário pode excluir cartões dos próprios quadros
- **RN074**: Exclusão requer confirmação explícita
- **RN075**: Modal de confirmação deve exibir:
  - Título do cartão a ser excluído
  - Aviso que ação é irreversível
- **RN076**: Exclusão remove cartão permanentemente

### 🔄 **Movimentação de Cartões (Drag & Drop)**
- **RN077**: Cartões podem ser arrastados entre colunas
- **RN078**: Durante o arraste, cartão recebe classe visual "dragging"
- **RN079**: Posição é atualizada no backend após o drop
- **RN080**: Falha na movimentação exibe mensagem de erro
- **RN081**: Sistema reverte visualmente se operação falhar

---

## ✅ REGRAS DE VALIDAÇÃO

### 🔍 **Validação Frontend**
- **RN082**: Campos obrigatórios são validados antes do envio
- **RN083**: Formato de email é validado em tempo real
- **RN084**: Critérios de senha são exibidos visualmente durante digitação
- **RN085**: Mensagens de erro são específicas por tipo de problema
- **RN086**: Campos são normalizados antes do envio (trim, lowercase onde aplicável)

### 🛡️ **Validação Backend**
- **RN087**: Todas as validações frontend são revalidadas no backend
- **RN088**: Anotações Bean Validation (@NotBlank, @Size, @Email, @Pattern)
- **RN089**: Validações customizadas para regras de negócio específicas
- **RN090**: Erros retornam códigos HTTP apropriados (400, 401, 403, 404, 409, 500)
- **RN091**: Respostas de erro são padronizadas com timestamp e estrutura consistente

---

## 🎨 REGRAS DE INTERFACE

### 🚀 **Estados de Loading**
- **RN092**: Operações assíncronas exibem indicador de loading
- **RN093**: Botões ficam desabilitados durante processamento
- **RN094**: Loading spinner é exibido para operações longas
- **RN095**: Estados de loading impedem múltiplos cliques acidentais

### 📱 **Responsividade**
- **RN096**: Interface adapta-se a diferentes tamanhos de tela
- **RN097**: Em mobile, navegação é colapsável
- **RN098**: Cartões mantêm legibilidade em telas pequenas
- **RN099**: Modais ajustam-se ao viewport disponível

### 🎯 **Feedback Visual**
- **RN100**: Sucesso é indicado por alertas verdes
- **RN101**: Erros são indicados por alertas vermelhos
- **RN102**: Avisos são indicados por alertas amarelos
- **RN103**: Informações são indicadas por alertas azuis
- **RN104**: Alertas podem ser fechados manualmente
- **RN105**: Alguns alertas fecham automaticamente após 5 segundos

### ⌨️ **Acessibilidade**
- **RN106**: Modais focam automaticamente no primeiro campo
- **RN107**: Navegação por teclado é suportada
- **RN108**: Botões têm labels acessíveis
- **RN109**: Cores não são a única forma de transmitir informação

---

## 🔒 REGRAS DE SEGURANÇA

### 🛡️ **Autenticação e Autorização**
- **RN110**: Todas as rotas da aplicação requerem autenticação
- **RN111**: Token JWT deve ser enviado no header Authorization
- **RN112**: Token expirado resulta em redirecionamento para login
- **RN113**: Usuário só acessa próprios dados (quadros, colunas, cartões)
- **RN114**: Tentativas de acesso não autorizado retornam 403 Forbidden

### 🔐 **Proteção de Dados**
- **RN115**: Senhas são criptografadas com hash seguro
- **RN116**: Senhas nunca são retornadas em APIs
- **RN117**: Dados sensíveis não são logados
- **RN118**: CORS configurado para domínios específicos
- **RN119**: Headers de segurança apropriados são enviados

### 🚫 **Validação de Entrada**
- **RN120**: Todos os inputs são sanitizados
- **RN121**: Tamanhos máximos são respeitados (prevenção DoS)
- **RN122**: Caracteres especiais em nomes são permitidos mas controlados
- **RN123**: XSS é prevenido por escape de dados
- **RN124**: SQL Injection é prevenido por prepared statements (JPA)

---

## 📊 REGRAS DE PERFORMANCE

### ⚡ **Otimizações**
- **RN125**: Operações críticas usam transações de banco
- **RN126**: Consultas são otimizadas para o mínimo de dados necessários
- **RN127**: Estados de loading previnem requisições duplicadas
- **RN128**: Cache é utilizado onde apropriado (tokens, dados do usuário)

### 📱 **Experiência do Usuário**
- **RN129**: Operações rápidas (<100ms) não exibem loading
- **RN130**: Operações lentas (>500ms) exibem progresso
- **RN131**: Timeouts apropriados para requisições
- **RN132**: Fallbacks para quando APIs não estão disponíveis

---

## 🔄 REGRAS DE INTEGRAÇÃO

### 🌐 **API REST**
- **RN133**: APIs seguem padrões RESTful
- **RN134**: Códigos HTTP são usados corretamente
- **RN135**: Payloads JSON são bem estruturados
- **RN136**: Versionamento de API é considerado para futuras mudanças
- **RN137**: Rate limiting pode ser implementado se necessário

### 🗄️ **Banco de Dados**
- **RN138**: Integridade referencial é mantida
- **RN139**: Constraints apropriadas previnem dados inválidos
- **RN140**: Índices otimizam consultas frequentes
- **RN141**: Migrations controlam evolução do schema

---

## 📈 REGRAS DE MONITORAMENTO

### 📊 **Logs e Auditoria**
- **RN142**: Ações críticas são logadas (criação, edição, exclusão)
- **RN143**: Erros são registrados com contexto suficiente
- **RN144**: Logs não contêm informações sensíveis
- **RN145**: Estrutura de logs permite análise automatizada

### 🔍 **Métricas**
- **RN146**: Performance de APIs é monitorada
- **RN147**: Erros são categorizados e contabilizados
- **RN148**: Uso de recursos é acompanhado
- **RN149**: Alertas automáticos para problemas críticos

---

## 🚀 REGRAS DE DEPLOY

### 🐳 **Containerização**
- **RN150**: Aplicação roda em containers Docker
- **RN151**: Configurações são externalizadas via variáveis de ambiente
- **RN152**: Healthchecks verificam status da aplicação
- **RN153**: Recursos são limitados adequadamente

### 🔧 **Configuração**
- **RN154**: Diferentes perfis para dev/prod
- **RN155**: Secrets são injetados de forma segura
- **RN156**: Backup de dados é configurado
- **RN157**: SSL/TLS obrigatório em produção

---

**📝 Documento criado em:** 19/06/2025
**🔄 Última atualização:** 21/06/2025
**👨‍💻 Responsável:** Equipe ServiTask  
**📋 Versão:** 1.3