package com.servitask.servitask.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class HashUtil {

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * @param rawPassword
     * @return
     */
    public static String hashPassword(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * @param rawPassword
     * @param hashedPassword
     * @return
     */
    public static boolean verifyPassword(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }

    /**
     * @param rawPassword
     * @param strength
     * @return
     */
    public static String hashPasswordWithStrength(String rawPassword, int strength) {
        PasswordEncoder customEncoder = new BCryptPasswordEncoder(strength);
        return customEncoder.encode(rawPassword);
    }

    /**
     * @param possibleHash
     * @return
     */
    public static boolean isBCryptHash(String possibleHash) {
        if (possibleHash == null || possibleHash.length() < 60) {
            return false;
        }
        return possibleHash.startsWith("$2a$") ||
                possibleHash.startsWith("$2b$") ||
                possibleHash.startsWith("$2x$") ||
                possibleHash.startsWith("$2y$");
    }

    /**
     * @param bcryptHash
     * @return
     */
    public static int extractRounds(String bcryptHash) {
        if (!isBCryptHash(bcryptHash)) {
            return -1;
        }

        try {
            // BCrypt format: $2a$rounds$salthash
            String[] parts = bcryptHash.split("\\$");
            if (parts.length >= 3) {
                return Integer.parseInt(parts[2]);
            }
        } catch (NumberFormatException e) {
            return -1;
        }

        return -1;
    }
}
