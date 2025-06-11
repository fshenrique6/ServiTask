package com.servitask.servitask.service;

import com.servitask.servitask.dto.AuthResponseDTO;
import com.servitask.servitask.dto.LoginRequestDTO;
import com.servitask.servitask.dto.RegisterRequestDTO;
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

    public AuthResponseDTO login(LoginRequestDTO loginRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getEmail(),
                        loginRequestDTO.getPassword()));

        User user = userRepository.findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponseDTO(jwtToken, user.getUsername(), user.getRole().name());
    }

    public AuthResponseDTO register(RegisterRequestDTO registerRequestDTO) {
        if (!registerRequestDTO.isPasswordMatching()) {
            throw new RuntimeException("As senhas não coincidem");
        }

        if (userRepository.existsByEmail(registerRequestDTO.getEmail())) {
            throw new RuntimeException("Email já está em uso");
        }

        User user = new User(
                registerRequestDTO.getName(),
                registerRequestDTO.getEmail(),
                HashUtil.hashPassword(registerRequestDTO.getPassword()));

        User savedUser = userRepository.save(user);

        String jwtToken = jwtService.generateToken(savedUser);

        return new AuthResponseDTO(jwtToken, savedUser.getUsername(), savedUser.getRole().name());
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
