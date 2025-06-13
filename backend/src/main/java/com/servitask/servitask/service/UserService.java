package com.servitask.servitask.service;

import com.servitask.servitask.dto.AuthResponse;
import com.servitask.servitask.dto.LoginRequest;
import com.servitask.servitask.dto.RegisterRequest;
import com.servitask.servitask.entity.User;
import com.servitask.servitask.repository.UserRepository;
import com.servitask.servitask.util.HashUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;

    @Autowired
    @Lazy
    private AuthenticationManager authenticationManager;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com email: " + username));
    }

    public AuthResponse login(LoginRequest loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken, user);
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        if (!registerRequest.isPasswordMatching()) {
            throw new RuntimeException("As senhas não coincidem");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }

        User user = new User(
                registerRequest.getName(),
                registerRequest.getEmail(),
                HashUtil.hashPassword(registerRequest.getPassword())
        );

        User savedUser = userRepository.save(user);
        
        String jwtToken = jwtService.generateToken(savedUser);
        
        return new AuthResponse(jwtToken, savedUser);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com id: " + id));
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User getUserFromToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token JWT não fornecido ou formato inválido");
        }

        String token = authHeader.substring(7);

        String email = jwtService.extractUsername(token);

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
}
