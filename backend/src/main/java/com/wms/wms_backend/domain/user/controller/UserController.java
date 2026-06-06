package com.wms.wms_backend.domain.user.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.user.entity.User;
import com.wms.wms_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/api/users")
    public List<UserResponse> findAll() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return userRepository.findAllByTopAccountIdOrderByIdAsc(topAccountId).stream()
                .map(UserResponse::from)
                .toList();
    }

    public record UserResponse(
            Long id,
            Long accountId,
            String accountName,
            Long topAccountId,
            String name,
            String email,
            String roleSubCode,
            Boolean isActive
    ) {
        public static UserResponse from(User user) {
            return new UserResponse(
                    user.getId(),
                    user.getAccount().getId(),
                    user.getAccount().getAccountName(),
                    user.getTopAccountId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRoleSubCode(),
                    user.getIsActive()
            );
        }
    }
}
