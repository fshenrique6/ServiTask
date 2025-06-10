package com.servitask.servitask.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO (Data Transfer Object) para requisições de registro de novos usuários
 * 
 * Representa os dados que o frontend envia para criar uma nova conta.
 * Contém validações automáticas executadas antes do método do controller.
 * Inclui validação customizada para confirmar se as senhas coincidem.
 */
public class RegisterRequest {
    
    // Nome completo do usuário
    @NotBlank(message = "Nome é obrigatório")                                   // Não pode ser vazio
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")  // Tamanho válido
    private String name;
    
    // Email do usuário - será usado como username único no sistema
    @NotBlank(message = "Email é obrigatório")              // Não pode ser vazio
    @Email(message = "Email deve ter um formato válido")    // Formato de email válido
    private String email;
    
    // Senha em texto plano (será criptografada com BCrypt antes de salvar)
    @NotBlank(message = "Senha é obrigatória")                          // Não pode ser vazia
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")  // Mínimo de segurança
    private String password;
    
    // Confirmação da senha para evitar erros de digitação
    @NotBlank(message = "Confirmação de senha é obrigatória")   // Não pode ser vazia
    private String confirmPassword;

    // === CONSTRUTORES ===
    
    /**
     * Construtor padrão (obrigatório para deserialização JSON)
     */
    public RegisterRequest() {}

    /**
     * Construtor completo para facilitar criação em testes
     * @param name Nome completo do usuário
     * @param email Email do usuário
     * @param password Senha do usuário
     * @param confirmPassword Confirmação da senha
     */
    public RegisterRequest(String name, String email, String password, String confirmPassword) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    // === GETTERS E SETTERS ===
    // Necessários para serialização/deserialização JSON
    
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    // === MÉTODOS DE VALIDAÇÃO ===
    
    /**
     * Verifica se a senha e confirmação de senha são iguais
     * Usado pelo UserService antes de criar o usuário
     * 
     * @return true se as senhas coincidem, false caso contrário
     */
    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }
} 