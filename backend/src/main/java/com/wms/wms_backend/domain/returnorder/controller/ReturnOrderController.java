package com.wms.wms_backend.domain.returnorder.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturn;
import com.wms.wms_backend.domain.returnorder.entity.PurchaseReturnDetail;
import com.wms.wms_backend.domain.returnorder.entity.SalesReturn;
import com.wms.wms_backend.domain.returnorder.entity.SalesReturnDetail;
import com.wms.wms_backend.domain.returnorder.repository.PurchaseReturnDetailRepository;
import com.wms.wms_backend.domain.returnorder.repository.PurchaseReturnRepository;
import com.wms.wms_backend.domain.returnorder.repository.SalesReturnDetailRepository;
import com.wms.wms_backend.domain.returnorder.repository.SalesReturnRepository;
import com.wms.wms_backend.domain.returnorder.service.ReturnProcessService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ReturnOrderController {

    private final PurchaseReturnRepository purchaseReturnRepository;
    private final PurchaseReturnDetailRepository purchaseReturnDetailRepository;
    private final SalesReturnRepository salesReturnRepository;
    private final SalesReturnDetailRepository salesReturnDetailRepository;
    private final ReturnProcessService returnProcessService;

    @PostMapping("/api/purchase-returns/{id}/confirm")
    public ReturnProcessService.ReturnConfirmResult confirmPurchaseReturn(@PathVariable Long id) {
        return returnProcessService.confirmPurchaseReturn(id);
    }

    @PostMapping("/api/sales-returns/{id}/confirm")
    public ReturnProcessService.ReturnConfirmResult confirmSalesReturn(@PathVariable Long id) {
        return returnProcessService.confirmSalesReturn(id);
    }

    @GetMapping("/api/purchase-returns")
    public List<PurchaseReturnResponse> findPurchaseReturns() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return purchaseReturnRepository.findAllByTopAccountId(topAccountId).stream()
                .map(PurchaseReturnResponse::from)
                .toList();
    }

    @GetMapping("/api/purchase-return-details")
    public List<PurchaseReturnDetailResponse> findPurchaseReturnDetails() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return purchaseReturnDetailRepository.findAllByTopAccountId(topAccountId).stream()
                .map(PurchaseReturnDetailResponse::from)
                .toList();
    }

    @GetMapping("/api/sales-returns")
    public List<SalesReturnResponse> findSalesReturns() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return salesReturnRepository.findAllByTopAccountId(topAccountId).stream()
                .map(SalesReturnResponse::from)
                .toList();
    }

    @GetMapping("/api/sales-return-details")
    public List<SalesReturnDetailResponse> findSalesReturnDetails() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return salesReturnDetailRepository.findAllByTopAccountId(topAccountId).stream()
                .map(SalesReturnDetailResponse::from)
                .toList();
    }

    public record PurchaseReturnResponse(
            Long id,
            Long accountId,
            Long purchaseOrderId,
            String purchaseOrderNo,
            String purchaseReturnNo,
            String returnStatusSubCode,
            LocalDate returnDate,
            String reason
    ) {
        public static PurchaseReturnResponse from(PurchaseReturn purchaseReturn) {
            return new PurchaseReturnResponse(
                    purchaseReturn.getId(),
                    purchaseReturn.getAccount().getId(),
                    purchaseReturn.getPurchaseOrder().getId(),
                    purchaseReturn.getPurchaseOrder().getPurchaseOrderNo(),
                    purchaseReturn.getPurchaseReturnNo(),
                    purchaseReturn.getReturnStatusSubCode(),
                    purchaseReturn.getReturnDate(),
                    purchaseReturn.getReason()
            );
        }
    }

    public record PurchaseReturnDetailResponse(
            Long id,
            Long purchaseReturnId,
            String purchaseReturnNo,
            Long itemId,
            String itemCode,
            String itemName,
            Long locationId,
            String locationCode,
            Integer returnQuantity
    ) {
        public static PurchaseReturnDetailResponse from(PurchaseReturnDetail detail) {
            return new PurchaseReturnDetailResponse(
                    detail.getId(),
                    detail.getPurchaseReturn().getId(),
                    detail.getPurchaseReturn().getPurchaseReturnNo(),
                    detail.getItem().getId(),
                    detail.getItem().getItemCode(),
                    detail.getItem().getItemName(),
                    detail.getLocation().getId(),
                    detail.getLocation().getLocationCode(),
                    detail.getReturnQuantity()
            );
        }
    }

    public record SalesReturnResponse(
            Long id,
            Long accountId,
            Long salesOrderId,
            String salesOrderNo,
            String salesReturnNo,
            String returnStatusSubCode,
            LocalDate returnDate,
            String reason
    ) {
        public static SalesReturnResponse from(SalesReturn salesReturn) {
            return new SalesReturnResponse(
                    salesReturn.getId(),
                    salesReturn.getAccount().getId(),
                    salesReturn.getSalesOrder().getId(),
                    salesReturn.getSalesOrder().getSalesOrderNo(),
                    salesReturn.getSalesReturnNo(),
                    salesReturn.getReturnStatusSubCode(),
                    salesReturn.getReturnDate(),
                    salesReturn.getReason()
            );
        }
    }

    public record SalesReturnDetailResponse(
            Long id,
            Long salesReturnId,
            String salesReturnNo,
            Long itemId,
            String itemCode,
            String itemName,
            Long locationId,
            String locationCode,
            Integer returnQuantity
    ) {
        public static SalesReturnDetailResponse from(SalesReturnDetail detail) {
            return new SalesReturnDetailResponse(
                    detail.getId(),
                    detail.getSalesReturn().getId(),
                    detail.getSalesReturn().getSalesReturnNo(),
                    detail.getItem().getId(),
                    detail.getItem().getItemCode(),
                    detail.getItem().getItemName(),
                    detail.getLocation().getId(),
                    detail.getLocation().getLocationCode(),
                    detail.getReturnQuantity()
            );
        }
    }
}
