package com.servitask.servitask.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RegisterRequest {

    @NotBlank(message = "Nome é obrigatório")                                   
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")  
    private String name;

    @NotBlank(message = "Email é obrigatório")              
    @Email(message = "Email deve ter um formato válido")    
    private String email;

    @NotBlank(message = "Senha é obrigatória")                          
    @Size(min = 6, message = "Senha deve ter pelo menos 6 caracteres")  
    private String password;

    @NotBlank(message = "Confirmação de senha é obrigatória")   
    private String confirmPassword;

    public RegisterRequest() {}

    public RegisterRequest(String name, String email, String password, String confirmPassword) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

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

    public boolean isPasswordMatching() {
        return password != null && password.equals(confirmPassword);
    }
} 