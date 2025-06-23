package com.servitask.servitask.controller;

import com.servitask.servitask.entity.User;
import com.servitask.servitask.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
            profile.put("photo", user.getPhoto());      
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao obter perfil do usuário");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<?> uploadPhoto(@RequestParam("photo") MultipartFile file, Authentication authentication) {
        try {
            String email = authentication.getName();
            
            // Validar arquivo
            if (file.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Arquivo não pode estar vazio");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar tipo de arquivo
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Apenas arquivos de imagem são permitidos");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar tamanho (máximo 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Arquivo deve ter no máximo 5MB");
                return ResponseEntity.badRequest().body(error);
            }
            
            String photoUrl = userService.uploadPhoto(email, file);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Foto atualizada com sucesso");
            response.put("photoUrl", photoUrl);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao fazer upload da foto");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/remove-photo")
    public ResponseEntity<?> removePhoto(Authentication authentication) {
        try {
            String email = authentication.getName();
            
            userService.removePhoto(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Foto removida com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao remover foto");
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
