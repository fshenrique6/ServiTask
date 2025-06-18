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

#### 2. Remoção do localStorage
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
2. Acesse a página de perfil
3. Faça upload de uma foto
4. Faça logout e login novamente - a foto deve persistir
5. Faça login com outro usuário - ele não deve ver a foto do usuário anterior
6. Faça upload de uma foto diferente para o segundo usuário
7. Alterne entre os usuários - cada um deve ver apenas sua própria foto

## Arquivos Modificados

### Backend
- `src/main/java/com/servitask/servitask/entity/User.java`
- `src/main/java/com/servitask/servitask/controller/UserController.java`
- `src/main/java/com/servitask/servitask/service/UserService.java`
- `src/main/java/com/servitask/servitask/dto/AuthResponse.java`

### Frontend
- `src/services/api.js`

### Banco de Dados
- `mysql-init/init.sql`

## Observações Técnicas

- Fotos são armazenadas em Base64 no banco de dados
- Campo `photo` usa `LONGTEXT` para suportar imagens grandes
- Validação de tamanho limitada a 5MB no backend
- Frontend remove fallback para localStorage
- Endpoint de perfil sempre retorna dados atualizados do banco 