package com.wms.wms_backend.domain.inventory.controller;

import com.wms.wms_backend.domain.inventory.entity.Inventory;
import com.wms.wms_backend.domain.inventory.entity.InventoryHistory;
import com.wms.wms_backend.domain.inventory.repository.InventoryHistoryRepository;
import com.wms.wms_backend.domain.inventory.repository.InventoryRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class InventoryController {

    private final InventoryRepository inventoryRepository;
    private final InventoryHistoryRepository inventoryHistoryRepository;

    @GetMapping("/api/inventories")
    public List<InventoryResponse> findInventories(
            @RequestParam(required = false) String itemCode,
            @RequestParam(required = false) String itemName,
            @RequestParam(required = false) String locationCode
    ) {
        return inventoryRepository.findAllByUseYnOrderByIdAsc("Y").stream()
                .filter(i -> itemCode == null || i.getItem().getItemCode().contains(itemCode))
                .filter(i -> itemName == null || i.getItem().getItemName().contains(itemName))
                .filter(i -> locationCode == null || i.getLocation().getLocationCode().contains(locationCode))
                .map(InventoryResponse::from)
                .toList();
    }

    @GetMapping("/api/inventory-histories")
    public List<InventoryHistoryResponse> findInventoryHistories(
            @RequestParam(required = false) String itemCode,
            @RequestParam(required = false) String historyTypeSubCode
    ) {
        return inventoryHistoryRepository.findAllByOrderByIdAsc().stream()
                .filter(h -> itemCode == null || h.getItem().getItemCode().contains(itemCode))
                .filter(h -> historyTypeSubCode == null || h.getHistoryTypeSubCode().equals(historyTypeSubCode))
                .map(InventoryHistoryResponse::from)
                .toList();
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

    @PostMapping("/api/inventories/{id}/adjust")
    @Transactional
    public InventoryResponse adjustInventory(@PathVariable Long id, @Valid @RequestBody AdjustRequest request) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "재고 정보를 찾을 수 없습니다."));

        int beforeQuantity = inventory.getQuantity();
        int delta = request.adjustedQuantity() - beforeQuantity;

        if (delta > 0) {
            inventory.increaseQuantity(delta);
        } else if (delta < 0) {
            inventory.decreaseQuantity(-delta);
        }

        inventoryHistoryRepository.save(new InventoryHistory(
                inventory.getAccount(),
                inventory.getItem(),
                inventory.getLocation(),
                "ADJUSTMENT",
                Math.abs(delta),
                beforeQuantity,
                inventory.getQuantity(),
                request.reason()
        ));

        return InventoryResponse.from(inventory);
    }

    public record AdjustRequest(
            @PositiveOrZero Integer adjustedQuantity,
            @NotBlank String reason
    ) {}

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
