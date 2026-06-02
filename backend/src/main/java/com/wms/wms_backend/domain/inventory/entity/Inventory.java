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
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(
        name = "inventories",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_inventories_item_location", columnNames = {"item_id", "location_id"})
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Inventory extends BaseEntity {

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

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Integer allocatedQuantity;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Inventory(Account account, Item item, Location location, Integer quantity, Integer allocatedQuantity) {
        this.account = account;
        this.item = item;
        this.location = location;
        this.quantity = quantity;
        this.allocatedQuantity = allocatedQuantity;
        this.useYn = "Y";
    }

    public Integer getAvailableQuantity() {
        return quantity - allocatedQuantity;
    }

    public void increaseQuantity(Integer quantity) {
        this.quantity += quantity;
    }

    public void decreaseQuantity(Integer quantity) {
        this.quantity -= quantity;
    }
}
