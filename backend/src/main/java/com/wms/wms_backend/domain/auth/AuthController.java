package com.wms.wms_backend.domain.auth;

import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.user.entity.User;
import com.wms.wms_backend.domain.user.repository.UserRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountRepository accountRepository;
    private final AuthSessionStore authSessionStore;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 가입된 이메일입니다.");
        }

        if (accountRepository.findByAccountCode(request.accountCode()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 회사 코드입니다.");
        }

        Account account = accountRepository.save(new Account(null, request.accountCode(), request.accountName(), "CUSTOMER"));
        account.assignTopAccountId(account.getId());

        User user = userRepository.save(new User(
                account,
                account.getTopAccountId(),
                request.name(),
                request.email(),
                passwordEncoder.encode(request.password()),
                "ADMIN"
        ));

        String token = authSessionStore.create(user);

        return AuthResponse.from(token, user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!Boolean.TRUE.equals(user.getIsActive()) || user.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용할 수 없는 계정입니다.");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String token = authSessionStore.create(user);

        return AuthResponse.from(token, user);
    }

    @GetMapping("/me")
    public AuthSessionStore.AuthSession me(@RequestHeader(name = "Authorization", required = false) String authorization) {
        String token = parseToken(authorization);

        return authSessionStore.find(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(name = "Authorization", required = false) String authorization) {
        String token = parseToken(authorization);
        authSessionStore.remove(token);
    }

    private String parseToken(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }

        return authorization.substring("Bearer ".length());
    }

    public record RegisterRequest(
            @NotBlank String accountName,
            @NotBlank String accountCode,
            @NotBlank String name,
            @Email @NotBlank String email,
            @Size(min = 8, max = 50) String password
    ) {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record AuthResponse(
            String token,
            Long userId,
            Long accountId,
            Long topAccountId,
            String name,
            String email,
            String roleSubCode
    ) {
        public static AuthResponse from(String token, User user) {
            return new AuthResponse(
                    token,
                    user.getId(),
                    user.getAccount().getId(),
                    user.getTopAccountId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRoleSubCode()
            );
        }
    }
}
