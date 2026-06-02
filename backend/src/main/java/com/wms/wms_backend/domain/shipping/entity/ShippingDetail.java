package com.wms.wms_backend.domain.shipping.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
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
@Table(name = "shipping_details")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ShippingDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shipping_id", nullable = false)
    private Shipping shipping;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private Integer shippedQuantity;

    public ShippingDetail(Shipping shipping, Item item, Location location, Integer shippedQuantity) {
        this.shipping = shipping;
        this.item = item;
        this.location = location;
        this.shippedQuantity = shippedQuantity;
    }
}
