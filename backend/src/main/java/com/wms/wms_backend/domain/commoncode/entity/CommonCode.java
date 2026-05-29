package com.wms.wms_backend.domain.commoncode.entity;

import com.wms.wms_backend.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(
        name = "common_codes",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_common_codes_group_sub", columnNames = {"group_code", "sub_code"})
        }
)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CommonCode extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "group_code", nullable = false, length = 50)
    private String groupCode;

    @Column(name = "sub_code", nullable = false, length = 50)
    private String subCode;

    @Column(nullable = false, length = 100)
    private String codeName;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private Integer sortOrder;

    @Column(nullable = false, length = 1)
    private String useYn;

    public CommonCode(String groupCode, String subCode, String codeName, String description, Integer sortOrder) {
        this.groupCode = groupCode;
        this.subCode = subCode;
        this.codeName = codeName;
        this.description = description;
        this.sortOrder = sortOrder;
        this.useYn = "Y";
    }

    public void updateDetails(String codeName, String description, Integer sortOrder) {
        this.codeName = codeName;
        this.description = description;
        this.sortOrder = sortOrder;
        this.useYn = "Y";
    }
}
