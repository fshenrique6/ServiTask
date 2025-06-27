package com.servitask.servitask.controller;

import com.servitask.servitask.entity.User;
import com.servitask.servitask.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${spring.servlet.multipart.max-file-size:1MB}")
    private String maxFileSize;

    @Value("${spring.servlet.multipart.max-request-size:10MB}")
    private String maxRequestSize;

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
    public ResponseEntity<?> uploadPhoto(@RequestBody Map<String, Object> photoData, Authentication authentication) {
        System.out.println("=== INÍCIO UPLOAD FOTO (JSON) ===");
        
        try {
            // Verificar autenticação
            if (authentication == null) {
                System.out.println("ERRO: Authentication é null");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Usuário não autenticado");
                return ResponseEntity.status(401).body(error);
            }
            
            String email = authentication.getName();
            System.out.println("Email do usuário autenticado: " + email);
            
            // Verificar se photoData não é null
            if (photoData == null) {
                System.out.println("ERRO: photoData é null");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Dados da foto não recebidos");
                return ResponseEntity.badRequest().body(error);
            }
            
            System.out.println("Dados recebidos: " + photoData.keySet());
            
            // Extrair dados do JSON
            String base64Photo = (String) photoData.get("photo");
            String filename = (String) photoData.get("filename");
            String contentType = (String) photoData.get("contentType");
            Integer size = (Integer) photoData.get("size");
            
            System.out.println("Nome do arquivo: " + filename);
            System.out.println("Tamanho original: " + size + " bytes");
            System.out.println("Tipo de conteúdo: " + contentType);
            System.out.println("Base64 não é null: " + (base64Photo != null));
            System.out.println("Tamanho Base64: " + (base64Photo != null ? base64Photo.length() : 0) + " caracteres");
            
            // Validar dados
            if (base64Photo == null || base64Photo.trim().isEmpty()) {
                System.out.println("ERRO: Base64 está vazio");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Dados da imagem não podem estar vazios");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar tipo de arquivo
            if (contentType == null || !contentType.startsWith("image/")) {
                System.out.println("ERRO: Tipo de arquivo inválido - " + contentType);
                Map<String, String> error = new HashMap<>();
                error.put("message", "Apenas arquivos de imagem são permitidos");
                return ResponseEntity.badRequest().body(error);
            }
            
            // Validar tamanho original (máximo 5MB)
            if (size != null && size > 5 * 1024 * 1024) {
                System.out.println("ERRO: Arquivo muito grande - " + size + " bytes");
                Map<String, String> error = new HashMap<>();
                error.put("message", "Arquivo deve ter no máximo 5MB");
                return ResponseEntity.badRequest().body(error);
            }
            
            System.out.println("Todas as validações passaram, chamando service...");
            String photoUrl = userService.uploadPhotoFromBase64(email, base64Photo, contentType, filename);
            System.out.println("Service retornou: " + (photoUrl != null ? "OK" : "NULL"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Foto atualizada com sucesso");
            response.put("photoUrl", photoUrl);
            
            System.out.println("=== UPLOAD CONCLUÍDO COM SUCESSO ===");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("=== ERRO DURANTE UPLOAD ===");
            System.out.println("Tipo do erro: " + e.getClass().getSimpleName());
            System.out.println("Mensagem: " + e.getMessage());
            System.out.println("Stack trace:");
            e.printStackTrace();
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro interno do servidor ao fazer upload da foto");
            error.put("error", e.getMessage());
            error.put("type", e.getClass().getSimpleName());
            return ResponseEntity.status(500).body(error);
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

    @DeleteMapping("/delete-account")
    public ResponseEntity<?> deleteAccount(@RequestBody Map<String, String> request, Authentication authentication) {
        try {
            String email = authentication.getName();
            String confirmationMessage = request.get("confirmationMessage");
            
            if (confirmationMessage == null || confirmationMessage.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Mensagem de confirmação é obrigatória");
                return ResponseEntity.badRequest().body(error);
            }
            
            userService.deleteAccount(email, confirmationMessage.trim());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Conta excluída com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao excluir conta");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/generate-delete-confirmation")
    public ResponseEntity<?> generateDeleteConfirmation(Authentication authentication) {
        try {
            String email = authentication.getName();
            String confirmationMessage = userService.generateDeleteConfirmationMessage(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("confirmationMessage", confirmationMessage);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao gerar mensagem de confirmação");
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
