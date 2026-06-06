package com.wms.wms_backend.domain.auth;

import com.wms.wms_backend.common.config.JwtTokenProvider;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.user.entity.User;
import com.wms.wms_backend.domain.user.repository.UserRepository;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AccountRepository accountRepository;
    private final JwtTokenProvider jwtTokenProvider;
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

        String token = jwtTokenProvider.generate(user);
        log.info("회원가입 완료 | userId={} email={}", user.getId(), user.getEmail());
        return AuthResponse.from(token, user);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authenticate(request.email(), request.password());
    }

    @PostMapping("/demo-login")
    public AuthResponse demoLogin() {
        return authenticate("guest@saas-wms-demo.com", "guest1234");
    }

    @GetMapping("/me")
    public MeResponse me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Claims claims)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.");
        }
        return MeResponse.from(claims);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        // JWT는 stateless — 클라이언트에서 토큰 삭제로 처리
    }

    public record RegisterRequest(
            @NotBlank String accountName,
            @NotBlank String accountCode,
            @NotBlank String name,
            @Email @NotBlank String email,
            @Size(min = 8, max = 50) String password
    ) {}

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

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

    public record MeResponse(
            Long userId,
            Long accountId,
            Long topAccountId,
            String name,
            String email,
            String roleSubCode
    ) {
        public static MeResponse from(Claims claims) {
            return new MeResponse(
                    Long.parseLong(claims.getSubject()),
                    claims.get("accountId", Long.class),
                    claims.get("topAccountId", Long.class),
                    claims.get("name", String.class),
                    claims.get("email", String.class),
                    claims.get("role", String.class)
            );
        }
    }

    private AuthResponse authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!Boolean.TRUE.equals(user.getIsActive()) || user.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "사용할 수 없는 계정입니다.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String token = jwtTokenProvider.generate(user);
        log.info("로그인 성공 | userId={} email={} role={}", user.getId(), user.getEmail(), user.getRoleSubCode());
        return AuthResponse.from(token, user);
    }
}
