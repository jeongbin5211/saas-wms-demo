package com.wms.wms_backend.domain.receiving.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.purchase.entity.PurchaseOrder;
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

import java.time.LocalDate;

@Getter
@Entity
@Table(name = "receivings")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Receiving extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder purchaseOrder;

    @Column(nullable = false, unique = true, length = 50)
    private String receivingNo;

    @Column(nullable = false, length = 50)
    private String receivingStatusSubCode;

    @Column(nullable = false)
    private LocalDate receivingDate;

    public Receiving(Account account, PurchaseOrder purchaseOrder, String receivingNo, LocalDate receivingDate) {
        this.account = account;
        this.purchaseOrder = purchaseOrder;
        this.receivingNo = receivingNo;
        this.receivingStatusSubCode = "WAITING";
        this.receivingDate = receivingDate;
    }

    public void confirm() {
        this.receivingStatusSubCode = "CONFIRMED";
    }
}
