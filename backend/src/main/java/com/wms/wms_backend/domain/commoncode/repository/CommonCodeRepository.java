package com.wms.wms_backend.domain.commoncode.repository;

import com.wms.wms_backend.domain.commoncode.entity.CommonCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommonCodeRepository extends JpaRepository<CommonCode, Long> {

    boolean existsByGroupCodeAndSubCode(String groupCode, String subCode);

    Optional<CommonCode> findByGroupCodeAndSubCode(String groupCode, String subCode);

    List<CommonCode> findByGroupCodeAndUseYnOrderBySortOrderAsc(String groupCode, String useYn);
}
