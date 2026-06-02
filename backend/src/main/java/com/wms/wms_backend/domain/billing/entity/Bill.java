package com.wms.wms_backend.domain.billing.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.sales.entity.SalesOrder;
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
import java.time.LocalDate;

@Getter
@Entity
@Table(name = "bills")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bill extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @Column(nullable = false, unique = true, length = 50)
    private String billNo;

    @Column(nullable = false, length = 50)
    private String billStatusSubCode;

    @Column(nullable = false)
    private LocalDate billDate;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    public Bill(Account account, SalesOrder salesOrder, String billNo, LocalDate billDate, BigDecimal totalAmount) {
        this.account = account;
        this.salesOrder = salesOrder;
        this.billNo = billNo;
        this.billStatusSubCode = "ISSUED";
        this.billDate = billDate;
        this.totalAmount = totalAmount;
    }
}
