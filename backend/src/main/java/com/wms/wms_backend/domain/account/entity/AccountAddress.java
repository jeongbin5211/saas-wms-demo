package com.wms.wms_backend.domain.account.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
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
@Table(name = "account_addresses")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AccountAddress extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private Long topAccountId;

    @Column(nullable = false, unique = true, length = 50)
    private String addressCode;

    @Column(nullable = false, length = 100)
    private String addressName;

    @Column(length = 200)
    private String addressLine1;

    @Column(length = 200)
    private String addressLine2;

    @Column(length = 80)
    private String city;

    @Column(length = 80)
    private String state;

    @Column(length = 30)
    private String zipcode;

    @Column(length = 50)
    private String country;

    @Column(length = 30)
    private String phoneNo;

    @Column(length = 30)
    private String faxNo;

    @Column(length = 50)
    private String contactName;

    @Column(nullable = false, length = 1)
    private String useYn;

    public AccountAddress(
            Account account,
            String addressCode,
            String addressName,
            String addressLine1,
            String addressLine2,
            String city,
            String state,
            String zipcode,
            String country,
            String phoneNo,
            String faxNo,
            String contactName
    ) {
        this.account = account;
        this.topAccountId = account.getTopAccountId();
        this.addressCode = addressCode;
        this.addressName = addressName;
        this.addressLine1 = addressLine1;
        this.addressLine2 = addressLine2;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.country = country;
        this.phoneNo = phoneNo;
        this.faxNo = faxNo;
        this.contactName = contactName;
        this.useYn = "Y";
    }

    public String fullAddress() {
        StringBuilder builder = new StringBuilder();
        append(builder, addressLine1);
        append(builder, addressLine2);
        append(builder, city);
        append(builder, state);
        append(builder, zipcode);
        append(builder, country);
        return builder.toString();
    }

    private void append(StringBuilder builder, String value) {
        if (value == null || value.trim().isEmpty()) {
            return;
        }

        if (!builder.isEmpty()) {
            builder.append(' ');
        }
        builder.append(value.trim());
    }
}
