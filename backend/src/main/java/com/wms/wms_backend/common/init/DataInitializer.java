package com.wms.wms_backend.common.init;

import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.commoncode.entity.CommonCode;
import com.wms.wms_backend.domain.commoncode.repository.CommonCodeRepository;
import com.wms.wms_backend.domain.user.entity.User;
import com.wms.wms_backend.domain.user.repository.UserRepository;
import com.wms.wms_backend.domain.warehouse.entity.Area;
import com.wms.wms_backend.domain.warehouse.entity.Location;
import com.wms.wms_backend.domain.warehouse.entity.Warehouse;
import com.wms.wms_backend.domain.warehouse.entity.Zone;
import com.wms.wms_backend.domain.warehouse.repository.AreaRepository;
import com.wms.wms_backend.domain.warehouse.repository.LocationRepository;
import com.wms.wms_backend.domain.warehouse.repository.WarehouseRepository;
import com.wms.wms_backend.domain.warehouse.repository.ZoneRepository;
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
    private final WarehouseRepository warehouseRepository;
    private final AreaRepository areaRepository;
    private final ZoneRepository zoneRepository;
    private final LocationRepository locationRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initCommonCodes();
        initAccountsUsersAndLocations();
    }

    private void initCommonCodes() {
        saveCommonCode("USER_ROLE", "ADMIN", "관리자", "전체 기준정보와 업무 데이터를 관리하는 사용자", 10);
        saveCommonCode("USER_ROLE", "STAFF", "일반 직원", "주문, 입고, 출고, 재고 업무를 처리하는 사용자", 20);
        saveCommonCode("USER_ROLE", "GUEST", "게스트", "포트폴리오 시연용 제한 사용자", 90);

        saveCommonCode("ACCOUNT_TYPE", "HQ", "본사", "최상위 조직", 10);
        saveCommonCode("ACCOUNT_TYPE", "CUSTOMER", "고객사", "판매주문과 출고의 대상 거래처", 20);
        saveCommonCode("ACCOUNT_TYPE", "SUPPLIER", "공급사", "구매주문과 입고의 대상 거래처", 30);
        saveCommonCode("ACCOUNT_TYPE", "PARTNER", "협력사", "운영 협력 거래처", 40);

        saveCommonCode("WAREHOUSE_TYPE", "MAIN", "주창고", "기본 입출고 작업이 이루어지는 창고", 10);
        saveCommonCode("WAREHOUSE_TYPE", "RETURN", "반품창고", "반품 입고와 검수가 이루어지는 창고", 20);
    }

    private void saveCommonCode(String groupCode, String subCode, String codeName, String description, int sortOrder) {
        CommonCode commonCode = commonCodeRepository.findByGroupCodeAndSubCode(groupCode, subCode)
                .orElse(null);

        if (commonCode != null) {
            commonCode.updateDetails(codeName, description, sortOrder);
            return;
        }

        commonCodeRepository.save(new CommonCode(groupCode, subCode, codeName, description, sortOrder));
    }

    private void initAccountsUsersAndLocations() {
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

        Warehouse mainWarehouse = warehouseRepository.findByWarehouseCode("WH-MAIN")
                .orElseGet(() -> warehouseRepository.save(new Warehouse(hq, hq.getId(), "WH-MAIN", "메인 물류창고", "MAIN")));

        Area inboundArea = areaRepository.findByAreaCode("A-IN")
                .orElseGet(() -> areaRepository.save(new Area(hq, mainWarehouse, "A-IN", "입고 Area")));

        Area outboundArea = areaRepository.findByAreaCode("A-OUT")
                .orElseGet(() -> areaRepository.save(new Area(hq, mainWarehouse, "A-OUT", "출고 Area")));

        Zone inboundZone = zoneRepository.findByZoneCode("Z-IN-01")
                .orElseGet(() -> zoneRepository.save(new Zone(hq, inboundArea, "Z-IN-01", "입고 대기 Zone")));

        Zone pickingZone = zoneRepository.findByZoneCode("Z-OUT-01")
                .orElseGet(() -> zoneRepository.save(new Zone(hq, outboundArea, "Z-OUT-01", "피킹 Zone")));

        saveLocation(hq, inboundZone, "L-IN-001", "입고 검수 Location");
        saveLocation(hq, pickingZone, "L-PICK-001", "피킹 Location 1");
        saveLocation(hq, pickingZone, "L-PICK-002", "피킹 Location 2");
    }

    private void saveUser(Account account, Long topAccountId, String name, String email, String roleSubCode) {
        if (userRepository.existsByEmail(email)) {
            return;
        }

        userRepository.save(new User(account, topAccountId, name, email, roleSubCode));
    }

    private void saveLocation(Account account, Zone zone, String locationCode, String locationName) {
        if (locationRepository.existsByLocationCode(locationCode)) {
            return;
        }

        locationRepository.save(new Location(account, zone, locationCode, locationName));
    }
}
