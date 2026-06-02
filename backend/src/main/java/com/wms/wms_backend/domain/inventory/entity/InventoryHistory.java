package com.wms.wms_backend.domain.inventory.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.item.entity.Item;
import com.wms.wms_backend.domain.warehouse.entity.Location;
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
@Table(name = "inventory_histories")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InventoryHistory extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false, length = 50)
    private String historyTypeSubCode;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer beforeQuantity;

    @Column(nullable = false)
    private Integer afterQuantity;

    @Column(nullable = false, length = 255)
    private String reason;

    public InventoryHistory(
            Account account,
            Item item,
            Location location,
            String historyTypeSubCode,
            Integer quantity,
            Integer beforeQuantity,
            Integer afterQuantity,
            String reason
    ) {
        this.account = account;
        this.item = item;
        this.location = location;
        this.historyTypeSubCode = historyTypeSubCode;
        this.quantity = quantity;
        this.beforeQuantity = beforeQuantity;
        this.afterQuantity = afterQuantity;
        this.reason = reason;
    }
}
