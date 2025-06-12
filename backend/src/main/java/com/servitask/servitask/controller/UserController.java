package com.servitask.servitask.controller;

import com.servitask.servitask.entity.User;
import com.servitask.servitask.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")  
@CrossOrigin(origins = "*")    
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            
            String email = authentication.getName();

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            Map<String, Object> profile = new HashMap<>();
            profile.put("id", user.getId());                    
            profile.put("name", user.getName());                
            profile.put("email", user.getEmail());              
            profile.put("role", user.getRole().name());         
            profile.put("createdAt", user.getCreatedAt());      
            profile.put("updatedAt", user.getUpdatedAt());      
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao obter perfil do usuário");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates, Authentication authentication) {
        try {
            
            String email = authentication.getName();

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            if (updates.containsKey("name")) {
                user.setName(updates.get("name"));  
            }

            Map<String, String> response = new HashMap<>();
            response.put("message", "Perfil atualizado com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao atualizar perfil");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/test-protected")
    public ResponseEntity<String> testProtected(Authentication authentication) {
        return ResponseEntity.ok("Endpoint protegido funcionando! Usuário: " + authentication.getName());
    }
}
