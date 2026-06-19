package com.wms.wms_backend.domain.account.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.entity.AccountAddress;
import com.wms.wms_backend.domain.account.repository.AccountAddressRepository;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class AccountController {

    private final AccountRepository accountRepository;
    private final AccountAddressRepository accountAddressRepository;

    @GetMapping("/api/accounts")
    public List<AccountResponse> findAll(
            @RequestParam(required = false) String accountCode,
            @RequestParam(required = false) String accountName,
            @RequestParam(required = false) String accountTypeSubCode,
            @RequestParam(required = false) String useYn
    ) {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        String effectiveUseYn = hasText(useYn) ? useYn : "Y";
        List<AccountResponse> responses = new ArrayList<>();

        for (Account account : accountRepository.findByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, effectiveUseYn)) {
            if (!contains(account.getAccountCode(), accountCode)) {
                continue;
            }
            if (!contains(account.getAccountName(), accountName)) {
                continue;
            }
            if (hasText(accountTypeSubCode) && !accountTypeSubCode.equals(account.getAccountTypeSubCode())) {
                continue;
            }
            responses.add(AccountResponse.from(account));
        }

        return responses;
    }

    @PostMapping("/api/accounts")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public AccountResponse createAccount(@RequestBody AccountSaveRequest request) {
        requireEditableRole();

        if (accountRepository.existsByAccountCode(request.accountCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 거래처 코드입니다.");
        }

        Account account = accountRepository.save(new Account(
                SecurityUtil.currentTopAccountId(),
                request.accountCode(),
                request.accountName(),
                request.accountTypeSubCode()
        ));
        applyRequest(account, request);

        return AccountResponse.from(account);
    }

    @PutMapping("/api/accounts/{id}")
    @Transactional
    public AccountResponse updateAccount(@PathVariable Long id, @RequestBody AccountSaveRequest request) {
        requireEditableRole();

        Account account = findAccount(id);
        if (accountRepository.existsByAccountCodeAndIdNot(request.accountCode(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 거래처 코드입니다.");
        }
        applyRequest(account, request);

        return AccountResponse.from(account);
    }

    @DeleteMapping("/api/accounts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteAccount(@PathVariable Long id) {
        requireEditableRole();

        findAccount(id).deactivate();
    }

    private void applyRequest(Account account, AccountSaveRequest request) {
        account.update(
                request.accountName(),
                request.accountTypeSubCode(),
                request.useYn(),
                request.detailDescription(),
                request.billAccountName(),
                request.businessRegNo(),
                request.ceoName(),
                request.businessType(),
                request.businessItem(),
                request.country(),
                request.email(),
                request.phoneNo(),
                request.faxNo(),
                request.managerName(),
                request.note()
        );
    }

    private Account findAccount(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "거래처를 찾을 수 없습니다."));
    }

    private void requireEditableRole() {
        String role = SecurityUtil.currentClaims().get("role", String.class);

        if (!"ADMIN".equals(role) && !"STAFF".equals(role) && !"GUEST".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "기준정보를 변경할 권한이 없습니다.");
        }
    }

    private boolean contains(String source, String keyword) {
        if (!hasText(keyword)) {
            return true;
        }
        return source != null && source.toLowerCase().contains(keyword.toLowerCase());
    }

    @GetMapping("/api/account-addresses")
    public List<AccountAddressResponse> findAccountAddresses() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return accountAddressRepository.findByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y").stream()
                .map(AccountAddressResponse::from)
                .toList();
    }

    @PostMapping("/api/account-addresses")
    @ResponseStatus(HttpStatus.CREATED)
    public AccountAddressResponse createAccountAddress(@RequestBody AccountAddressCreateRequest request) {
        String addressCode = hasText(request.addressCode()) ? request.addressCode().trim() : generateAddressCode();
        if (accountAddressRepository.findByAddressCode(addressCode).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 사용 중인 주소 코드입니다.");
        }
        Account account = accountRepository.findById(request.accountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "거래처를 찾을 수 없습니다."));
        AccountAddress address = new AccountAddress(
                account,
                addressCode,
                request.addressName(),
                request.addressLine1(),
                request.addressLine2(),
                request.city(),
                request.state(),
                request.zipcode(),
                request.country(),
                request.phoneNo(),
                request.faxNo(),
                request.contactName()
        );
        return AccountAddressResponse.from(accountAddressRepository.save(address));
    }

    private String generateAddressCode() {
        long next = accountAddressRepository.count() + 1;
        String addressCode;
        do {
            addressCode = "A" + String.format("%09d", next++);
        } while (accountAddressRepository.findByAddressCode(addressCode).isPresent());
        return addressCode;
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public record AccountAddressCreateRequest(
            Long accountId,
            String addressCode,
            String addressName,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String zipcode,
            String country,
            String phoneNo,
            String faxNo,
            String contactName
    ) {}

    public record AccountSaveRequest(
            String accountCode,
            String accountName,
            String accountTypeSubCode,
            String useYn,
            String detailDescription,
            String billAccountName,
            String businessRegNo,
            String ceoName,
            String businessType,
            String businessItem,
            String country,
            String email,
            String phoneNo,
            String faxNo,
            String managerName,
            String note
    ) {}

    public record AccountResponse(
            Long id,
            Long topAccountId,
            String accountCode,
            String accountName,
            String accountTypeSubCode,
            String useYn,
            String detailDescription,
            String billAccountName,
            String businessRegNo,
            String ceoName,
            String businessType,
            String businessItem,
            String country,
            String email,
            String phoneNo,
            String faxNo,
            String managerName,
            String note,
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
                    account.getDetailDescription(),
                    account.getBillAccountName(),
                    account.getBusinessRegNo(),
                    account.getCeoName(),
                    account.getBusinessType(),
                    account.getBusinessItem(),
                    account.getCountry(),
                    account.getEmail(),
                    account.getPhoneNo(),
                    account.getFaxNo(),
                    account.getManagerName(),
                    account.getNote(),
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
