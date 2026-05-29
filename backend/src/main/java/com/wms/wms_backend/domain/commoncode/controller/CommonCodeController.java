package com.wms.wms_backend.domain.commoncode.controller;

import com.wms.wms_backend.domain.commoncode.entity.CommonCode;
import com.wms.wms_backend.domain.commoncode.repository.CommonCodeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/common-codes")
public class CommonCodeController {

    private final CommonCodeRepository commonCodeRepository;

    @GetMapping("/{groupCode}")
    public List<CommonCodeResponse> findByGroupCode(@PathVariable String groupCode) {
        List<CommonCode> commonCodes = commonCodeRepository.findByGroupCodeAndUseYnOrderBySortOrderAsc(groupCode, "Y");
        List<CommonCodeResponse> responses = new ArrayList<>();

        for (CommonCode commonCode : commonCodes) {
            CommonCodeResponse response = CommonCodeResponse.from(commonCode);
            responses.add(response);
        }

        return responses;
    }

    public record CommonCodeResponse(
            String groupCode,
            String subCode,
            String codeName,
            Integer sortOrder
    ) {
        public static CommonCodeResponse from(CommonCode commonCode) {
            return new CommonCodeResponse(
                    commonCode.getGroupCode(),
                    commonCode.getSubCode(),
                    commonCode.getCodeName(),
                    commonCode.getSortOrder()
            );
        }
    }
}
