package com.wms.wms_backend.domain.user.entity;

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
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private Long topAccountId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(nullable = false, length = 50)
    private String roleSubCode;

    @Column(length = 50)
    private String oauthProvider;

    @Column(length = 100)
    private String oauthId;

    @Column(nullable = false)
    private Boolean isActive;

    public User(Account account, Long topAccountId, String name, String email, String roleSubCode) {
        this.account = account;
        this.topAccountId = topAccountId;
        this.name = name;
        this.email = email;
        this.roleSubCode = roleSubCode;
        this.isActive = true;
    }

    public User(Account account, Long topAccountId, String name, String email, String password, String roleSubCode) {
        this(account, topAccountId, name, email, roleSubCode);
        this.password = password;
    }

    public void changePassword(String password) {
        this.password = password;
    }

    public void changeProfile(String name, String roleSubCode) {
        this.name = name;
        this.roleSubCode = roleSubCode;
    }
}
