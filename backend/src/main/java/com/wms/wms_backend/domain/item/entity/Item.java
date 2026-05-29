package com.wms.wms_backend.domain.item.entity;

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

import java.math.BigDecimal;

@Getter
@Entity
@Table(name = "items")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Item extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_class_id", nullable = false)
    private ItemClass itemClass;

    @Column(nullable = false, unique = true, length = 50)
    private String itemCode;

    @Column(nullable = false, length = 150)
    private String itemName;

    @Column(unique = true, length = 100)
    private String barcode;

    @Column(nullable = false, length = 20)
    private String unit;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal purchasePrice;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal salesPrice;

    @Column(nullable = false, length = 1)
    private String useYn;

    public Item(
            Account account,
            ItemClass itemClass,
            String itemCode,
            String itemName,
            String barcode,
            String unit,
            BigDecimal purchasePrice,
            BigDecimal salesPrice
    ) {
        this.account = account;
        this.itemClass = itemClass;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.barcode = barcode;
        this.unit = unit;
        this.purchasePrice = purchasePrice;
        this.salesPrice = salesPrice;
        this.useYn = "Y";
    }
}
