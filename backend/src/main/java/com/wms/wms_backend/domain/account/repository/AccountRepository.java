package com.wms.wms_backend.domain.account.repository;

import com.wms.wms_backend.domain.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByAccountCode(String accountCode);

    Optional<Account> findByAccountCode(String accountCode);

    List<Account> findByTopAccountIdAndUseYnOrderByIdAsc(Long topAccountId, String useYn);
}
