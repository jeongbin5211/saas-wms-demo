package com.wms.wms_backend.domain.item.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.item.entity.Item;
import com.wms.wms_backend.domain.item.entity.ItemClass;
import com.wms.wms_backend.domain.item.entity.ItemMaster;
import com.wms.wms_backend.domain.item.repository.ItemClassRepository;
import com.wms.wms_backend.domain.item.repository.ItemMasterRepository;
import com.wms.wms_backend.domain.item.repository.ItemRepository;
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
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class ItemController {

    private final ItemMasterRepository itemMasterRepository;
    private final ItemClassRepository itemClassRepository;
    private final ItemRepository itemRepository;
    private final AccountRepository accountRepository;

    // ===== 품목 마스터 =====

    @GetMapping("/api/item-masters")
    public List<ItemMasterResponse> findItemMasters(
            @RequestParam(required = false) String itemMasterCode,
            @RequestParam(required = false) String itemMasterName,
            @RequestParam(required = false) String useYn
    ) {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        String effectiveUseYn = hasText(useYn) ? useYn : "Y";
        List<ItemMasterResponse> responses = new ArrayList<>();

        for (ItemMaster itemMaster : itemMasterRepository.findAllByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, effectiveUseYn)) {
            if (!contains(itemMaster.getItemMasterCode(), itemMasterCode)) {
                continue;
            }
            if (!contains(itemMaster.getItemMasterName(), itemMasterName)) {
                continue;
            }
            responses.add(ItemMasterResponse.from(itemMaster));
        }

        return responses;
    }

    @PostMapping("/api/item-masters")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ItemMasterResponse createItemMaster(@Valid @RequestBody ItemMasterSaveRequest request) {
        requireEditableRole();

        if (itemMasterRepository.existsByItemMasterCode(request.itemMasterCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 품목 마스터 코드입니다.");
        }

        Account account = currentAccount();
        ItemMaster itemMaster = itemMasterRepository.save(new ItemMaster(
                account,
                SecurityUtil.currentTopAccountId(),
                request.itemMasterCode(),
                request.itemMasterName()
        ));
        itemMaster.update(request.itemMasterName(), request.useYn());

        return ItemMasterResponse.from(itemMaster);
    }

    @PutMapping("/api/item-masters/{id}")
    @Transactional
    public ItemMasterResponse updateItemMaster(@PathVariable Long id, @Valid @RequestBody ItemMasterSaveRequest request) {
        requireEditableRole();

        ItemMaster itemMaster = itemMasterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 마스터를 찾을 수 없습니다."));
        itemMaster.update(request.itemMasterName(), request.useYn());

        return ItemMasterResponse.from(itemMaster);
    }

    @DeleteMapping("/api/item-masters/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteItemMaster(@PathVariable Long id) {
        requireEditableRole();

        itemMasterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 마스터를 찾을 수 없습니다."))
                .deactivate();
    }

    // ===== 품목 클래스 =====

    @GetMapping("/api/item-classes")
    public List<ItemClassResponse> findItemClasses(
            @RequestParam(required = false) String itemClassCode,
            @RequestParam(required = false) String itemClassName,
            @RequestParam(required = false) String itemMasterCode,
            @RequestParam(required = false) String itemMasterName,
            @RequestParam(required = false) String useYn
    ) {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<ItemClass> itemClasses = hasText(useYn)
                ? itemClassRepository.findAllByTopAccountIdAndUseYn(topAccountId, useYn)
                : itemClassRepository.findAllByTopAccountId(topAccountId);
        List<ItemClassResponse> responses = new ArrayList<>();

        for (ItemClass itemClass : itemClasses) {
            if (!contains(itemClass.getItemClassCode(), itemClassCode)) {
                continue;
            }
            if (!contains(itemClass.getItemClassName(), itemClassName)) {
                continue;
            }
            if (!contains(itemClass.getItemMaster().getItemMasterCode(), itemMasterCode)) {
                continue;
            }
            if (!contains(itemClass.getItemMaster().getItemMasterName(), itemMasterName)) {
                continue;
            }
            responses.add(ItemClassResponse.from(itemClass));
        }

        return responses;
    }

    @PostMapping("/api/item-classes")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ItemClassResponse createItemClass(@Valid @RequestBody ItemClassSaveRequest request) {
        requireEditableRole();

        if (itemClassRepository.existsByItemClassCode(request.itemClassCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 품목 클래스 코드입니다.");
        }

        ItemMaster itemMaster = findItemMaster(request.itemMasterId());
        ItemClass itemClass = itemClassRepository.save(new ItemClass(
                itemMaster.getAccount(),
                itemMaster,
                request.itemClassCode(),
                request.itemClassName()
        ));
        itemClass.update(itemMaster, request.itemClassName(), request.useYn());

        return ItemClassResponse.from(itemClass);
    }

    @PutMapping("/api/item-classes/{id}")
    @Transactional
    public ItemClassResponse updateItemClass(@PathVariable Long id, @Valid @RequestBody ItemClassSaveRequest request) {
        requireEditableRole();

        ItemClass itemClass = itemClassRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 클래스를 찾을 수 없습니다."));
        ItemMaster itemMaster = findItemMaster(request.itemMasterId());
        itemClass.update(itemMaster, request.itemClassName(), request.useYn());

        return ItemClassResponse.from(itemClass);
    }

    @DeleteMapping("/api/item-classes/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteItemClass(@PathVariable Long id) {
        requireEditableRole();

        itemClassRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 클래스를 찾을 수 없습니다."))
                .deactivate();
    }

    // ===== 품목 =====

    @GetMapping("/api/items")
    public List<ItemResponse> findItems(
            @RequestParam(required = false) String itemCode,
            @RequestParam(required = false) String itemName,
            @RequestParam(required = false) String itemClassCode,
            @RequestParam(required = false) String itemClassName,
            @RequestParam(required = false) String useYn
    ) {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<Item> items = hasText(useYn)
                ? itemRepository.findAllByTopAccountIdAndUseYn(topAccountId, useYn)
                : itemRepository.findAllByTopAccountId(topAccountId);
        List<ItemResponse> responses = new ArrayList<>();

        for (Item item : items) {
            if (!contains(item.getItemCode(), itemCode)) {
                continue;
            }
            if (!contains(item.getItemName(), itemName)) {
                continue;
            }
            if (!contains(item.getItemClass().getItemClassCode(), itemClassCode)) {
                continue;
            }
            if (!contains(item.getItemClass().getItemClassName(), itemClassName)) {
                continue;
            }
            responses.add(ItemResponse.from(item));
        }

        return responses;
    }

    @PostMapping("/api/items")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ItemResponse createItem(@Valid @RequestBody ItemCreateRequest request) {
        requireEditableRole();

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
        requireEditableRole();

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
                request.salesPrice(),
                request.useYn()
        );

        return ItemResponse.from(item);
    }

    @DeleteMapping("/api/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteItem(@PathVariable Long id) {
        requireEditableRole();

        itemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 정보를 찾을 수 없습니다."))
                .deactivate();
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

    // ===== 헬퍼 =====

    private ItemMaster findItemMaster(Long id) {
        return itemMasterRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "품목 마스터를 찾을 수 없습니다."));
    }

    private Account currentAccount() {
        return accountRepository.findById(SecurityUtil.currentAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "거래처 정보를 찾을 수 없습니다."));
    }

    private void requireEditableRole() {
        String role = SecurityUtil.currentClaims().get("role", String.class);

        if (!"ADMIN".equals(role) && !"STAFF".equals(role) && !"GUEST".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "기준정보를 변경할 권한이 없습니다.");
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    private boolean contains(String source, String keyword) {
        if (!hasText(keyword)) {
            return true;
        }
        return source != null && source.toLowerCase().contains(keyword.toLowerCase());
    }

    // ===== 응답/요청 =====

    public record ItemMasterResponse(
            Long id,
            Long accountId,
            Long topAccountId,
            String itemMasterCode,
            String itemMasterName,
            String useYn,
            String createdAt,
            String updatedAt
    ) {
        public static ItemMasterResponse from(ItemMaster itemMaster) {
            return new ItemMasterResponse(
                    itemMaster.getId(),
                    itemMaster.getAccount().getId(),
                    itemMaster.getTopAccountId(),
                    itemMaster.getItemMasterCode(),
                    itemMaster.getItemMasterName(),
                    itemMaster.getUseYn(),
                    String.valueOf(itemMaster.getCreatedAt()),
                    String.valueOf(itemMaster.getUpdatedAt())
            );
        }
    }

    public record ItemClassResponse(
            Long id,
            Long itemMasterId,
            String itemMasterCode,
            String itemMasterName,
            String itemClassCode,
            String itemClassName,
            String useYn,
            String createdAt,
            String updatedAt
    ) {
        public static ItemClassResponse from(ItemClass itemClass) {
            ItemMaster itemMaster = itemClass.getItemMaster();
            return new ItemClassResponse(
                    itemClass.getId(),
                    itemMaster.getId(),
                    itemMaster.getItemMasterCode(),
                    itemMaster.getItemMasterName(),
                    itemClass.getItemClassCode(),
                    itemClass.getItemClassName(),
                    itemClass.getUseYn(),
                    String.valueOf(itemClass.getCreatedAt()),
                    String.valueOf(itemClass.getUpdatedAt())
            );
        }
    }

    public record ItemResponse(
            Long id,
            Long itemClassId,
            String itemClassCode,
            String itemClassName,
            String itemMasterName,
            String itemCode,
            String itemName,
            String barcode,
            String unit,
            BigDecimal purchasePrice,
            BigDecimal salesPrice,
            String useYn,
            String createdAt,
            String updatedAt
    ) {
        public static ItemResponse from(Item item) {
            ItemClass itemClass = item.getItemClass();
            return new ItemResponse(
                    item.getId(),
                    itemClass.getId(),
                    itemClass.getItemClassCode(),
                    itemClass.getItemClassName(),
                    itemClass.getItemMaster().getItemMasterName(),
                    item.getItemCode(),
                    item.getItemName(),
                    item.getBarcode(),
                    item.getUnit(),
                    item.getPurchasePrice(),
                    item.getSalesPrice(),
                    item.getUseYn(),
                    String.valueOf(item.getCreatedAt()),
                    String.valueOf(item.getUpdatedAt())
            );
        }
    }

    public record ItemMasterSaveRequest(
            @NotBlank String itemMasterCode,
            @NotBlank String itemMasterName,
            String useYn
    ) {
    }

    public record ItemClassSaveRequest(
            @NotNull Long itemMasterId,
            @NotBlank String itemClassCode,
            @NotBlank String itemClassName,
            String useYn
    ) {
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
            @NotNull @PositiveOrZero BigDecimal salesPrice,
            String useYn
    ) {
    }

    public record ItemCatalogResponse(
            List<ItemMasterResponse> itemMasters,
            List<ItemClassResponse> itemClasses,
            List<ItemResponse> items
    ) {
    }
}
