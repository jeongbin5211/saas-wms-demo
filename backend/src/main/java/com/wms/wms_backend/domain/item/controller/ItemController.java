package com.wms.wms_backend.domain.item.controller;

import com.wms.wms_backend.domain.item.entity.Item;
import com.wms.wms_backend.domain.item.entity.ItemClass;
import com.wms.wms_backend.domain.item.entity.ItemMaster;
import com.wms.wms_backend.domain.item.repository.ItemClassRepository;
import com.wms.wms_backend.domain.item.repository.ItemMasterRepository;
import com.wms.wms_backend.domain.item.repository.ItemRepository;
import com.wms.wms_backend.common.security.SecurityUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ItemController {

    private final ItemMasterRepository itemMasterRepository;
    private final ItemClassRepository itemClassRepository;
    private final ItemRepository itemRepository;

    @GetMapping("/api/item-masters")
    public List<ItemMasterResponse> findItemMasters() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return itemMasterRepository.findAllByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y").stream()
                .map(ItemMasterResponse::from)
                .toList();
    }

    @GetMapping("/api/item-classes")
    public List<ItemClassResponse> findItemClasses() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return itemClassRepository.findAllByTopAccountId(topAccountId).stream()
                .map(ItemClassResponse::from)
                .toList();
    }

    @GetMapping("/api/items")
    public List<ItemResponse> findItems(
            @RequestParam(required = false) String itemCode,
            @RequestParam(required = false) String itemName
    ) {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        return itemRepository.findAllByTopAccountId(topAccountId).stream()
                .filter(item -> itemCode == null || item.getItemCode().contains(itemCode))
                .filter(item -> itemName == null || item.getItemName().contains(itemName))
                .map(ItemResponse::from)
                .toList();
    }

    @PostMapping("/api/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ItemResponse createItem(@Valid @RequestBody ItemCreateRequest request) {
        if (itemRepository.existsByItemCode(request.itemCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 품목 코드입니다.");
        }

        ItemClass itemClass = itemClassRepository.findById(request.itemClassId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 클래스를 찾을 수 없습니다."));

        Item item = itemRepository.save(new Item(
                itemClass.getAccount(),
                itemClass,
                request.itemCode(),
                request.itemName(),
                request.barcode(),
                request.unit(),
                request.purchasePrice(),
                request.salesPrice()
        ));

        return ItemResponse.from(item);
    }

    @PutMapping("/api/items/{id}")
    @Transactional
    public ItemResponse updateItem(@PathVariable Long id, @Valid @RequestBody ItemUpdateRequest request) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 정보를 찾을 수 없습니다."));

        if (itemRepository.existsByItemCodeAndIdNot(request.itemCode(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 품목 코드입니다.");
        }

        if (request.barcode() != null && !request.barcode().isBlank() && itemRepository.existsByBarcodeAndIdNot(request.barcode(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 바코드입니다.");
        }

        ItemClass itemClass = itemClassRepository.findById(request.itemClassId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 클래스를 찾을 수 없습니다."));

        item.update(
                itemClass,
                request.itemCode(),
                request.itemName(),
                request.barcode(),
                request.unit(),
                request.purchasePrice(),
                request.salesPrice()
        );

        return ItemResponse.from(item);
    }

    @DeleteMapping("/api/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteItem(@PathVariable Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 정보를 찾을 수 없습니다."));

        item.deactivate();
    }

    @GetMapping("/api/item-catalog")
    public ItemCatalogResponse findItemCatalog() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<ItemMasterResponse> itemMasters = itemMasterRepository.findAllByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y").stream()
                .map(ItemMasterResponse::from)
                .toList();
        List<ItemClassResponse> itemClasses = itemClassRepository.findAllByTopAccountId(topAccountId).stream()
                .map(ItemClassResponse::from)
                .toList();
        List<ItemResponse> items = itemRepository.findAllByTopAccountId(topAccountId).stream()
                .map(ItemResponse::from)
                .toList();

        return new ItemCatalogResponse(itemMasters, itemClasses, items);
    }

    public record ItemMasterResponse(
            Long id,
            Long accountId,
            Long topAccountId,
            String itemMasterCode,
            String itemMasterName,
            String useYn
    ) {
        public static ItemMasterResponse from(ItemMaster itemMaster) {
            return new ItemMasterResponse(
                    itemMaster.getId(),
                    itemMaster.getAccount().getId(),
                    itemMaster.getTopAccountId(),
                    itemMaster.getItemMasterCode(),
                    itemMaster.getItemMasterName(),
                    itemMaster.getUseYn()
            );
        }
    }

    public record ItemClassResponse(
            Long id,
            Long itemMasterId,
            String itemClassCode,
            String itemClassName,
            String useYn
    ) {
        public static ItemClassResponse from(ItemClass itemClass) {
            return new ItemClassResponse(
                    itemClass.getId(),
                    itemClass.getItemMaster().getId(),
                    itemClass.getItemClassCode(),
                    itemClass.getItemClassName(),
                    itemClass.getUseYn()
            );
        }
    }

    public record ItemResponse(
            Long id,
            Long itemClassId,
            String itemCode,
            String itemName,
            String barcode,
            String unit,
            BigDecimal purchasePrice,
            BigDecimal salesPrice,
            String useYn
    ) {
        public static ItemResponse from(Item item) {
            return new ItemResponse(
                    item.getId(),
                    item.getItemClass().getId(),
                    item.getItemCode(),
                    item.getItemName(),
                    item.getBarcode(),
                    item.getUnit(),
                    item.getPurchasePrice(),
                    item.getSalesPrice(),
                    item.getUseYn()
            );
        }
    }

    public record ItemCreateRequest(
            @NotNull Long itemClassId,
            @NotBlank String itemCode,
            @NotBlank String itemName,
            String barcode,
            @NotBlank String unit,
            @NotNull @PositiveOrZero BigDecimal purchasePrice,
            @NotNull @PositiveOrZero BigDecimal salesPrice
    ) {
    }

    public record ItemUpdateRequest(
            @NotNull Long itemClassId,
            @NotBlank String itemCode,
            @NotBlank String itemName,
            String barcode,
            @NotBlank String unit,
            @NotNull @PositiveOrZero BigDecimal purchasePrice,
            @NotNull @PositiveOrZero BigDecimal salesPrice
    ) {
    }

    public record ItemCatalogResponse(
            List<ItemMasterResponse> itemMasters,
            List<ItemClassResponse> itemClasses,
            List<ItemResponse> items
    ) {
    }
}
