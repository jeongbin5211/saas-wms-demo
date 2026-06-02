package com.wms.wms_backend.domain.returnorder.entity;

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

import java.time.LocalDate;

@Getter
@Entity
@Table(name = "sales_returns")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SalesReturn extends BaseEntity {

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
    private String salesReturnNo;

    @Column(nullable = false, length = 50)
    private String returnStatusSubCode;

    @Column(nullable = false)
    private LocalDate returnDate;

    @Column(nullable = false, length = 255)
    private String reason;

    public SalesReturn(Account account, SalesOrder salesOrder, String salesReturnNo, LocalDate returnDate, String reason) {
        this.account = account;
        this.salesOrder = salesOrder;
        this.salesReturnNo = salesReturnNo;
        this.returnStatusSubCode = "WAITING";
        this.returnDate = returnDate;
        this.reason = reason;
    }

    public void completeReturnInbound() {
        this.returnStatusSubCode = "RECEIVED";
    }
}
