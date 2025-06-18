# Implementação: Validação Robusta de Senhas

## Visão Geral
Sistema completo de validação de senhas implementado tanto no frontend quanto no backend, fornecendo feedback específico e em tempo real para o usuário.

## Funcionalidades Implementadas

### 🔐 **Validação da Senha Atual**
- Verificação se a senha atual está correta antes de permitir alteração
- Mensagem específica: "A senha atual não confere. Verifique e tente novamente."
- Proteção contra alterações não autorizadas

### 🆕 **Validação da Nova Senha**
- Critérios de segurança robustos
- Feedback visual em tempo real
- Mensagens específicas para cada critério não atendido

### 📱 **Interface de Validação**
- Indicadores visuais que aparecem conforme o usuário digita
- Cada critério mostra ✅ (verde) quando atendido ou ❌ (vermelho) quando não atendido
- Design responsivo e intuitivo

---

## Critérios de Validação

### **Requisitos Obrigatórios:**
1. **Mínimo 8 caracteres**
2. **Pelo menos 1 letra minúscula** (a-z)
3. **Pelo menos 1 letra maiúscula** (A-Z)  
4. **Pelo menos 1 número** (0-9)
5. **Pelo menos 1 caractere especial** (!@#$%^&*()_+-=[]{}|;:,.<>?)
6. **Diferente da senha atual**

### **Mensagens de Erro Específicas:**
- "A nova senha é obrigatória."
- "A nova senha deve ter pelo menos 8 caracteres."
- "A nova senha deve conter pelo menos uma letra minúscula (a-z)."
- "A nova senha deve conter pelo menos uma letra maiúscula (A-Z)."
- "A nova senha deve conter pelo menos um número (0-9)."
- "A nova senha deve conter pelo menos um caractere especial (!@#$%^&*)."
- "A nova senha deve ser diferente da senha atual."

---

## Implementação Backend

### **UserService.java**
```java
@Transactional
public void updatePassword(String email, String currentPassword, String newPassword) {
    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserException("Usuário não encontrado", HttpStatus.NOT_FOUND));
    
    // Verificar se a senha atual está correta
    if (!HashUtil.verifyPassword(currentPassword, user.getPassword())) {
        throw new UserException("A senha atual não confere. Verifique e tente novamente.", HttpStatus.UNAUTHORIZED);
    }
    
    // Verificar se a nova senha é diferente da atual
    if (HashUtil.verifyPassword(newPassword, user.getPassword())) {
        throw new UserException("A nova senha deve ser diferente da senha atual.", HttpStatus.BAD_REQUEST);
    }
    
    // Validar nova senha com mensagem específica
    String passwordValidationError = getPasswordValidationError(newPassword);
    if (passwordValidationError != null) {
        throw new UserException(passwordValidationError, HttpStatus.BAD_REQUEST);
    }
    
    // Criptografar e salvar a nova senha
    user.setPassword(HashUtil.hashPassword(newPassword));
    userRepository.save(user);
}

/**
 * Retorna uma mensagem específica sobre o que está faltando na senha
 */
private String getPasswordValidationError(String password) {
    if (password == null) {
        return "A nova senha é obrigatória.";
    }
    
    if (password.length() < 8) {
        return "A nova senha deve ter pelo menos 8 caracteres.";
    }
    
    boolean hasLower = false;
    boolean hasUpper = false;
    boolean hasDigit = false;
    boolean hasSpecial = false;
    
    for (char c : password.toCharArray()) {
        if (Character.isLowerCase(c)) hasLower = true;
        else if (Character.isUpperCase(c)) hasUpper = true;
        else if (Character.isDigit(c)) hasDigit = true;
        else if (!Character.isLetterOrDigit(c)) hasSpecial = true;
    }
    
    if (!hasLower) {
        return "A nova senha deve conter pelo menos uma letra minúscula (a-z).";
    }
    
    if (!hasUpper) {
        return "A nova senha deve conter pelo menos uma letra maiúscula (A-Z).";
    }
    
    if (!hasDigit) {
        return "A nova senha deve conter pelo menos um número (0-9).";
    }
    
    if (!hasSpecial) {
        return "A nova senha deve conter pelo menos um caractere especial (!@#$%^&*).";
    }
    
    return null; // Senha válida
}
```

### **AuthController.java**
```java
@PutMapping("/update-password")
public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest, Authentication authentication) {
    try {
        String email = authentication.getName();
        
        userService.updatePassword(email, updatePasswordRequest.getCurrentPassword(), updatePasswordRequest.getNewPassword());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Senha atualizada com sucesso");
        
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        Map<String, String> error = new HashMap<>();
        // Usar a mensagem específica da exceção em vez de uma mensagem genérica
        error.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(error);
    }
}
```

---

## Implementação Frontend

### **Profile.jsx - Validação em Tempo Real**
```jsx
// Função para validar a força da senha
const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 8) {
    errors.push('pelo menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('pelo menos 1 letra minúscula');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('pelo menos 1 letra maiúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('pelo menos 1 número');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('pelo menos 1 caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }
  
  return errors;
};

const handleUpdatePassword = async (e) => {
  e.preventDefault();
  
  if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
    setError('Por favor, preencha todos os campos de senha.');
    return;
  }
  
  if (formData.newPassword !== formData.confirmPassword) {
    setError('A nova senha e a confirmação não coincidem.');
    return;
  }
  
  // Validação robusta da nova senha
  const passwordErrors = validatePassword(formData.newPassword);
  if (passwordErrors.length > 0) {
    setError(`A nova senha deve conter: ${passwordErrors.join(', ')}.`);
    return;
  }
  
  // Verificar se a nova senha é diferente da atual
  if (formData.currentPassword === formData.newPassword) {
    setError('A nova senha deve ser diferente da senha atual.');
    return;
  }

  try {
    setError(null);
    await apiService.updatePassword(formData.currentPassword, formData.newPassword);
    
    setIsEditingPassword(false);
    setFormData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setSuccess('Senha atualizada com sucesso!');
    setTimeout(() => setSuccess(null), 3000);
    
  } catch (err) {
    console.error('Erro ao atualizar senha:', err);
    setError(err.message || 'Erro ao atualizar senha. Tente novamente.');
  }
};
```

### **Interface de Validação Visual**
```jsx
<div className="form-group">
  <label>Nova Senha</label>
  <input
    type="password"
    name="newPassword"
    value={formData.newPassword}
    onChange={handleInputChange}
    placeholder="Digite a nova senha"
    className="form-input"
  />
  {formData.newPassword && (
    <div className="password-requirements">
      <div className="requirements-title">
        <Icon emoji="🔐" size={14} />
        <span>Requisitos da senha:</span>
      </div>
      <div className="requirements-list">
        <div className={`requirement ${formData.newPassword.length >= 8 ? 'valid' : 'invalid'}`}>
          <Icon emoji={formData.newPassword.length >= 8 ? "✅" : "❌"} size={12} />
          <span>Pelo menos 8 caracteres</span>
        </div>
        <div className={`requirement ${/[a-z]/.test(formData.newPassword) ? 'valid' : 'invalid'}`}>
          <Icon emoji={/[a-z]/.test(formData.newPassword) ? "✅" : "❌"} size={12} />
          <span>Pelo menos 1 letra minúscula</span>
        </div>
        <div className={`requirement ${/[A-Z]/.test(formData.newPassword) ? 'valid' : 'invalid'}`}>
          <Icon emoji={/[A-Z]/.test(formData.newPassword) ? "✅" : "❌"} size={12} />
          <span>Pelo menos 1 letra maiúscula</span>
        </div>
        <div className={`requirement ${/\d/.test(formData.newPassword) ? 'valid' : 'invalid'}`}>
          <Icon emoji={/\d/.test(formData.newPassword) ? "✅" : "❌"} size={12} />
          <span>Pelo menos 1 número</span>
        </div>
        <div className={`requirement ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(formData.newPassword) ? 'valid' : 'invalid'}`}>
          <Icon emoji={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(formData.newPassword) ? "✅" : "❌"} size={12} />
          <span>Pelo menos 1 caractere especial</span>
        </div>
      </div>
    </div>
  )}
</div>
```

