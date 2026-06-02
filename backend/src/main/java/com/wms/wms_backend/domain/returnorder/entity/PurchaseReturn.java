package com.wms.wms_backend.domain.returnorder.entity;

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
@Table(name = "purchase_returns")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PurchaseReturn extends BaseEntity {

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
    private String purchaseReturnNo;

    @Column(nullable = false, length = 50)
    private String returnStatusSubCode;

    @Column(nullable = false)
    private LocalDate returnDate;

    @Column(nullable = false, length = 255)
    private String reason;

    public PurchaseReturn(Account account, PurchaseOrder purchaseOrder, String purchaseReturnNo, LocalDate returnDate, String reason) {
        this.account = account;
        this.purchaseOrder = purchaseOrder;
        this.purchaseReturnNo = purchaseReturnNo;
        this.returnStatusSubCode = "WAITING";
        this.returnDate = returnDate;
        this.reason = reason;
    }

    public void completeReturnOutbound() {
        this.returnStatusSubCode = "SHIPPED";
    }
}
