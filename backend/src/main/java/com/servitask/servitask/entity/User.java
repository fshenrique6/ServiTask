package com.servitask.servitask.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUser;
    private String name;
    @Column(unique = true, nullable = false)
    private String email;


    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Access access;


    public User() {
    }
    public User(String nome, String email, Access acesso) {
        this.name = nome;
        this.email = email;
        this.access = acesso;
    }
    public Long getidUser() {
        return idUser;
    }
    public void setidUser(Long idUser) {
        this.idUser = idUser;
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
    public Access getAccess() {
        return access;
    }
    public void setAcesso(Access access) {
        this.access = access;
    }

}