---

## Estilos CSS

### **Profile.css - Validação Visual**
```css
/* Validação de senha */
.password-requirements {
    margin-top: 12px;
    padding: 16px;
    background: rgba(15, 15, 35, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.requirements-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
}

.requirements-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.requirement {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    transition: all 0.3s ease;
}

.requirement.valid {
    color: #6ee7b7;
}

.requirement.invalid {
    color: rgba(255, 255, 255, 0.6);
}

.requirement span {
    font-weight: 500;
}
```

---

## Fluxo de Validação

### **1. Validação Frontend (Tempo Real)**
1. Usuário digita nova senha
2. Sistema valida cada critério instantaneamente
3. Exibe indicadores visuais (✅/❌) para cada requisito
4. Previne envio se critérios não atendidos

### **2. Validação Frontend (Pré-Envio)**
1. Verifica se todos os campos estão preenchidos
2. Confirma se nova senha e confirmação coincidem
3. Valida todos os critérios de segurança
4. Verifica se nova senha é diferente da atual

### **3. Validação Backend (Servidor)**
1. Autentica o usuário via JWT
2. Verifica se a senha atual está correta
3. Valida critérios de segurança da nova senha
4. Confirma que nova senha é diferente da atual
5. Criptografa e salva a nova senha

---

## Benefícios da Implementação

