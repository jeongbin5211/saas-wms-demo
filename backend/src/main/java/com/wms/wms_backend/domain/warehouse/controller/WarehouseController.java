package com.wms.wms_backend.domain.warehouse.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.warehouse.entity.Area;
import com.wms.wms_backend.domain.warehouse.entity.Location;
import com.wms.wms_backend.domain.warehouse.entity.Warehouse;
import com.wms.wms_backend.domain.warehouse.entity.Zone;
import com.wms.wms_backend.domain.warehouse.repository.AreaRepository;
import com.wms.wms_backend.domain.warehouse.repository.LocationRepository;
import com.wms.wms_backend.domain.warehouse.repository.WarehouseRepository;
import com.wms.wms_backend.domain.warehouse.repository.ZoneRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class WarehouseController {

    private final AccountRepository accountRepository;
    private final WarehouseRepository warehouseRepository;
    private final AreaRepository areaRepository;
    private final ZoneRepository zoneRepository;
    private final LocationRepository locationRepository;

    @GetMapping("/api/warehouses")
    public List<WarehouseResponse> findWarehouses() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<WarehouseResponse> responses = new ArrayList<>();

        for (Warehouse warehouse : warehouseRepository.findAllByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y")) {
            responses.add(WarehouseResponse.from(warehouse));
        }

        return responses;
    }

    @PostMapping("/api/warehouses")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public WarehouseResponse createWarehouse(@Valid @RequestBody WarehouseCreateRequest request) {
        requireEditableRole();

        if (warehouseRepository.existsByWarehouseCode(request.warehouseCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 창고 코드입니다.");
        }

        Account account = currentAccount();
        Warehouse warehouse = warehouseRepository.save(new Warehouse(
                account,
                account.getTopAccountId(),
                request.warehouseCode(),
                request.warehouseName(),
                request.warehouseTypeSubCode()
        ));
        warehouse.updateOptionalFields(request.addressName(), request.priority(), request.phoneNo(), request.faxNo(), request.useYn());

        return WarehouseResponse.from(warehouse);
    }

    @PutMapping("/api/warehouses/{id}")
    @Transactional
    public WarehouseResponse updateWarehouse(@PathVariable Long id, @Valid @RequestBody WarehouseUpdateRequest request) {
        requireEditableRole();

        Warehouse warehouse = findWarehouse(id);

        if (warehouseRepository.existsByWarehouseCodeAndIdNot(request.warehouseCode(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 창고 코드입니다.");
        }

        warehouse.update(
                request.warehouseCode(),
                request.warehouseName(),
                request.warehouseTypeSubCode(),
                request.addressName(),
                request.priority(),
                request.phoneNo(),
                request.faxNo(),
                request.useYn()
        );

        return WarehouseResponse.from(warehouse);
    }

    @DeleteMapping("/api/warehouses/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteWarehouse(@PathVariable Long id) {
        requireEditableRole();

        findWarehouse(id).deactivate();
    }

    @GetMapping("/api/areas")
    public List<AreaResponse> findAreas() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<AreaResponse> responses = new ArrayList<>();

        for (Area area : areaRepository.findAllByTopAccountId(topAccountId)) {
            responses.add(AreaResponse.from(area));
        }

        return responses;
    }

    @PostMapping("/api/areas")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public AreaResponse createArea(@Valid @RequestBody AreaCreateRequest request) {
        requireEditableRole();

        if (areaRepository.existsByAreaCode(request.areaCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 Area 코드입니다.");
        }

        Warehouse warehouse = findWarehouse(request.warehouseId());
        Area area = areaRepository.save(new Area(warehouse.getAccount(), warehouse, request.areaCode(), request.areaName()));
        area.updateOptionalFields(request.detailDescription(), request.priority());

        return AreaResponse.from(area);
    }

    @PutMapping("/api/areas/{id}")
    @Transactional
    public AreaResponse updateArea(@PathVariable Long id, @Valid @RequestBody AreaUpdateRequest request) {
        requireEditableRole();

        Area area = findArea(id);

        if (areaRepository.existsByAreaCodeAndIdNot(request.areaCode(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 Area 코드입니다.");
        }

        Warehouse warehouse = findWarehouse(request.warehouseId());
        area.update(warehouse, request.areaCode(), request.areaName(), request.detailDescription(), request.priority());

        return AreaResponse.from(area);
    }

    @DeleteMapping("/api/areas/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteArea(@PathVariable Long id) {
        requireEditableRole();

        findArea(id).deactivate();
    }

    @GetMapping("/api/zones")
    public List<ZoneResponse> findZones() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<ZoneResponse> responses = new ArrayList<>();

        for (Zone zone : zoneRepository.findAllByTopAccountId(topAccountId)) {
            responses.add(ZoneResponse.from(zone));
        }

        return responses;
    }

    @PostMapping("/api/zones")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public ZoneResponse createZone(@Valid @RequestBody ZoneCreateRequest request) {
        requireEditableRole();

        if (zoneRepository.existsByZoneCode(request.zoneCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 Zone 코드입니다.");
        }

        Area area = findArea(request.areaId());
        Zone zone = zoneRepository.save(new Zone(area.getAccount(), area, request.zoneCode(), request.zoneName()));
        zone.updateOptionalFields(request.detailDescription(), request.priority());

        return ZoneResponse.from(zone);
    }

    @PutMapping("/api/zones/{id}")
    @Transactional
    public ZoneResponse updateZone(@PathVariable Long id, @Valid @RequestBody ZoneUpdateRequest request) {
        requireEditableRole();

        Zone zone = findZone(id);

        if (zoneRepository.existsByZoneCodeAndIdNot(request.zoneCode(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 Zone 코드입니다.");
        }

        Area area = findArea(request.areaId());
        zone.update(area, request.zoneCode(), request.zoneName(), request.detailDescription(), request.priority());

        return ZoneResponse.from(zone);
    }

    @DeleteMapping("/api/zones/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteZone(@PathVariable Long id) {
        requireEditableRole();

        findZone(id).deactivate();
    }

    @GetMapping("/api/locations")
    public List<LocationResponse> findLocations() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<LocationResponse> responses = new ArrayList<>();

        for (Location location : locationRepository.findAllByTopAccountId(topAccountId)) {
            responses.add(LocationResponse.from(location));
        }

        return responses;
    }

    @GetMapping("/api/warehouse-locations")
    public WarehouseLocationResponse findWarehouseLocations() {
        Long topAccountId = SecurityUtil.currentTopAccountId();
        List<WarehouseResponse> warehouseResponses = new ArrayList<>();
        List<AreaResponse> areaResponses = new ArrayList<>();
        List<ZoneResponse> zoneResponses = new ArrayList<>();
        List<LocationResponse> locationResponses = new ArrayList<>();

        for (Warehouse warehouse : warehouseRepository.findAllByTopAccountIdAndUseYnOrderByIdAsc(topAccountId, "Y")) {
            warehouseResponses.add(WarehouseResponse.from(warehouse));
        }
        for (Area area : areaRepository.findAllByTopAccountId(topAccountId)) {
            areaResponses.add(AreaResponse.from(area));
        }
        for (Zone zone : zoneRepository.findAllByTopAccountId(topAccountId)) {
            zoneResponses.add(ZoneResponse.from(zone));
        }
        for (Location location : locationRepository.findAllByTopAccountId(topAccountId)) {
            locationResponses.add(LocationResponse.from(location));
        }

        return new WarehouseLocationResponse(warehouseResponses, areaResponses, zoneResponses, locationResponses);
    }

    @PostMapping("/api/locations")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public LocationResponse createLocation(@Valid @RequestBody LocationCreateRequest request) {
        requireEditableRole();

        if (locationRepository.existsByLocationCode(request.locationCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 Location 코드입니다.");
        }

        Zone zone = findZone(request.zoneId());
        Location location = locationRepository.save(new Location(
                zone.getAccount(),
                zone,
                request.locationCode(),
                request.locationName()
        ));
        location.updateOptionalFields(
                request.detailDescription(),
                request.locationTypeSubCode(),
                request.logicalTypeSubCode(),
                request.mixKey(),
                request.priority(),
                request.putawayPriority(),
                request.pickingPriority(),
                request.allocPriority()
        );

        return LocationResponse.from(location);
    }

    @PutMapping("/api/locations/{id}")
    @Transactional
    public LocationResponse updateLocation(@PathVariable Long id, @Valid @RequestBody LocationUpdateRequest request) {
        requireEditableRole();

        Location location = findLocation(id);

        if (locationRepository.existsByLocationCodeAndIdNot(request.locationCode(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 등록된 Location 코드입니다.");
        }

        Zone zone = findZone(request.zoneId());
        location.update(
                zone,
                request.locationCode(),
                request.locationName(),
                request.detailDescription(),
                request.locationTypeSubCode(),
                request.logicalTypeSubCode(),
                request.mixKey(),
                request.priority(),
                request.putawayPriority(),
                request.pickingPriority(),
                request.allocPriority()
        );

        return LocationResponse.from(location);
    }

    @DeleteMapping("/api/locations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Transactional
    public void deleteLocation(@PathVariable Long id) {
        requireEditableRole();

        findLocation(id).deactivate();
    }

    private void requireEditableRole() {
        String role = SecurityUtil.currentClaims().get("role", String.class);

        if (!"ADMIN".equals(role) && !"STAFF".equals(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "기준정보를 변경할 권한이 없습니다.");
        }
    }

    private Account currentAccount() {
        return accountRepository.findById(SecurityUtil.currentAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "거래처 정보를 찾을 수 없습니다."));
    }

    private Warehouse findWarehouse(Long id) {
        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "창고 정보를 찾을 수 없습니다."));
        validateTopAccount(warehouse.getTopAccountId());
        return warehouse;
    }

    private Area findArea(Long id) {
        Area area = areaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Area 정보를 찾을 수 없습니다."));
        validateTopAccount(area.getAccount().getTopAccountId());
        return area;
    }

    private Zone findZone(Long id) {
        Zone zone = zoneRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Zone 정보를 찾을 수 없습니다."));
        validateTopAccount(zone.getAccount().getTopAccountId());
        return zone;
    }

    private Location findLocation(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location 정보를 찾을 수 없습니다."));
        validateTopAccount(location.getAccount().getTopAccountId());
        return location;
    }

    private void validateTopAccount(Long topAccountId) {
        if (!SecurityUtil.currentTopAccountId().equals(topAccountId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "접근할 수 없는 위치정보입니다.");
        }
    }

    public record WarehouseResponse(
            Long id,
            Long accountId,
            String accountCode,
            String accountName,
            Long topAccountId,
            String warehouseCode,
            String warehouseName,
            String warehouseTypeSubCode,
            String addressName,
            Integer priority,
            String phoneNo,
            String faxNo,
            String useYn
    ) {
        public static WarehouseResponse from(Warehouse warehouse) {
            return new WarehouseResponse(
                    warehouse.getId(),
                    warehouse.getAccount().getId(),
                    warehouse.getAccount().getAccountCode(),
                    warehouse.getAccount().getAccountName(),
                    warehouse.getTopAccountId(),
                    warehouse.getWarehouseCode(),
                    warehouse.getWarehouseName(),
                    warehouse.getWarehouseTypeSubCode(),
                    warehouse.getAddressName(),
                    warehouse.getPriority(),
                    warehouse.getPhoneNo(),
                    warehouse.getFaxNo(),
                    warehouse.getUseYn()
            );
        }
    }

    public record AreaResponse(
            Long id,
            Long accountId,
            Long warehouseId,
            String warehouseCode,
            String areaCode,
            String areaName,
            String detailDescription,
            Integer priority,
            String createdAt,
            String updatedAt,
            String useYn
    ) {
        public static AreaResponse from(Area area) {
            return new AreaResponse(
                    area.getId(),
                    area.getAccount().getId(),
                    area.getWarehouse().getId(),
                    area.getWarehouse().getWarehouseCode(),
                    area.getAreaCode(),
                    area.getAreaName(),
                    area.getDetailDescription(),
                    area.getPriority(),
                    String.valueOf(area.getCreatedAt()),
                    String.valueOf(area.getUpdatedAt()),
                    area.getUseYn()
            );
        }
    }

    public record ZoneResponse(
            Long id,
            Long accountId,
            Long warehouseId,
            String warehouseCode,
            Long areaId,
            String areaCode,
            String zoneCode,
            String zoneName,
            String areaName,
            String detailDescription,
            Integer priority,
            String createdAt,
            String updatedAt,
            String useYn
    ) {
        public static ZoneResponse from(Zone zone) {
            return new ZoneResponse(
                    zone.getId(),
                    zone.getAccount().getId(),
                    zone.getWarehouse().getId(),
                    zone.getWarehouse().getWarehouseCode(),
                    zone.getArea().getId(),
                    zone.getArea().getAreaCode(),
                    zone.getZoneCode(),
                    zone.getZoneName(),
                    zone.getArea().getAreaName(),
                    zone.getDetailDescription(),
                    zone.getPriority(),
                    String.valueOf(zone.getCreatedAt()),
                    String.valueOf(zone.getUpdatedAt()),
                    zone.getUseYn()
            );
        }
    }

    public record LocationResponse(
            Long id,
            Long accountId,
            Long warehouseId,
            String warehouseCode,
            Long areaId,
            String areaCode,
            Long zoneId,
            String zoneCode,
            String locationCode,
            String locationName,
            String zoneName,
            String detailDescription,
            String locationTypeSubCode,
            String logicalTypeSubCode,
            String mixKey,
            Integer priority,
            Integer putawayPriority,
            Integer pickingPriority,
            Integer allocPriority,
            String createdAt,
            String updatedAt,
            String useYn
    ) {
        public static LocationResponse from(Location location) {
            Zone zone = location.getZone();
            return new LocationResponse(
                    location.getId(),
                    location.getAccount().getId(),
                    location.getWarehouse().getId(),
                    location.getWarehouse().getWarehouseCode(),
                    zone.getArea().getId(),
                    zone.getArea().getAreaCode(),
                    zone.getId(),
                    zone.getZoneCode(),
                    location.getLocationCode(),
                    location.getLocationName(),
                    zone.getZoneName(),
                    location.getDetailDescription(),
                    location.getLocationTypeSubCode(),
                    location.getLogicalTypeSubCode(),
                    location.getMixKey(),
                    location.getPriority(),
                    location.getPutawayPriority(),
                    location.getPickingPriority(),
                    location.getAllocPriority(),
                    String.valueOf(location.getCreatedAt()),
                    String.valueOf(location.getUpdatedAt()),
                    location.getUseYn()
            );
        }
    }

    public record WarehouseCreateRequest(
            @NotBlank String warehouseCode,
            @NotBlank String warehouseName,
            @NotBlank String warehouseTypeSubCode,
            String addressName,
            Integer priority,
            String phoneNo,
            String faxNo,
            String useYn
    ) {
    }

    public record WarehouseUpdateRequest(
            @NotBlank String warehouseCode,
            @NotBlank String warehouseName,
            @NotBlank String warehouseTypeSubCode,
            String addressName,
            Integer priority,
            String phoneNo,
            String faxNo,
            String useYn
    ) {
    }

    public record AreaCreateRequest(
            @NotNull Long warehouseId,
            @NotBlank String areaCode,
            @NotBlank String areaName,
            String detailDescription,
            Integer priority
    ) {
    }

    public record AreaUpdateRequest(
            @NotNull Long warehouseId,
            @NotBlank String areaCode,
            @NotBlank String areaName,
            String detailDescription,
            Integer priority
    ) {
    }

    public record ZoneCreateRequest(
            @NotNull Long areaId,
            @NotBlank String zoneCode,
            @NotBlank String zoneName,
            String detailDescription,
            Integer priority
    ) {
    }

    public record ZoneUpdateRequest(
            @NotNull Long areaId,
            @NotBlank String zoneCode,
            @NotBlank String zoneName,
            String detailDescription,
            Integer priority
    ) {
    }

    public record LocationCreateRequest(
            @NotNull Long zoneId,
            @NotBlank String locationCode,
            @NotBlank String locationName,
            String detailDescription,
            String locationTypeSubCode,
            String logicalTypeSubCode,
            String mixKey,
            Integer priority,
            Integer putawayPriority,
            Integer pickingPriority,
            Integer allocPriority
    ) {
    }

    public record LocationUpdateRequest(
            @NotNull Long zoneId,
            @NotBlank String locationCode,
            @NotBlank String locationName,
            String detailDescription,
            String locationTypeSubCode,
            String logicalTypeSubCode,
            String mixKey,
            Integer priority,
            Integer putawayPriority,
            Integer pickingPriority,
            Integer allocPriority
    ) {
    }

    public record WarehouseLocationResponse(
            List<WarehouseResponse> warehouses,
            List<AreaResponse> areas,
            List<ZoneResponse> zones,
            List<LocationResponse> locations
    ) {
    }
}
