package com.wms.wms_backend.domain.sales.entity;

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

import java.time.LocalDate;

@Getter
@Entity
@Table(name = "sales_orders")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SalesOrder extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_account_id", nullable = false)
    private Account customerAccount;

    @Column(nullable = false, unique = true, length = 50)
    private String salesOrderNo;

    @Column(nullable = false, length = 50)
    private String orderStatusSubCode;

    @Column(nullable = false)
    private LocalDate orderDate;

    @Column(nullable = false, length = 255)
    private String note;

    public SalesOrder(Account account, Account customerAccount, String salesOrderNo, LocalDate orderDate, String note) {
        this.account = account;
        this.customerAccount = customerAccount;
        this.salesOrderNo = salesOrderNo;
        this.orderStatusSubCode = "WAITING";
        this.orderDate = orderDate;
        this.note = note;
    }

    public void completeShipping() {
        this.orderStatusSubCode = "SHIPPED";
    }

    public void completeBilling() {
        this.orderStatusSubCode = "BILLED";
    }
}
