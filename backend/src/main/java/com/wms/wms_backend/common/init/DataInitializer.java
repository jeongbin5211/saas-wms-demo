package com.wms.wms_backend.common.init;

import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.commoncode.entity.CommonCode;
import com.wms.wms_backend.domain.commoncode.repository.CommonCodeRepository;
import com.wms.wms_backend.domain.item.entity.Item;
import com.wms.wms_backend.domain.item.entity.ItemClass;
import com.wms.wms_backend.domain.item.entity.ItemMaster;
import com.wms.wms_backend.domain.item.repository.ItemClassRepository;
import com.wms.wms_backend.domain.item.repository.ItemMasterRepository;
import com.wms.wms_backend.domain.item.repository.ItemRepository;
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

import java.math.BigDecimal;

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
    private final ItemMasterRepository itemMasterRepository;
    private final ItemClassRepository itemClassRepository;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initCommonCodes();
        initDemoData();
    }

    private void initCommonCodes() {
        saveCommonCode("USER_ROLE", "ADMIN", "Admin", "User who can manage master data and business data", 10);
        saveCommonCode("USER_ROLE", "STAFF", "Staff", "User who can process orders, inbound, outbound, and inventory", 20);
        saveCommonCode("USER_ROLE", "GUEST", "Guest", "Limited user for portfolio demo", 90);

        saveCommonCode("ACCOUNT_TYPE", "HQ", "Headquarters", "Top-level organization", 10);
        saveCommonCode("ACCOUNT_TYPE", "CUSTOMER", "Customer", "Account for sales orders and outbound process", 20);
        saveCommonCode("ACCOUNT_TYPE", "SUPPLIER", "Supplier", "Account for purchase orders and inbound process", 30);
        saveCommonCode("ACCOUNT_TYPE", "PARTNER", "Partner", "Operational partner account", 40);

        saveCommonCode("WAREHOUSE_TYPE", "MAIN", "Main Warehouse", "Warehouse for regular inbound and outbound operations", 10);
        saveCommonCode("WAREHOUSE_TYPE", "RETURN", "Return Warehouse", "Warehouse for return receiving and inspection", 20);
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

    private void initDemoData() {
        Account hq = accountRepository.findByAccountCode("GLOBAL-LOGISTICS-HQ")
                .orElseGet(() -> accountRepository.save(new Account(null, "GLOBAL-LOGISTICS-HQ", "Global Logistics HQ", "HQ")));

        if (hq.getTopAccountId() == null) {
            hq.assignTopAccountId(hq.getId());
        }

        Account customer = accountRepository.findByAccountCode("SEOUL-CUSTOMER")
                .orElseGet(() -> accountRepository.save(new Account(hq.getId(), "SEOUL-CUSTOMER", "Seoul Customer", "CUSTOMER")));

        Account supplier = accountRepository.findByAccountCode("SMART-SUPPLY")
                .orElseGet(() -> accountRepository.save(new Account(hq.getId(), "SMART-SUPPLY", "Smart Supplier", "SUPPLIER")));

        saveUser(hq, hq.getId(), "Admin User", "admin@saas-wms-demo.com", "ADMIN");
        saveUser(customer, hq.getId(), "Staff User", "staff@saas-wms-demo.com", "STAFF");
        saveUser(supplier, hq.getId(), "Guest User", "guest@saas-wms-demo.com", "GUEST");

        Warehouse mainWarehouse = warehouseRepository.findByWarehouseCode("WH-MAIN")
                .orElseGet(() -> warehouseRepository.save(new Warehouse(hq, hq.getId(), "WH-MAIN", "Main Warehouse", "MAIN")));

        Area inboundArea = areaRepository.findByAreaCode("A-IN")
                .orElseGet(() -> areaRepository.save(new Area(hq, mainWarehouse, "A-IN", "Inbound Area")));

        Area outboundArea = areaRepository.findByAreaCode("A-OUT")
                .orElseGet(() -> areaRepository.save(new Area(hq, mainWarehouse, "A-OUT", "Outbound Area")));

        Zone inboundZone = zoneRepository.findByZoneCode("Z-IN-01")
                .orElseGet(() -> zoneRepository.save(new Zone(hq, inboundArea, "Z-IN-01", "Inbound Waiting Zone")));

        Zone pickingZone = zoneRepository.findByZoneCode("Z-OUT-01")
                .orElseGet(() -> zoneRepository.save(new Zone(hq, outboundArea, "Z-OUT-01", "Picking Zone")));

        saveLocation(hq, inboundZone, "L-IN-001", "Inbound Inspection Location");
        saveLocation(hq, pickingZone, "L-PICK-001", "Picking Location 1");
        saveLocation(hq, pickingZone, "L-PICK-002", "Picking Location 2");

        ItemMaster household = itemMasterRepository.findByItemMasterCode("IM-HOUSEHOLD")
                .orElseGet(() -> itemMasterRepository.save(new ItemMaster(hq, hq.getId(), "IM-HOUSEHOLD", "Household Goods")));

        ItemMaster electronics = itemMasterRepository.findByItemMasterCode("IM-ELECTRONICS")
                .orElseGet(() -> itemMasterRepository.save(new ItemMaster(hq, hq.getId(), "IM-ELECTRONICS", "Electronics")));

        ItemClass detergent = itemClassRepository.findByItemClassCode("IC-DETERGENT")
                .orElseGet(() -> itemClassRepository.save(new ItemClass(hq, household, "IC-DETERGENT", "Detergent")));

        ItemClass accessories = itemClassRepository.findByItemClassCode("IC-ACCESSORY")
                .orElseGet(() -> itemClassRepository.save(new ItemClass(hq, electronics, "IC-ACCESSORY", "Electronic Accessories")));

        saveItem(hq, detergent, "ITEM-DETERGENT-1L", "Liquid Detergent 1L", "880100000001", "EA", "3200.00", "5500.00");
        saveItem(hq, accessories, "ITEM-USB-C-1M", "USB-C Cable 1m", "880100000002", "EA", "1800.00", "3900.00");
        saveItem(hq, accessories, "ITEM-WIRELESS-KB", "Wireless Keyboard", "880100000003", "EA", "12000.00", "24900.00");
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

    private void saveItem(
            Account account,
            ItemClass itemClass,
            String itemCode,
            String itemName,
            String barcode,
            String unit,
            String purchasePrice,
            String salesPrice
    ) {
        if (itemRepository.existsByItemCode(itemCode)) {
            return;
        }

        itemRepository.save(new Item(
                account,
                itemClass,
                itemCode,
                itemName,
                barcode,
                unit,
                new BigDecimal(purchasePrice),
                new BigDecimal(salesPrice)
        ));
    }
}
