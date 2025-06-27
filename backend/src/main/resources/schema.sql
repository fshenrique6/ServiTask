-- Schema de inicialização do ServiTask
-- Este script garante que a tabela users seja criada corretamente
-- As demais tabelas são gerenciadas pelo Hibernate

-- Criar tabela users se não existir
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    photo LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
); 