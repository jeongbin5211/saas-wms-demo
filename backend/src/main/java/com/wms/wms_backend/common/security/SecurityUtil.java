package com.wms.wms_backend.common.security;

import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

public class SecurityUtil {

    private SecurityUtil() {}

    public static Claims currentClaims() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Claims claims) {
            return claims;
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
    }

    public static Long currentTopAccountId() {
        return currentClaims().get("topAccountId", Long.class);
    }

    public static Long currentAccountId() {
        return currentClaims().get("accountId", Long.class);
    }
}
