package com.wms.wms_backend.domain.returnorder.service;

import com.wms.wms_backend.domain.inventory.entity.Inventory;
import com.wms.wms_backend.domain.inventory.entity.InventoryHistory;
import com.wms.wms_backend.domain.inventory.repository.InventoryHistoryRepository;
import com.wms.wms_backend.domain.inventory.repository.InventoryRepository;
import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturn;
import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturnDetail;
import com.wms.wms_backend.domain.returnorder.entity.SalesReturn;
import com.wms.wms_backend.domain.returnorder.entity.SalesReturnDetail;
import com.wms.wms_backend.domain.returnorder.repository.PurchaseReturnDetailRepository;
import com.wms.wms_backend.domain.returnorder.repository.PurchaseReturnRepository;
import com.wms.wms_backend.domain.returnorder.repository.SalesReturnDetailRepository;
import com.wms.wms_backend.domain.returnorder.repository.SalesReturnRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ReturnProcessService {

    private final InventoryRepository inventoryRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;
    private final PurchaseReturnRepository purchaseReturnRepository;
    private final PurchaseReturnDetailRepository purchaseReturnDetailRepository;
    private final SalesReturnRepository salesReturnRepository;
    private final SalesReturnDetailRepository salesReturnDetailRepository;

    @Transactional
    public ReturnConfirmResult confirmPurchaseReturn(Long purchaseReturnId) {
        PurchaseReturn purchaseReturn = purchaseReturnRepository.findById(purchaseReturnId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "구매반품 정보를 찾을 수 없습니다."));

        if ("SHIPPED".equals(purchaseReturn.getReturnStatusSubCode())) {
            return new ReturnConfirmResult(purchaseReturn.getId(), purchaseReturn.getPurchaseReturnNo(), purchaseReturn.getReturnStatusSubCode(), 0);
        }

        List<PurchaseReturnDetail> details = purchaseReturnDetailRepository.findAllByPurchaseReturnIdOrderByIdAsc(purchaseReturnId);
        if (details.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "반품 상세가 없어 확정할 수 없습니다.");
        }

        int totalQuantity = 0;
        for (PurchaseReturnDetail detail : details) {
            Inventory inventory = inventoryRepository.findByItemIdAndLocationId(
                            detail.getItem().getId(), detail.getLocation().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "반품 대상 재고를 찾을 수 없습니다."));

            int beforeQuantity = inventory.getQuantity();
            inventory.decreaseQuantity(detail.getReturnQuantity());
            totalQuantity += detail.getReturnQuantity();

            inventoryHistoryRepository.save(new InventoryHistory(
                    purchaseReturn.getAccount(),
                    detail.getItem(),
                    detail.getLocation(),
                    "RETURN_OUTBOUND",
                    detail.getReturnQuantity(),
                    beforeQuantity,
                    inventory.getQuantity(),
                    "Purchase return confirmed: " + purchaseReturn.getPurchaseReturnNo()
            ));
        }

        purchaseReturn.completeReturnOutbound();

        return new ReturnConfirmResult(purchaseReturn.getId(), purchaseReturn.getPurchaseReturnNo(), purchaseReturn.getReturnStatusSubCode(), totalQuantity);
    }

    @Transactional
    public ReturnConfirmResult confirmSalesReturn(Long salesReturnId) {
        SalesReturn salesReturn = salesReturnRepository.findById(salesReturnId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "판매반품 정보를 찾을 수 없습니다."));

        if ("RECEIVED".equals(salesReturn.getReturnStatusSubCode())) {
            return new ReturnConfirmResult(salesReturn.getId(), salesReturn.getSalesReturnNo(), salesReturn.getReturnStatusSubCode(), 0);
        }

        List<SalesReturnDetail> details = salesReturnDetailRepository.findAllBySalesReturnIdOrderByIdAsc(salesReturnId);
        if (details.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "반품 상세가 없어 확정할 수 없습니다.");
        }

        int totalQuantity = 0;
        for (SalesReturnDetail detail : details) {
            Inventory inventory = inventoryRepository.findByItemIdAndLocationId(
                            detail.getItem().getId(), detail.getLocation().getId())
                    .orElseGet(() -> inventoryRepository.save(new Inventory(
                            salesReturn.getAccount(), detail.getItem(), detail.getLocation(), 0, 0)));

            int beforeQuantity = inventory.getQuantity();
            inventory.increaseQuantity(detail.getReturnQuantity());
            totalQuantity += detail.getReturnQuantity();

            inventoryHistoryRepository.save(new InventoryHistory(
                    salesReturn.getAccount(),
                    detail.getItem(),
                    detail.getLocation(),
                    "RETURN_INBOUND",
                    detail.getReturnQuantity(),
                    beforeQuantity,
                    inventory.getQuantity(),
                    "Sales return confirmed: " + salesReturn.getSalesReturnNo()
            ));
        }

        salesReturn.completeReturnInbound();

        return new ReturnConfirmResult(salesReturn.getId(), salesReturn.getSalesReturnNo(), salesReturn.getReturnStatusSubCode(), totalQuantity);
    }

    public record ReturnConfirmResult(
            Long returnId,
            String returnNo,
            String returnStatusSubCode,
            Integer totalQuantity
    ) {}
}
