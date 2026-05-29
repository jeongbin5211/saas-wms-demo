package com.wms.wms_backend.common.init;

import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.commoncode.entity.CommonCode;
import com.wms.wms_backend.domain.commoncode.repository.CommonCodeRepository;
import com.wms.wms_backend.domain.user.entity.User;
import com.wms.wms_backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Component
public class DataInitializer implements CommandLineRunner {

    private final CommonCodeRepository commonCodeRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initCommonCodes();
        initAccountsAndUsers();
    }

    private void initCommonCodes() {
        saveCommonCode("USER_ROLE", "ADMIN", "관리자", "전체 기준정보와 업무 데이터를 관리하는 사용자", 10);
        saveCommonCode("USER_ROLE", "STAFF", "일반 직원", "주문, 입고, 출고, 재고 업무를 처리하는 사용자", 20);
        saveCommonCode("USER_ROLE", "GUEST", "게스트", "포트폴리오 시연용 제한 사용자", 90);

        saveCommonCode("ACCOUNT_TYPE", "HQ", "본사", "최상위 조직", 10);
        saveCommonCode("ACCOUNT_TYPE", "CUSTOMER", "고객사", "판매주문과 출고의 대상 거래처", 20);
        saveCommonCode("ACCOUNT_TYPE", "SUPPLIER", "공급사", "구매주문과 입고의 대상 거래처", 30);
        saveCommonCode("ACCOUNT_TYPE", "PARTNER", "협력사", "운영 협력 거래처", 40);
    }

    private void saveCommonCode(String groupCode, String subCode, String codeName, String description, int sortOrder) {
        if (commonCodeRepository.existsByGroupCodeAndSubCode(groupCode, subCode)) {
            return;
        }

        commonCodeRepository.save(new CommonCode(groupCode, subCode, codeName, description, sortOrder));
    }

    private void initAccountsAndUsers() {
        Account hq = accountRepository.findByAccountCode("GLOBAL-LOGISTICS-HQ")
                .orElseGet(() -> accountRepository.save(new Account(null, "GLOBAL-LOGISTICS-HQ", "글로벌 물류 본사", "HQ")));

        if (hq.getTopAccountId() == null) {
            hq.assignTopAccountId(hq.getId());
        }

        Account customer = accountRepository.findByAccountCode("SEOUL-CUSTOMER")
                .orElseGet(() -> accountRepository.save(new Account(hq.getId(), "SEOUL-CUSTOMER", "서울 고객사", "CUSTOMER")));

        Account supplier = accountRepository.findByAccountCode("SMART-SUPPLY")
                .orElseGet(() -> accountRepository.save(new Account(hq.getId(), "SMART-SUPPLY", "스마트 공급사", "SUPPLIER")));

        saveUser(hq, hq.getId(), "관리자", "admin@saas-wms-demo.com", "ADMIN");
        saveUser(customer, hq.getId(), "일반 직원", "staff@saas-wms-demo.com", "STAFF");
        saveUser(supplier, hq.getId(), "게스트", "guest@saas-wms-demo.com", "GUEST");
    }

    private void saveUser(Account account, Long topAccountId, String name, String email, String roleSubCode) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        userRepository.save(new User(account, topAccountId, name, email, roleSubCode));
    }
}
