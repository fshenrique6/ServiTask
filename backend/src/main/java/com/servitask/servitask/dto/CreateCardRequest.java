package com.servitask.servitask.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class CreateCardRequest {
    
    @NotBlank(message = "Título é obrigatório")
    @Size(min = 1, max = 255, message = "Título deve ter entre 1 e 255 caracteres")
    private String title;
    
    @Size(max = 100, message = "Descrição deve ter no máximo 100 caracteres")
    private String description;
    
    @NotBlank(message = "Prioridade é obrigatória")
    @Pattern(regexp = "^(baixa|media|alta)$", message = "Prioridade deve ser: baixa, media ou alta")
    private String priority;

    public CreateCardRequest() {}

    public CreateCardRequest(String title, String description, String priority) {
        this.title = title;
        this.description = description;
        this.priority = priority;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
} 