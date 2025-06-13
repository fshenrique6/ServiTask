package com.servitask.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.servitask.servitask.entity.User;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity                                     
@Table(name = "boards")                     
@Data                                       
@EqualsAndHashCode(exclude = {"columns"})   
@ToString(exclude = {"columns"})            
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  
    private Long id;  
    
    @Column(nullable = false)  
    private String name;  

    @ManyToOne(fetch = FetchType.LAZY)  
    @JoinColumn(name = "user_id", nullable = false)  
    private User user;  

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position ASC")  
    @JsonManagedReference     
    private List<BoardColumn> columns = new ArrayList<>();  

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

    public void addColumn(BoardColumn column) {
        columns.add(column);        
        column.setBoard(this);      
    }

    public void removeColumn(BoardColumn column) {
        columns.remove(column);     
        column.setBoard(null);      
    }
} 