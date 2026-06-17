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
@Table(name = "zones")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Zone extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "warehouse_id")
    private Warehouse warehouse;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "area_id", nullable = false)
    private Area area;

    @Column(nullable = false, unique = true, length = 50)
    private String zoneCode;

    @Column(nullable = false, length = 100)
    private String zoneName;

    @Column(length = 500)
    private String detailDescription;

    private Integer priority;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Zone(Account account, Area area, String zoneCode, String zoneName) {
        this.account = account;
        this.warehouse = area.getWarehouse();
        this.area = area;
        this.zoneCode = zoneCode;
        this.zoneName = zoneName;
        this.priority = 0;
        this.useYn = "Y";
    }

    public Warehouse getWarehouse() {
        return warehouse != null ? warehouse : area.getWarehouse();
    }

    public void update(Area area, String zoneCode, String zoneName, String detailDescription, Integer priority, String useYn) {
        this.account = area.getAccount();
        this.warehouse = area.getWarehouse();
        this.area = area;
        this.zoneCode = zoneCode;
        this.zoneName = zoneName;
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
