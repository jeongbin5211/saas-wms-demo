package com.wms.wms_backend.domain.account.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "accounts")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Account extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long topAccountId;

    @Column(nullable = false, unique = true, length = 50)
    private String accountCode;

    @Column(nullable = false, length = 100)
    private String accountName;

    @Column(nullable = false, length = 50)
    private String accountTypeSubCode;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Account(Long topAccountId, String accountCode, String accountName, String accountTypeSubCode) {
        this.topAccountId = topAccountId;
        this.accountCode = accountCode;
        this.accountName = accountName;
        this.accountTypeSubCode = accountTypeSubCode;
        this.useYn = "Y";
    }

    public void assignTopAccountId(Long topAccountId) {
        this.topAccountId = topAccountId;
    }
}
