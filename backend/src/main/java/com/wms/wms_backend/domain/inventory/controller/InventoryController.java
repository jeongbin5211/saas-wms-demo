package com.wms.wms_backend.domain.inventory.controller;

import com.wms.wms_backend.domain.inventory.entity.Inventory;
import com.wms.wms_backend.domain.inventory.entity.InventoryHistory;
import com.wms.wms_backend.domain.inventory.repository.InventoryHistoryRepository;
import com.wms.wms_backend.domain.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;

    @GetMapping("/api/inventories")
    public List<InventoryResponse> findInventories() {
        List<Inventory> inventories = inventoryRepository.findAllByUseYnOrderByIdAsc("Y");
        List<InventoryResponse> responses = new ArrayList<>();

        for (Inventory inventory : inventories) {
            responses.add(InventoryResponse.from(inventory));
        }

        return responses;
    }

    @GetMapping("/api/inventory-histories")
    public List<InventoryHistoryResponse> findInventoryHistories() {
        List<InventoryHistory> histories = inventoryHistoryRepository.findAllByOrderByIdAsc();
        List<InventoryHistoryResponse> responses = new ArrayList<>();

        for (InventoryHistory history : histories) {
            responses.add(InventoryHistoryResponse.from(history));
        }

        return responses;
    }

    public record InventoryResponse(
            Long id,
            Long accountId,
            Long itemId,
            String itemCode,
            String itemName,
            Long locationId,
            String locationCode,
            String locationName,
            Integer quantity,
            Integer allocatedQuantity,
            Integer availableQuantity,
            String useYn
    ) {
        public static InventoryResponse from(Inventory inventory) {
            return new InventoryResponse(
                    inventory.getId(),
                    inventory.getAccount().getId(),
                    inventory.getItem().getId(),
                    inventory.getItem().getItemCode(),
                    inventory.getItem().getItemName(),
                    inventory.getLocation().getId(),
                    inventory.getLocation().getLocationCode(),
                    inventory.getLocation().getLocationName(),
                    inventory.getQuantity(),
                    inventory.getAllocatedQuantity(),
                    inventory.getAvailableQuantity(),
                    inventory.getUseYn()
            );
        }
    }

    public record InventoryHistoryResponse(
            Long id,
            Long accountId,
            Long itemId,
            String itemCode,
            String itemName,
            Long locationId,
            String locationCode,
            String locationName,
            String historyTypeSubCode,
            Integer quantity,
            Integer beforeQuantity,
            Integer afterQuantity,
            String reason
    ) {
        public static InventoryHistoryResponse from(InventoryHistory history) {
            return new InventoryHistoryResponse(
                    history.getId(),
                    history.getAccount().getId(),
                    history.getItem().getId(),
                    history.getItem().getItemCode(),
                    history.getItem().getItemName(),
                    history.getLocation().getId(),
                    history.getLocation().getLocationCode(),
                    history.getLocation().getLocationName(),
                    history.getHistoryTypeSubCode(),
                    history.getQuantity(),
                    history.getBeforeQuantity(),
                    history.getAfterQuantity(),
                    history.getReason()
            );
        }
    }
}
