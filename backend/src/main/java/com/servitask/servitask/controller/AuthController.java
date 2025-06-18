package com.servitask.servitask.controller;

import com.servitask.servitask.dto.AuthResponse;
import com.servitask.servitask.dto.LoginRequest;
import com.servitask.servitask.dto.RegisterRequest;
import com.servitask.servitask.dto.UpdatePasswordRequest;
import com.servitask.servitask.dto.UpdateProfileRequest;
import com.servitask.servitask.entity.User;
import com.servitask.servitask.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")  

@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {

            AuthResponse authResponse = userService.login(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Credenciais inválidas");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {

            AuthResponse authResponse = userService.register(registerRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            
            String email = authentication.getName();

            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("name", user.getName());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole().name());
            userInfo.put("createdAt", user.getCreatedAt());
            
            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Erro ao obter informações do usuário");
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        
        String email = request.get("email");

        boolean exists = userService.existsByEmail(email);

        Map<String, Boolean> response = new HashMap<>();
        response.put("exists", exists);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Endpoint de autenticação funcionando!");
    }

    @RequestMapping(value = "/register", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> registerOptions() {
        return ResponseEntity.ok().build();
    }

    @RequestMapping(value = "/login", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> loginOptions() {
        return ResponseEntity.ok().build();
    }
    
    @RequestMapping(value = "/update-profile", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> updateProfileOptions() {
        return ResponseEntity.ok().build();
    }
    
    @RequestMapping(value = "/update-password", method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> updatePasswordOptions() {
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest updateProfileRequest, Authentication authentication) {
        try {
            String email = authentication.getName();
            
            User updatedUser = userService.updateProfile(email, updateProfileRequest.getName());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Perfil atualizado com sucesso");
            response.put("name", updatedUser.getName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            // Usar a mensagem específica da exceção em vez de uma mensagem genérica
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    @PutMapping("/update-password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest updatePasswordRequest, Authentication authentication) {
        try {
            String email = authentication.getName();
            
            userService.updatePassword(email, updatePasswordRequest.getCurrentPassword(), updatePasswordRequest.getNewPassword());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Senha atualizada com sucesso");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            // Usar a mensagem específica da exceção em vez de uma mensagem genérica
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<Void> handleOptions() {
        return ResponseEntity.ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
                .header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
                .build();
    }
} 