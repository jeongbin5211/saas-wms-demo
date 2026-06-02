package com.wms.wms_backend.domain.receiving.entity;

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
@Table(name = "receiving_details")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReceivingDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiving_id", nullable = false)
    private Receiving receiving;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;

    @Column(nullable = false)
    private Integer receivedQuantity;

    public ReceivingDetail(Receiving receiving, Item item, Location location, Integer receivedQuantity) {
        this.receiving = receiving;
        this.item = item;
        this.location = location;
        this.receivedQuantity = receivedQuantity;
    }
}
