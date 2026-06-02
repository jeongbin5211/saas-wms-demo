package com.wms.wms_backend.domain.purchase.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
import com.wms.wms_backend.domain.item.entity.Item;
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

import java.math.BigDecimal;

@Getter
@Entity
@Table(name = "purchase_order_details")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurchaseOrderDetail extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    @Column(nullable = false)
    private Integer orderQuantity;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal unitPrice;

    public PurchaseOrderDetail(PurchaseOrder purchaseOrder, Item item, Integer orderQuantity, BigDecimal unitPrice) {
        this.purchaseOrder = purchaseOrder;
        this.item = item;
        this.orderQuantity = orderQuantity;
        this.unitPrice = unitPrice;
    }

    public BigDecimal getAmount() {
        return unitPrice.multiply(BigDecimal.valueOf(orderQuantity));
    }
}
