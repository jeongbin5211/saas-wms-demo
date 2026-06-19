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

    @Column(length = 200)
    private String detailDescription;

    @Column(length = 100)
    private String billAccountName;

    @Column(length = 50)
    private String businessRegNo;

    @Column(length = 50)
    private String ceoName;

    @Column(length = 100)
    private String businessType;

    @Column(length = 100)
    private String businessItem;

    @Column(length = 50)
    private String country;

    @Column(length = 100)
    private String email;

    @Column(length = 30)
    private String phoneNo;

    @Column(length = 30)
    private String faxNo;

    @Column(length = 50)
    private String managerName;

    @Column(length = 500)
    private String note;

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

    public void update(
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
    ) {
        this.accountName = accountName;
        this.accountTypeSubCode = accountTypeSubCode;
        this.useYn = normalizeUseYn(useYn);
        this.detailDescription = detailDescription;
        this.billAccountName = billAccountName;
        this.businessRegNo = businessRegNo;
        this.ceoName = ceoName;
        this.businessType = businessType;
        this.businessItem = businessItem;
        this.country = country;
        this.email = email;
        this.phoneNo = phoneNo;
        this.faxNo = faxNo;
        this.managerName = managerName;
        this.note = note;
    }

    public void deactivate() {
        this.useYn = "N";
    }

    private String normalizeUseYn(String useYn) {
        return "N".equals(useYn) ? "N" : "Y";
    }
}
