package com.servitask.servitask.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "acesso")
public class Acesso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAcesso;

    @OneToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    // getters e setters
    public Long getIdAcesso() {
        return idAcesso;
    }
    public void setIdAcesso(Long idAcesso) {
        this.idAcesso = idAcesso;
    }
    public Usuario getUsuario() {
        return usuario;
    }
    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}