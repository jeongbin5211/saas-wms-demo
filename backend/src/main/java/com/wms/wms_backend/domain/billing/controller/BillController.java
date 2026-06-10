package com.wms.wms_backend.domain.billing.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.billing.entity.Bill;
import com.wms.wms_backend.domain.billing.entity.BillDetail;
import com.wms.wms_backend.domain.billing.repository.BillDetailRepository;
import com.wms.wms_backend.domain.billing.repository.BillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class BillController {

    private final BillRepository billRepository;
    private final BillDetailRepository billDetailRepository;

    @GetMapping("/api/bills")
    public List<BillResponse> findBills() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return billRepository.findAllByTopAccountId(topAccountId).stream()
                .map(BillResponse::from)
                .toList();
    }

    @GetMapping("/api/bill-details")
    public List<BillDetailResponse> findBillDetails() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return billDetailRepository.findAllByTopAccountId(topAccountId).stream()
                .map(BillDetailResponse::from)
                .toList();
    }

    public record BillResponse(
            Long id,
            Long accountId,
            Long salesOrderId,
            String salesOrderNo,
            String billNo,
            String billStatusSubCode,
            LocalDate billDate,
            BigDecimal totalAmount,
            String createdAt,
            String updatedAt
    ) {
        public static BillResponse from(Bill bill) {
            return new BillResponse(
                    bill.getId(),
                    bill.getAccount().getId(),
                    bill.getSalesOrder().getId(),
                    bill.getSalesOrder().getSalesOrderNo(),
                    bill.getBillNo(),
                    bill.getBillStatusSubCode(),
                    bill.getBillDate(),
                    bill.getTotalAmount(),
                    String.valueOf(bill.getCreatedAt()),
                    String.valueOf(bill.getUpdatedAt())
            );
        }
    }

    public record BillDetailResponse(
            Long id,
            Long billId,
            String billNo,
            Long itemId,
            String itemCode,
            String itemName,
            Integer billQuantity,
            BigDecimal unitPrice,
            BigDecimal amount,
            String createdAt,
            String updatedAt
    ) {
        public static BillDetailResponse from(BillDetail detail) {
            return new BillDetailResponse(
                    detail.getId(),
                    detail.getBill().getId(),
                    detail.getBill().getBillNo(),
                    detail.getItem().getId(),
                    detail.getItem().getItemCode(),
                    detail.getItem().getItemName(),
                    detail.getBillQuantity(),
                    detail.getUnitPrice(),
                    detail.getAmount(),
                    String.valueOf(detail.getCreatedAt()),
                    String.valueOf(detail.getUpdatedAt())
            );
        }
    }
}
