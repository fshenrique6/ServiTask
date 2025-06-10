package com.servitask.servitask.dto;


public class UserDTO {
    
    private Long id;
    
    private String username;
    
    private String email;

    public UserDTO() {
    }

    /**
     * @param id ID único do usuário
     * @param username Nome de usuário
     * @param email Email do usuário
     */
    public UserDTO(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
