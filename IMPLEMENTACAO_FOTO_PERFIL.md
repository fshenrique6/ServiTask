# Implementação: Foto de Perfil no Banco de Dados

## Problema Identificado
As fotos de perfil estavam sendo salvas no `localStorage` do navegador, causando o problema de uma foto aparecer para todos os usuários, quando deveria ser específica para cada usuário.

## Solução Implementada

### Backend (Java/Spring Boot)

#### 1. Entidade User
- **Arquivo**: `backend/src/main/java/com/servitask/servitask/entity/User.java`
- **Mudança**: Adicionado campo `photo` do tipo `LONGTEXT` para armazenar fotos em Base64

```java
@Column(name = "photo", columnDefinition = "LONGTEXT")
private String photo;

public String getPhoto() {
    return photo;
}

public void setPhoto(String photo) {
    this.photo = photo;
    this.updatedAt = LocalDateTime.now();
}
```

#### 2. UserController
- **Arquivo**: `backend/src/main/java/com/servitask/servitask/controller/UserController.java`
- **Mudanças**:
  - Adicionado campo `photo` na resposta do endpoint `/api/users/profile`
  - Criado novo endpoint `/api/users/upload-photo` para upload de fotos

```java
@PostMapping("/upload-photo")
public ResponseEntity<?> uploadPhoto(@RequestParam("photo") MultipartFile file, Authentication authentication) {
    // Validações de arquivo, tipo e tamanho
    // Upload usando UserService.uploadPhoto()
}
```

#### 3. UserService
- **Arquivo**: `backend/src/main/java/com/servitask/servitask/service/UserService.java`
- **Mudança**: Adicionado método `uploadPhoto()` para processar e salvar fotos

```java
@Transactional
public String uploadPhoto(String email, MultipartFile file) throws IOException {
    // Converte arquivo para Base64
    // Salva no banco de dados
    // Retorna URL da foto
}
```

#### 4. AuthResponse DTO
- **Arquivo**: `backend/src/main/java/com/servitask/servitask/dto/AuthResponse.java`
- **Mudança**: Adicionado campo `photo` para incluir foto na resposta de login/registro

#### 5. Banco de Dados
- **Arquivo**: `mysql-init/init.sql`
- **Mudança**: Adicionada coluna `photo LONGTEXT` na tabela `users`

### Frontend (React/JavaScript)

#### 1. Serviço API
- **Arquivo**: `frontend/src/services/api.js`
- **Mudanças**:
  - Método `uploadPhoto()` agora usa endpoint `/api/users/upload-photo`
  - Removidas todas as referências ao `localStorage` para fotos
  - Método `getCurrentUser()` agora busca dados atualizados do servidor
  - Métodos de login/registro recebem foto do backend

#### 2. KanbanDashboard - Botão de Usuário Principal
- **Arquivo**: `frontend/src/components/KanbanDashboard/KanbanDashboard.jsx`
- **Mudanças**:
  - Adicionado estado `user` para carregar dados do usuário
  - Botão de usuário agora exibe foto quando disponível
  - Fallback para ícone padrão quando não há foto

```jsx
<button className="user-profile-btn" onClick={toggleUserDropdown}>
  {user?.photo ? (
    <img 
      src={user.photo} 
      alt="Foto do perfil" 
      style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '50%', 
        objectFit: 'cover' 
      }}
    />
  ) : (
    <div style={{ fontSize: '32px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon emoji="👤" size={32} color="white" />
    </div>
  )}
</button>
```

#### 3. BoardSidebar - Botão de Usuário no Sidebar
- **Arquivo**: `frontend/src/components/BoardSidebar/BoardSidebar.jsx`
- **Mudanças**:
  - Adicionada seção completa do usuário no sidebar
  - Botão expandido com foto, nome e email do usuário
  - Menu dropdown com opções "Minha Conta" e "Sair"

```jsx
<div className="sidebar-user-section">
  <div className="sidebar-user-dropdown-container">
    <button className="sidebar-user-profile-btn" onClick={toggleUserDropdown}>
      {user?.photo ? (
        <img 
          src={user.photo} 
          alt="Foto do perfil" 
          className="sidebar-user-avatar"
        />
      ) : (
        <div className="sidebar-user-placeholder">
          <Icon emoji="👤" size={24} color="white" />
        </div>
      )}
      <div className="sidebar-user-info">
        <span className="sidebar-user-name">{user?.name || 'Usuário'}</span>
        <span className="sidebar-user-email">{user?.email || ''}</span>
      </div>
      <Icon emoji="⚙️" size={16} color="rgba(255, 255, 255, 0.6)" />
    </button>
  </div>
</div>
```

