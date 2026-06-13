package com.wms.wms_backend.domain.account.repository;

import com.wms.wms_backend.domain.account.entity.AccountAddress;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountAddressRepository extends JpaRepository<AccountAddress, Long> {

    Optional<AccountAddress> findByAddressCode(String addressCode);

    @EntityGraph(attributePaths = "account")
    List<AccountAddress> findByTopAccountIdAndUseYnOrderByIdAsc(Long topAccountId, String useYn);
}
