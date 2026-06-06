package com.wms.wms_backend.domain.account.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class AccountController {

    private final AccountRepository accountRepository;

    @GetMapping("/api/accounts")
    public List<AccountResponse> findAll() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return accountRepository.findByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y").stream()
                .map(AccountResponse::from)
                .toList();
    }

    public record AccountResponse(
            Long id,
            Long topAccountId,
            String accountCode,
            String accountName,
            String accountTypeSubCode,
            String useYn
    ) {
        public static AccountResponse from(Account account) {
            return new AccountResponse(
                    account.getId(),
                    account.getTopAccountId(),
                    account.getAccountCode(),
                    account.getAccountName(),
                    account.getAccountTypeSubCode(),
                    account.getUseYn()
            );
        }
    }
}
