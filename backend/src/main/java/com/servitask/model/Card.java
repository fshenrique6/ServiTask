package com.servitask.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Data
@EqualsAndHashCode(exclude = { "column" })
@ToString(exclude = { "column" })

public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.BAIXA;

    @Column(nullable = false)
    private Integer position;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "column_id", nullable = false)
    @JsonBackReference
    private BoardColumn column;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum Priority {
        BAIXA("baixa"),
        MEDIA("media"),
        ALTA("alta");

        private final String value;

        Priority(String value) {
            this.value = value;
        }

        public static Priority fromString(String text) {
            for (Priority priority : Priority.values()) {
                if (priority.value.equalsIgnoreCase(text)) {
                    return priority;
                }
            }
            return BAIXA;
        }
    }
}