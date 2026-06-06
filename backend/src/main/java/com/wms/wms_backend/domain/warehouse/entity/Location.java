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
    @JoinColumn(name = "zone_id", nullable = false)
    private Zone zone;

    @Column(nullable = false, unique = true, length = 50)
    private String locationCode;

    @Column(nullable = false, length = 100)
    private String locationName;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Location(Account account, Zone zone, String locationCode, String locationName) {
        this.account = account;
        this.zone = zone;
        this.locationCode = locationCode;
        this.locationName = locationName;
        this.useYn = "Y";
    }

    public void update(Zone zone, String locationCode, String locationName) {
        this.account = zone.getAccount();
        this.zone = zone;
        this.locationCode = locationCode;
        this.locationName = locationName;
    }

    public void deactivate() {
        this.useYn = "N";
    }
}