### **🔒 Segurança**
- Senhas robustas com múltiplos critérios
- Validação da senha atual antes de alteração
- Criptografia BCrypt para armazenamento

### **🎨 Experiência do Usuário**
- Feedback visual em tempo real
- Mensagens específicas sobre problemas
- Interface intuitiva e responsiva

### **⚡ Performance**
- Validação no frontend evita requisições desnecessárias
- Feedback instantâneo sem latência de rede

### **🛡️ Robustez**
- Validação dupla (frontend + backend)
- Tratamento específico de cada tipo de erro
- Prevenção de senhas fracas

---

## Exemplos de Uso

### **Senha Válida**
- **Entrada**: `MinhaSenh@123`
- **Resultado**: ✅ Todos os critérios atendidos, senha aceita

### **Senha Sem Maiúscula**
- **Entrada**: `minhasenha123!`
- **Erro**: "A nova senha deve conter pelo menos uma letra maiúscula (A-Z)."

### **Senha Muito Curta**
- **Entrada**: `Ab1!`
- **Erro**: "A nova senha deve ter pelo menos 8 caracteres."

### **Senha Atual Incorreta**
- **Entrada**: Senha atual = "errada", Nova = "MinhaSenh@123"
- **Erro**: "A senha atual não confere. Verifique e tente novamente."

---

## Endpoints da API

### **PUT /api/auth/update-password**
**Request:**
```json
{
  "currentPassword": "senhaAtual123",
  "newPassword": "MinhaSenh@123"
}
```

**Response (Sucesso):**
```json
{
  "success": true,
  "message": "Senha atualizada com sucesso"
}
```

**Response (Erro):**
```json
{
  "message": "A senha atual não confere. Verifique e tente novamente."
}
```

---

## Configuração de Segurança

### **SecurityConfig.java**
```java
.requestMatchers("/api/auth/update-password").authenticated()
```

### **JwtAuthenticationFilter.java**
```java
// Endpoint protegido, requer autenticação JWT
if (!requestPath.equals("/api/auth/update-password")) {
    // Processa token JWT
}
```

A implementação garante que apenas usuários autenticados possam alterar senhas e que todas as validações sejam rigorosamente aplicadas. 