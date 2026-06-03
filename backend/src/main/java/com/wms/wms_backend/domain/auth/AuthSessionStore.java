package com.wms.wms_backend.domain.auth;

import com.wms.wms_backend.domain.user.entity.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class AuthSessionStore {

    private static final long TOKEN_VALID_HOURS = 8;

    private final Map<String, AuthSession> sessions = new ConcurrentHashMap<>();

    public String create(User user) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, new AuthSession(
                user.getId(),
                user.getAccount().getId(),
                user.getTopAccountId(),
                user.getName(),
                user.getEmail(),
                user.getRoleSubCode(),
                LocalDateTime.now().plusHours(TOKEN_VALID_HOURS)
        ));
        return token;
    }

    public Optional<AuthSession> find(String token) {
        AuthSession session = sessions.get(token);

        if (session == null) {
            return Optional.empty();
        }

        if (session.expiresAt().isBefore(LocalDateTime.now())) {
            sessions.remove(token);
            return Optional.empty();
        }

        return Optional.of(session);
    }

    public void remove(String token) {
        sessions.remove(token);
    }

    public record AuthSession(
            Long userId,
            Long accountId,
            Long topAccountId,
            String name,
            String email,
            String roleSubCode,
            LocalDateTime expiresAt
    ) {
    }
}
