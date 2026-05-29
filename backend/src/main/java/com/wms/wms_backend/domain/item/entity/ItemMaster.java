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

@Getter
@Entity
@Table(name = "item_masters")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ItemMaster extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private Long topAccountId;

    @Column(nullable = false, unique = true, length = 50)
    private String itemMasterCode;

    @Column(nullable = false, length = 100)
    private String itemMasterName;

    @Column(nullable = false, length = 1)
    private String useYn;

    public ItemMaster(Account account, Long topAccountId, String itemMasterCode, String itemMasterName) {
        this.account = account;
        this.topAccountId = topAccountId;
        this.itemMasterCode = itemMasterCode;
        this.itemMasterName = itemMasterName;
        this.useYn = "Y";
    }
}
