package com.wms.wms_backend.domain.warehouse.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
import com.wms.wms_backend.domain.account.entity.Account;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "warehouses")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Warehouse extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private Long topAccountId;

    @Column(nullable = false, unique = true, length = 50)
    private String warehouseCode;

    @Column(nullable = false, length = 100)
    private String warehouseName;

    @Column(nullable = false, length = 50)
    private String warehouseTypeSubCode;

    @Column(length = 200)
    private String addressName;

    private Integer priority;

    @Column(length = 30)
    private String phoneNo;

    @Column(length = 30)
    private String faxNo;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Warehouse(Account account, Long topAccountId, String warehouseCode, String warehouseName, String warehouseTypeSubCode) {
        this.account = account;
        this.topAccountId = topAccountId;
        this.warehouseCode = warehouseCode;
        this.warehouseName = warehouseName;
        this.warehouseTypeSubCode = warehouseTypeSubCode;
        this.priority = 0;
        this.useYn = "Y";
    }

    public void update(String warehouseCode, String warehouseName, String warehouseTypeSubCode, String addressName, Integer priority, String phoneNo, String faxNo, String useYn) {
        this.warehouseCode = warehouseCode;
        this.warehouseName = warehouseName;
        this.warehouseTypeSubCode = warehouseTypeSubCode;
        this.addressName = addressName;
        this.priority = priority;
        this.phoneNo = phoneNo;
        this.faxNo = faxNo;
        this.useYn = normalizeUseYn(useYn);
    }

    public void updateOptionalFields(String addressName, Integer priority, String phoneNo, String faxNo, String useYn) {
        this.addressName = addressName;
        this.priority = priority;
        this.phoneNo = phoneNo;
        this.faxNo = faxNo;
        this.useYn = normalizeUseYn(useYn);
    }

    public void deactivate() {
        this.useYn = "N";
    }

    private String normalizeUseYn(String useYn) {
        return "N".equals(useYn) ? "N" : "Y";
    }
}
