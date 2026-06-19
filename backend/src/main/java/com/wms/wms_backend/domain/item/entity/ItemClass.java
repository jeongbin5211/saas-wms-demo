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
@Table(name = "item_classes")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ItemClass extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_master_id", nullable = false)
    private ItemMaster itemMaster;

    @Column(nullable = false, unique = true, length = 50)
    private String itemClassCode;

    @Column(nullable = false, length = 100)
    private String itemClassName;

    @Column(nullable = false, length = 1)
    private String useYn;

    public ItemClass(Account account, ItemMaster itemMaster, String itemClassCode, String itemClassName) {
        this.account = account;
        this.itemMaster = itemMaster;
        this.itemClassCode = itemClassCode;
        this.itemClassName = itemClassName;
        this.useYn = "Y";
    }

    public void update(ItemMaster itemMaster, String itemClassName, String useYn) {
        this.account = itemMaster.getAccount();
        this.itemMaster = itemMaster;
        this.itemClassName = itemClassName;
        this.useYn = normalizeUseYn(useYn);
    }

    public void deactivate() {
        this.useYn = "N";
    }

    private String normalizeUseYn(String useYn) {
        return "N".equals(useYn) ? "N" : "Y";
    }
}
