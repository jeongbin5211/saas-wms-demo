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
@Table(name = "areas")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Area extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @Column(nullable = false, unique = true, length = 50)
    private String areaCode;

    @Column(nullable = false, length = 100)
    private String areaName;

    @Column(length = 500)
    private String detailDescription;

    private Integer priority;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Area(Account account, Warehouse warehouse, String areaCode, String areaName) {
        this.account = account;
        this.warehouse = warehouse;
        this.areaCode = areaCode;
        this.areaName = areaName;
        this.priority = 0;
        this.useYn = "Y";
    }

    public void update(Warehouse warehouse, String areaCode, String areaName, String detailDescription, Integer priority, String useYn) {
        this.account = warehouse.getAccount();
        this.warehouse = warehouse;
        this.areaCode = areaCode;
        this.areaName = areaName;
        this.detailDescription = detailDescription;
        this.priority = priority;
        this.useYn = normalizeUseYn(useYn);
    }

    public void updateOptionalFields(String detailDescription, Integer priority, String useYn) {
        this.detailDescription = detailDescription;
        this.priority = priority;
        this.useYn = normalizeUseYn(useYn);
    }

    public void deactivate() {
        this.useYn = "N";
    }

    private String normalizeUseYn(String useYn) {
        return "N".equals(useYn) ? "N" : "Y";
    }
}
