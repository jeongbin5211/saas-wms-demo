package com.wms.wms_backend.domain.shipping.service;

import com.wms.wms_backend.domain.billing.entity.Bill;
import com.wms.wms_backend.domain.billing.entity.BillDetail;
import com.wms.wms_backend.domain.billing.repository.BillDetailRepository;
import com.wms.wms_backend.domain.billing.repository.BillRepository;
import com.wms.wms_backend.domain.sales.entity.SalesOrder;
import com.wms.wms_backend.domain.sales.entity.SalesOrderDetail;
import com.wms.wms_backend.domain.sales.repository.SalesOrderDetailRepository;
import com.wms.wms_backend.domain.shipping.entity.Shipping;
import com.wms.wms_backend.domain.shipping.entity.ShippingDetail;
import com.wms.wms_backend.domain.shipping.repository.ShippingDetailRepository;
import com.wms.wms_backend.domain.shipping.repository.ShippingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ShippingProcessService {

    private final BillDetailRepository billDetailRepository;
    private final BillRepository billRepository;
    private final SalesOrderDetailRepository salesOrderDetailRepository;
    private final ShippingDetailRepository shippingDetailRepository;
    private final ShippingRepository shippingRepository;

    @Transactional
    public ShippingConfirmResult confirmShipping(Long shippingId) {
        Shipping shipping = shippingRepository.findById(shippingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "출고 정보를 찾을 수 없습니다."));

        SalesOrder salesOrder = shipping.getSalesOrder();
        shipping.confirm();
        salesOrder.completeShipping();

        Bill bill = billRepository.findBySalesOrderId(salesOrder.getId())
                .orElseGet(() -> createBillFromShipping(shipping));

        salesOrder.completeBilling();

        return new ShippingConfirmResult(
                shipping.getId(),
                shipping.getShippingNo(),
                shipping.getShippingStatusSubCode(),
                bill.getId(),
                bill.getBillNo(),
                bill.getBillStatusSubCode(),
                bill.getTotalAmount()
        );
    }

    private Bill createBillFromShipping(Shipping shipping) {
        List<ShippingDetail> shippingDetails = shippingDetailRepository.findAllByShippingIdOrderByIdAsc(shipping.getId());

        if (shippingDetails.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "출고 상세가 없어 청구서를 생성할 수 없습니다.");
        }

        SalesOrder salesOrder = shipping.getSalesOrder();
        Map<Long, BigDecimal> unitPrices = getUnitPrices(salesOrder.getId());
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (ShippingDetail detail : shippingDetails) {
            BigDecimal unitPrice = unitPrices.get(detail.getItem().getId());

            if (unitPrice == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "판매주문 상세에 없는 품목은 청구할 수 없습니다.");
            }

            totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(detail.getShippedQuantity())));
        }

        Bill bill = billRepository.save(new Bill(
                shipping.getAccount(),
                salesOrder,
                "BILL-" + shipping.getShippingNo(),
                LocalDate.now(),
                totalAmount
        ));

        for (ShippingDetail detail : shippingDetails) {
            BigDecimal unitPrice = unitPrices.get(detail.getItem().getId());
            billDetailRepository.save(new BillDetail(bill, detail.getItem(), detail.getShippedQuantity(), unitPrice));
        }

        return bill;
    }

    private Map<Long, BigDecimal> getUnitPrices(Long salesOrderId) {
        List<SalesOrderDetail> salesOrderDetails = salesOrderDetailRepository.findAllBySalesOrderIdOrderByIdAsc(salesOrderId);
        Map<Long, BigDecimal> unitPrices = new HashMap<>();

        for (SalesOrderDetail detail : salesOrderDetails) {
            unitPrices.put(detail.getItem().getId(), detail.getUnitPrice());
        }

        return unitPrices;
    }

    public record ShippingConfirmResult(
            Long shippingId,
            String shippingNo,
            String shippingStatusSubCode,
            Long billId,
            String billNo,
            String billStatusSubCode,
            BigDecimal totalAmount
    ) {
    }
}
