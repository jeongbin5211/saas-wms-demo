package com.wms.wms_backend.domain.account.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.entity.AccountAddress;
import com.wms.wms_backend.domain.account.repository.AccountAddressRepository;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class AccountController {

    private final AccountRepository accountRepository;
    private final AccountAddressRepository accountAddressRepository;

    @GetMapping("/api/accounts")
    public List<AccountResponse> findAll() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return accountRepository.findByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y").stream()
                .map(AccountResponse::from)
                .toList();
    }

    @GetMapping("/api/account-addresses")
    public List<AccountAddressResponse> findAccountAddresses() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return accountAddressRepository.findByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y").stream()
                .map(AccountAddressResponse::from)
                .toList();
    }

    public record AccountResponse(
            Long id,
            Long topAccountId,
            String accountCode,
            String accountName,
            String accountTypeSubCode,
            String useYn,
            String createdAt,
            String updatedAt
    ) {
        public static AccountResponse from(Account account) {
            return new AccountResponse(
                    account.getId(),
                    account.getTopAccountId(),
                    account.getAccountCode(),
                    account.getAccountName(),
                    account.getAccountTypeSubCode(),
                    account.getUseYn(),
                    String.valueOf(account.getCreatedAt()),
                    String.valueOf(account.getUpdatedAt())
            );
        }
    }

    public record AccountAddressResponse(
            Long id,
            Long accountId,
            String accountCode,
            String accountName,
            Long topAccountId,
            String addressCode,
            String addressName,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String zipcode,
            String country,
            String fullAddress,
            String phoneNo,
            String faxNo,
            String contactName,
            String useYn,
            String createdAt,
            String updatedAt
    ) {
        public static AccountAddressResponse from(AccountAddress address) {
            Account account = address.getAccount();
            return new AccountAddressResponse(
                    address.getId(),
                    account.getId(),
                    account.getAccountCode(),
                    account.getAccountName(),
                    address.getTopAccountId(),
                    address.getAddressCode(),
                    address.getAddressName(),
                    address.getAddressLine1(),
                    address.getAddressLine2(),
                    address.getCity(),
                    address.getState(),
                    address.getZipcode(),
                    address.getCountry(),
                    address.fullAddress(),
                    address.getPhoneNo(),
                    address.getFaxNo(),
                    address.getContactName(),
                    address.getUseYn(),
                    String.valueOf(address.getCreatedAt()),
                    String.valueOf(address.getUpdatedAt())
            );
        }
    }
}