#### 4. Estilos CSS
- **Arquivo**: `frontend/src/components/Kanban/Kanban.css`
- **Mudanças**:
  - Adicionados estilos para `.sidebar-user-section`
  - Estilos responsivos para diferentes tamanhos de tela
  - Animações e transições suaves
  - Dropdown menu estilizado

#### 5. Remoção do localStorage
Removidas as seguintes funcionalidades que causavam o problema:
- `localStorage.setItem('userPhoto', ...)` 
- `localStorage.getItem('userPhoto')`
- Lógica de preservação de foto após logout
- Fallback para armazenamento local de fotos

## Benefícios da Implementação

1. **Isolamento por Usuário**: Cada usuário tem sua própria foto salva no banco
2. **Persistência**: Fotos não são perdidas ao limpar cache do navegador
3. **Sincronização**: Fotos aparecem em qualquer dispositivo após login
4. **Segurança**: Fotos são validadas no backend (tipo, tamanho)
5. **Escalabilidade**: Solução funciona em ambiente multi-usuário
6. **UX Melhorada**: Usuário vê sua foto em todos os botões de menu
7. **Identificação Visual**: Fácil identificação do usuário logado

## Locais onde a Foto Aparece

### 1. Dashboard Principal
- **Local**: Header do dashboard (`/kanban`)
- **Formato**: Botão circular com foto ou ícone padrão
- **Funcionalidade**: Menu dropdown com "Minha Conta" e "Sair"

### 2. Sidebar dos Quadros
- **Local**: Sidebar em qualquer quadro Kanban (`/kanban/[board-name]`)
- **Formato**: Botão expandido com foto, nome e email
- **Funcionalidade**: Menu dropdown com opções de usuário

### 3. Página de Perfil
- **Local**: Seção de foto na página de perfil (`/profile`)
- **Formato**: Foto grande com opção de alterar
- **Funcionalidade**: Upload e preview de nova foto

## Endpoints da API

### GET /api/users/profile
Retorna dados do usuário incluindo foto:
```json
{
  "id": 1,
  "name": "João Silva",
  "email": "joao@email.com",
  "role": "USER",
  "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...",
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-01T10:00:00"
}
```

### POST /api/users/upload-photo
Upload de foto de perfil:
- **Content-Type**: `multipart/form-data`
- **Parâmetro**: `photo` (arquivo de imagem)
- **Validações**: 
  - Apenas arquivos de imagem
  - Máximo 5MB
  - Formatos: JPG, PNG, GIF

**Resposta**:
```json
{
  "success": true,
  "message": "Foto atualizada com sucesso",
  "photoUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

## Como Testar

1. Faça login com um usuário
2. Acesse a página de perfil (`/profile`)
3. Faça upload de uma foto
4. **Verifique no Dashboard**: A foto deve aparecer no botão do header
5. **Verifique no Kanban**: Entre em qualquer quadro e veja a foto no sidebar
6. Faça logout e login novamente - a foto deve persistir em ambos os locais
7. Faça login com outro usuário - ele não deve ver a foto do usuário anterior
8. Faça upload de uma foto diferente para o segundo usuário
9. Alterne entre os usuários - cada um deve ver apenas sua própria foto

## Arquivos Modificados

### Backend
- `src/main/java/com/servitask/servitask/entity/User.java`
- `src/main/java/com/servitask/servitask/controller/UserController.java`
- `src/main/java/com/servitask/servitask/service/UserService.java`
- `src/main/java/com/servitask/servitask/dto/AuthResponse.java`

### Frontend
- `src/services/api.js`
- `src/components/KanbanDashboard/KanbanDashboard.jsx`
- `src/components/BoardSidebar/BoardSidebar.jsx`
- `src/components/Kanban/Kanban.css`

### Banco de Dados
- `mysql-init/init.sql`

## Observações Técnicas

- Fotos são armazenadas em Base64 no banco de dados
- Campo `photo` usa `LONGTEXT` para suportar imagens grandes
- Validação de tamanho limitada a 5MB no backend
- Frontend remove fallback para localStorage
- Endpoint de perfil sempre retorna dados atualizados do banco
- Botões de usuário têm fallback gracioso para ícone padrão
- Interface responsiva para diferentes tamanhos de tela
- Animações suaves para melhor experiência do usuário 