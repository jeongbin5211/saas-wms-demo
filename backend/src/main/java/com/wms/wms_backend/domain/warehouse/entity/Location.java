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
@Table(name = "locations")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Location extends BaseEntity {

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
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;

    @Column(nullable = false, unique = true, length = 50)
    private String locationCode;

    @Column(nullable = false, length = 100)
    private String locationName;

    @Column(length = 500)
    private String detailDescription;

    @Column(length = 50)
    private String locationTypeSubCode;

    @Column(length = 50)
    private String logicalTypeSubCode;

    @Column(length = 100)
    private String mixKey;

    private Integer priority;

    private Integer putawayPriority;

    private Integer pickingPriority;

    private Integer allocPriority;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Location(Account account, Zone zone, String locationCode, String locationName) {
        this.account = account;
        this.warehouse = zone.getWarehouse();
        this.zone = zone;
        this.locationCode = locationCode;
        this.locationName = locationName;
        this.priority = 0;
        this.putawayPriority = 0;
        this.pickingPriority = 0;
        this.allocPriority = 0;
        this.useYn = "Y";
    }

    public Warehouse getWarehouse() {
        return warehouse != null ? warehouse : zone.getWarehouse();
    }

    public void update(
            Zone zone,
            String locationCode,
            String locationName,
            String detailDescription,
            String locationTypeSubCode,
            String logicalTypeSubCode,
            String mixKey,
            Integer priority,
            Integer putawayPriority,
            Integer pickingPriority,
            Integer allocPriority,
            String useYn
    ) {
        this.account = zone.getAccount();
        this.warehouse = zone.getWarehouse();
        this.zone = zone;
        this.locationCode = locationCode;
        this.locationName = locationName;
        this.detailDescription = detailDescription;
        this.locationTypeSubCode = locationTypeSubCode;
        this.logicalTypeSubCode = logicalTypeSubCode;
        this.mixKey = mixKey;
        this.priority = priority;
        this.putawayPriority = putawayPriority;
        this.pickingPriority = pickingPriority;
        this.allocPriority = allocPriority;
        this.useYn = normalizeUseYn(useYn);
    }

    public void updateOptionalFields(
            String detailDescription,
            String locationTypeSubCode,
            String logicalTypeSubCode,
            String mixKey,
            Integer priority,
            Integer putawayPriority,
            Integer pickingPriority,
            Integer allocPriority,
            String useYn
    ) {
        this.detailDescription = detailDescription;
        this.locationTypeSubCode = locationTypeSubCode;
        this.logicalTypeSubCode = logicalTypeSubCode;
        this.mixKey = mixKey;
        this.priority = priority;
        this.putawayPriority = putawayPriority;
        this.pickingPriority = pickingPriority;
        this.allocPriority = allocPriority;
        this.useYn = normalizeUseYn(useYn);
    }

    public void deactivate() {
        this.useYn = "N";
    }

    private String normalizeUseYn(String useYn) {
        return "N".equals(useYn) ? "N" : "Y";
    }
}
