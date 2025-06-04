package com.servitask.servitask.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "access")
public class Access {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long AccessId;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getters e setters
    public Long getAccessId() {
        return AccessId;
    }
    public void setAccessId(Long AccessId) {
        this.AccessId = AccessId;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
}