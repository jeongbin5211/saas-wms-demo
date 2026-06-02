package com.wms.wms_backend.common.init;

import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.billing.entity.Bill;
import com.wms.wms_backend.domain.billing.entity.BillDetail;
import com.wms.wms_backend.domain.billing.repository.BillDetailRepository;
import com.wms.wms_backend.domain.billing.repository.BillRepository;
import com.wms.wms_backend.domain.commoncode.entity.CommonCode;
import com.wms.wms_backend.domain.commoncode.repository.CommonCodeRepository;
import com.wms.wms_backend.domain.inventory.entity.Inventory;
import com.wms.wms_backend.domain.inventory.entity.InventoryHistory;
import com.wms.wms_backend.domain.inventory.repository.InventoryHistoryRepository;
import com.wms.wms_backend.domain.inventory.repository.InventoryRepository;
import com.wms.wms_backend.domain.item.entity.Item;
import com.wms.wms_backend.domain.item.entity.ItemClass;
import com.wms.wms_backend.domain.item.entity.ItemMaster;
import com.wms.wms_backend.domain.item.repository.ItemClassRepository;
import com.wms.wms_backend.domain.item.repository.ItemMasterRepository;
import com.wms.wms_backend.domain.item.repository.ItemRepository;
import com.wms.wms_backend.domain.purchase.entity.PurchaseOrder;
import com.wms.wms_backend.domain.purchase.entity.PurchaseOrderDetail;
import com.wms.wms_backend.domain.purchase.repository.PurchaseOrderDetailRepository;
import com.wms.wms_backend.domain.purchase.repository.PurchaseOrderRepository;
import com.wms.wms_backend.domain.receiving.entity.Receiving;
import com.wms.wms_backend.domain.receiving.entity.ReceivingDetail;
import com.wms.wms_backend.domain.receiving.repository.ReceivingDetailRepository;
import com.wms.wms_backend.domain.receiving.repository.ReceivingRepository;
import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturn;
import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturnDetail;
import com.wms.wms_backend.domain.returnorder.entity.SalesReturn;
import com.wms.wms_backend.domain.returnorder.entity.SalesReturnDetail;
import com.wms.wms_backend.domain.returnorder.repository.PurchaseReturnDetailRepository;
import com.wms.wms_backend.domain.returnorder.repository.PurchaseReturnRepository;
import com.wms.wms_backend.domain.returnorder.repository.SalesReturnDetailRepository;
import com.wms.wms_backend.domain.returnorder.repository.SalesReturnRepository;
import com.wms.wms_backend.domain.sales.entity.SalesOrder;
import com.wms.wms_backend.domain.sales.entity.SalesOrderDetail;
import com.wms.wms_backend.domain.sales.repository.SalesOrderDetailRepository;
import com.wms.wms_backend.domain.sales.repository.SalesOrderRepository;
import com.wms.wms_backend.domain.shipping.entity.Shipping;
import com.wms.wms_backend.domain.shipping.entity.ShippingDetail;
import com.wms.wms_backend.domain.shipping.repository.ShippingDetailRepository;
import com.wms.wms_backend.domain.shipping.repository.ShippingRepository;
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
import java.time.LocalDate;

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
    private final InventoryRepository inventoryRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final PurchaseOrderDetailRepository purchaseOrderDetailRepository;
    private final ReceivingRepository receivingRepository;
    private final ReceivingDetailRepository receivingDetailRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final SalesOrderDetailRepository salesOrderDetailRepository;
    private final ShippingRepository shippingRepository;
    private final ShippingDetailRepository shippingDetailRepository;
    private final BillRepository billRepository;
    private final BillDetailRepository billDetailRepository;
    private final PurchaseReturnRepository purchaseReturnRepository;
    private final PurchaseReturnDetailRepository purchaseReturnDetailRepository;
    private final SalesReturnRepository salesReturnRepository;
    private final SalesReturnDetailRepository salesReturnDetailRepository;

    @Override
    @Transactional
    public void run(String... args) {
        initCommonCodes();
        initDemoData();
    }

    private void initCommonCodes() {
        saveCommonCode("USER_ROLE", "ADMIN", "관리자", "기준정보와 업무 데이터를 관리할 수 있는 사용자", 10);
        saveCommonCode("USER_ROLE", "STAFF", "일반 직원", "주문, 입고, 출고, 재고 업무를 처리하는 사용자", 20);
        saveCommonCode("USER_ROLE", "GUEST", "게스트", "시연 확인용 제한 사용자", 90);

        saveCommonCode("ACCOUNT_TYPE", "HQ", "본사", "상위 조직", 10);
        saveCommonCode("ACCOUNT_TYPE", "CUSTOMER", "고객사", "판매주문과 출고 흐름의 거래처", 20);
        saveCommonCode("ACCOUNT_TYPE", "SUPPLIER", "공급사", "구매주문과 입고 흐름의 거래처", 30);
        saveCommonCode("ACCOUNT_TYPE", "PARTNER", "협력사", "운영 협력 거래처", 40);

        saveCommonCode("WAREHOUSE_TYPE", "MAIN", "일반 창고", "일반 입고와 출고를 처리하는 창고", 10);
        saveCommonCode("WAREHOUSE_TYPE", "RETURN", "반품 창고", "반품 입고와 검수를 처리하는 창고", 20);

        saveCommonCode("INVENTORY_HISTORY_TYPE", "INBOUND", "입고", "입고 확정으로 증가한 재고", 10);
        saveCommonCode("INVENTORY_HISTORY_TYPE", "OUTBOUND", "출고", "출고 확정으로 감소한 재고", 20);
        saveCommonCode("INVENTORY_HISTORY_TYPE", "ADJUSTMENT", "조정", "수동 조정 또는 기초재고 설정으로 변경된 재고", 30);
        saveCommonCode("INVENTORY_HISTORY_TYPE", "RETURN_INBOUND", "반품입고", "판매반품 입고로 증가한 재고", 40);
        saveCommonCode("INVENTORY_HISTORY_TYPE", "RETURN_OUTBOUND", "반품출고", "구매반품 출고로 감소한 재고", 50);

        saveCommonCode("PURCHASE_ORDER_STATUS", "WAITING", "대기", "구매주문이 생성되어 입고를 기다리는 상태", 10);
        saveCommonCode("PURCHASE_ORDER_STATUS", "RECEIVED", "입고완료", "구매주문 입고가 완료된 상태", 20);
        saveCommonCode("PURCHASE_ORDER_STATUS", "CLOSED", "마감", "구매주문이 마감된 상태", 30);

        saveCommonCode("RECEIVING_STATUS", "WAITING", "대기", "입고가 생성되어 확정을 기다리는 상태", 10);
        saveCommonCode("RECEIVING_STATUS", "CONFIRMED", "확정", "입고가 확정되어 재고가 증가한 상태", 20);

        saveCommonCode("SALES_ORDER_STATUS", "WAITING", "대기", "판매주문이 생성되어 출고를 기다리는 상태", 10);
        saveCommonCode("SALES_ORDER_STATUS", "SHIPPED", "출고완료", "판매주문 출고가 완료된 상태", 20);
        saveCommonCode("SALES_ORDER_STATUS", "BILLED", "청구완료", "판매주문 청구가 완료된 상태", 30);

        saveCommonCode("SHIPPING_STATUS", "WAITING", "대기", "출고가 생성되어 확정을 기다리는 상태", 10);
        saveCommonCode("SHIPPING_STATUS", "CONFIRMED", "확정", "출고가 확정되어 재고가 감소한 상태", 20);

        saveCommonCode("BILL_STATUS", "ISSUED", "발행", "청구서가 발행된 상태", 10);
        saveCommonCode("BILL_STATUS", "PAID", "입금완료", "청구 금액 입금이 완료된 상태", 20);

        saveCommonCode("PURCHASE_RETURN_STATUS", "WAITING", "대기", "구매반품이 생성되어 반품출고를 기다리는 상태", 10);
        saveCommonCode("PURCHASE_RETURN_STATUS", "SHIPPED", "반품출고", "구매반품 출고가 완료된 상태", 20);

        saveCommonCode("SALES_RETURN_STATUS", "WAITING", "대기", "판매반품이 생성되어 반품입고를 기다리는 상태", 10);
        saveCommonCode("SALES_RETURN_STATUS", "RECEIVED", "반품입고", "판매반품 입고가 완료된 상태", 20);
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

        Item detergentItem = itemRepository.findByItemCode("ITEM-DETERGENT-1L")
                .orElseThrow();
        Item usbCable = itemRepository.findByItemCode("ITEM-USB-C-1M")
                .orElseThrow();
        Item keyboard = itemRepository.findByItemCode("ITEM-WIRELESS-KB")
                .orElseThrow();

        Location pickingLocation1 = locationRepository.findByLocationCode("L-PICK-001")
                .orElseThrow();
        Location pickingLocation2 = locationRepository.findByLocationCode("L-PICK-002")
                .orElseThrow();

        saveInventory(hq, detergentItem, pickingLocation1, 120, 10, "Initial demo stock");
        saveInventory(hq, usbCable, pickingLocation2, 300, 25, "Initial demo stock");
        saveInventory(hq, keyboard, pickingLocation2, 80, 5, "Initial demo stock");

        PurchaseOrder purchaseOrder = purchaseOrderRepository.findByPurchaseOrderNo("PO-20260602-001")
                .orElseGet(() -> purchaseOrderRepository.save(new PurchaseOrder(
                        hq,
                        supplier,
                        "PO-20260602-001",
                        LocalDate.of(2026, 6, 2),
                        "Demo purchase order for inbound process"
                )));

        savePurchaseOrderDetail(purchaseOrder, detergentItem, 50, "3200.00");
        savePurchaseOrderDetail(purchaseOrder, usbCable, 100, "1800.00");

        Receiving receiving = receivingRepository.findByReceivingNo("RCV-20260602-001")
                .orElseGet(() -> receivingRepository.save(new Receiving(
                        hq,
                        purchaseOrder,
                        "RCV-20260602-001",
                        LocalDate.of(2026, 6, 2)
                )));

        saveReceivingDetailAndIncreaseInventory(hq, receiving, detergentItem, pickingLocation1, 50);
        saveReceivingDetailAndIncreaseInventory(hq, receiving, usbCable, pickingLocation2, 100);
        purchaseOrder.completeReceiving();

        SalesOrder salesOrder = salesOrderRepository.findBySalesOrderNo("SO-20260602-001")
                .orElseGet(() -> salesOrderRepository.save(new SalesOrder(
                        hq,
                        customer,
                        "SO-20260602-001",
                        LocalDate.of(2026, 6, 2),
                        "Demo sales order for outbound process"
                )));

        saveSalesOrderDetail(salesOrder, detergentItem, 20, "5500.00");
        saveSalesOrderDetail(salesOrder, keyboard, 10, "24900.00");

        Shipping shipping = shippingRepository.findByShippingNo("SHP-20260602-001")
                .orElseGet(() -> shippingRepository.save(new Shipping(
                        hq,
                        salesOrder,
                        "SHP-20260602-001",
                        LocalDate.of(2026, 6, 2)
                )));

        saveShippingDetailAndDecreaseInventory(hq, shipping, detergentItem, pickingLocation1, 20);
        saveShippingDetailAndDecreaseInventory(hq, shipping, keyboard, pickingLocation2, 10);
        salesOrder.completeShipping();

        BigDecimal billTotalAmount = new BigDecimal("0.00")
                .add(new BigDecimal("5500.00").multiply(BigDecimal.valueOf(20)))
                .add(new BigDecimal("24900.00").multiply(BigDecimal.valueOf(10)));

        Bill bill = billRepository.findByBillNo("BILL-20260602-001")
                .orElseGet(() -> billRepository.save(new Bill(
                        hq,
                        salesOrder,
                        "BILL-20260602-001",
                        LocalDate.of(2026, 6, 2),
                        billTotalAmount
                )));

        saveBillDetail(bill, detergentItem, 20, "5500.00");
        saveBillDetail(bill, keyboard, 10, "24900.00");
        salesOrder.completeBilling();

        PurchaseReturn purchaseReturn = purchaseReturnRepository.findByPurchaseReturnNo("PR-20260602-001")
                .orElseGet(() -> purchaseReturnRepository.save(new PurchaseReturn(
                        hq,
                        purchaseOrder,
                        "PR-20260602-001",
                        LocalDate.of(2026, 6, 2),
                        "Supplier return for damaged inbound stock"
                )));

        savePurchaseReturnDetailAndDecreaseInventory(hq, purchaseReturn, usbCable, pickingLocation2, 5);
        purchaseReturn.completeReturnOutbound();

        SalesReturn salesReturn = salesReturnRepository.findBySalesReturnNo("SR-20260602-001")
                .orElseGet(() -> salesReturnRepository.save(new SalesReturn(
                        hq,
                        salesOrder,
                        "SR-20260602-001",
                        LocalDate.of(2026, 6, 2),
                        "Customer return for simple exchange"
                )));

        saveSalesReturnDetailAndIncreaseInventory(hq, salesReturn, detergentItem, pickingLocation1, 2);
        salesReturn.completeReturnInbound();
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

    private void saveInventory(
            Account account,
            Item item,
            Location location,
            Integer quantity,
            Integer allocatedQuantity,
            String reason
    ) {
        if (inventoryRepository.existsByItemIdAndLocationId(item.getId(), location.getId())) {
            return;
        }

        inventoryRepository.save(new Inventory(account, item, location, quantity, allocatedQuantity));

        if (inventoryHistoryRepository.existsByItemIdAndLocationIdAndHistoryTypeSubCode(item.getId(), location.getId(), "ADJUSTMENT")) {
            return;
        }

        inventoryHistoryRepository.save(new InventoryHistory(
                account,
                item,
                location,
                "ADJUSTMENT",
                quantity,
                0,
                quantity,
                reason
        ));
    }

    private void savePurchaseOrderDetail(PurchaseOrder purchaseOrder, Item item, Integer orderQuantity, String unitPrice) {
        if (purchaseOrderDetailRepository.existsByPurchaseOrderIdAndItemId(purchaseOrder.getId(), item.getId())) {
            return;
        }

        purchaseOrderDetailRepository.save(new PurchaseOrderDetail(
                purchaseOrder,
                item,
                orderQuantity,
                new BigDecimal(unitPrice)
        ));
    }

    private void saveReceivingDetailAndIncreaseInventory(
            Account account,
            Receiving receiving,
            Item item,
            Location location,
            Integer receivedQuantity
    ) {
        if (receivingDetailRepository.existsByReceivingIdAndItemIdAndLocationId(receiving.getId(), item.getId(), location.getId())) {
            return;
        }

        receivingDetailRepository.save(new ReceivingDetail(receiving, item, location, receivedQuantity));

        Inventory inventory = inventoryRepository.findByItemIdAndLocationId(item.getId(), location.getId())
                .orElseGet(() -> inventoryRepository.save(new Inventory(account, item, location, 0, 0)));

        Integer beforeQuantity = inventory.getQuantity();
        inventory.increaseQuantity(receivedQuantity);

        inventoryHistoryRepository.save(new InventoryHistory(
                account,
                item,
                location,
                "INBOUND",
                receivedQuantity,
                beforeQuantity,
                inventory.getQuantity(),
                "Receiving confirmed: " + receiving.getReceivingNo()
        ));
    }

    private void saveSalesOrderDetail(SalesOrder salesOrder, Item item, Integer orderQuantity, String unitPrice) {
        if (salesOrderDetailRepository.existsBySalesOrderIdAndItemId(salesOrder.getId(), item.getId())) {
            return;
        }

        salesOrderDetailRepository.save(new SalesOrderDetail(
                salesOrder,
                item,
                orderQuantity,
                new BigDecimal(unitPrice)
        ));
    }

    private void saveShippingDetailAndDecreaseInventory(
            Account account,
            Shipping shipping,
            Item item,
            Location location,
            Integer shippedQuantity
    ) {
        if (shippingDetailRepository.existsByShippingIdAndItemIdAndLocationId(shipping.getId(), item.getId(), location.getId())) {
            return;
        }

        shippingDetailRepository.save(new ShippingDetail(shipping, item, location, shippedQuantity));

        Inventory inventory = inventoryRepository.findByItemIdAndLocationId(item.getId(), location.getId())
                .orElseThrow();

        Integer beforeQuantity = inventory.getQuantity();
        inventory.decreaseQuantity(shippedQuantity);

        inventoryHistoryRepository.save(new InventoryHistory(
                account,
                item,
                location,
                "OUTBOUND",
                shippedQuantity,
                beforeQuantity,
                inventory.getQuantity(),
                "Shipping confirmed: " + shipping.getShippingNo()
        ));
    }

    private void saveBillDetail(Bill bill, Item item, Integer billQuantity, String unitPrice) {
        if (billDetailRepository.existsByBillIdAndItemId(bill.getId(), item.getId())) {
            return;
        }

        billDetailRepository.save(new BillDetail(
                bill,
                item,
                billQuantity,
                new BigDecimal(unitPrice)
        ));
    }

    private void savePurchaseReturnDetailAndDecreaseInventory(
            Account account,
            PurchaseReturn purchaseReturn,
            Item item,
            Location location,
            Integer returnQuantity
    ) {
        if (purchaseReturnDetailRepository.existsByPurchaseReturnIdAndItemIdAndLocationId(purchaseReturn.getId(), item.getId(), location.getId())) {
            return;
        }

        purchaseReturnDetailRepository.save(new PurchaseReturnDetail(purchaseReturn, item, location, returnQuantity));

        Inventory inventory = inventoryRepository.findByItemIdAndLocationId(item.getId(), location.getId())
                .orElseThrow();

        Integer beforeQuantity = inventory.getQuantity();
        inventory.decreaseQuantity(returnQuantity);

        inventoryHistoryRepository.save(new InventoryHistory(
                account,
                item,
                location,
                "RETURN_OUTBOUND",
                returnQuantity,
                beforeQuantity,
                inventory.getQuantity(),
                "Purchase return outbound confirmed: " + purchaseReturn.getPurchaseReturnNo()
        ));
    }

    private void saveSalesReturnDetailAndIncreaseInventory(
            Account account,
            SalesReturn salesReturn,
            Item item,
            Location location,
            Integer returnQuantity
    ) {
        if (salesReturnDetailRepository.existsBySalesReturnIdAndItemIdAndLocationId(salesReturn.getId(), item.getId(), location.getId())) {
            return;
        }

        salesReturnDetailRepository.save(new SalesReturnDetail(salesReturn, item, location, returnQuantity));

        Inventory inventory = inventoryRepository.findByItemIdAndLocationId(item.getId(), location.getId())
                .orElseGet(() -> inventoryRepository.save(new Inventory(account, item, location, 0, 0)));

        Integer beforeQuantity = inventory.getQuantity();
        inventory.increaseQuantity(returnQuantity);

        inventoryHistoryRepository.save(new InventoryHistory(
                account,
                item,
                location,
                "RETURN_INBOUND",
                returnQuantity,
                beforeQuantity,
                inventory.getQuantity(),
                "Sales return inbound confirmed: " + salesReturn.getSalesReturnNo()
        ));
    }
}
