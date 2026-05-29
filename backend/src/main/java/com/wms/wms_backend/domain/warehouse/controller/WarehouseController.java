package com.wms.wms_backend.domain.warehouse.controller;

import com.wms.wms_backend.domain.warehouse.entity.Area;
import com.wms.wms_backend.domain.warehouse.entity.Location;
import com.wms.wms_backend.domain.warehouse.entity.Warehouse;
import com.wms.wms_backend.domain.warehouse.entity.Zone;
import com.wms.wms_backend.domain.warehouse.repository.AreaRepository;
import com.wms.wms_backend.domain.warehouse.repository.LocationRepository;
import com.wms.wms_backend.domain.warehouse.repository.WarehouseRepository;
import com.wms.wms_backend.domain.warehouse.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
public class WarehouseController {

    private final WarehouseRepository warehouseRepository;
    private final AreaRepository areaRepository;
    private final ZoneRepository zoneRepository;
    private final LocationRepository locationRepository;

    @GetMapping("/api/warehouses")
    public List<WarehouseResponse> findWarehouses() {
        List<Warehouse> warehouses = warehouseRepository.findAllByUseYnOrderByIdAsc("Y");
        List<WarehouseResponse> responses = new ArrayList<>();

        for (Warehouse warehouse : warehouses) {
            WarehouseResponse response = WarehouseResponse.from(warehouse);
            responses.add(response);
        }

        return responses;
    }

    @GetMapping("/api/warehouse-locations")
    public WarehouseLocationResponse findWarehouseLocations() {
        List<Warehouse> warehouses = warehouseRepository.findAllByUseYnOrderByIdAsc("Y");
        List<Area> areas = areaRepository.findAllByUseYnOrderByIdAsc("Y");
        List<Zone> zones = zoneRepository.findAllByUseYnOrderByIdAsc("Y");
        List<Location> locations = locationRepository.findAllByUseYnOrderByIdAsc("Y");

        List<WarehouseResponse> warehouseResponses = new ArrayList<>();
        List<AreaResponse> areaResponses = new ArrayList<>();
        List<ZoneResponse> zoneResponses = new ArrayList<>();
        List<LocationResponse> locationResponses = new ArrayList<>();

        for (Warehouse warehouse : warehouses) {
            warehouseResponses.add(WarehouseResponse.from(warehouse));
        }

        for (Area area : areas) {
            areaResponses.add(AreaResponse.from(area));
        }

        for (Zone zone : zones) {
            zoneResponses.add(ZoneResponse.from(zone));
        }

        for (Location location : locations) {
            locationResponses.add(LocationResponse.from(location));
        }

        return new WarehouseLocationResponse(warehouseResponses, areaResponses, zoneResponses, locationResponses);
    }

    public record WarehouseResponse(
            Long id,
            Long accountId,
            Long topAccountId,
            String warehouseCode,
            String warehouseName,
            String warehouseTypeSubCode,
            String useYn
    ) {
        public static WarehouseResponse from(Warehouse warehouse) {
            return new WarehouseResponse(
                    warehouse.getId(),
                    warehouse.getAccount().getId(),
                    warehouse.getTopAccountId(),
                    warehouse.getWarehouseCode(),
                    warehouse.getWarehouseName(),
                    warehouse.getWarehouseTypeSubCode(),
                    warehouse.getUseYn()
            );
        }
    }

    public record AreaResponse(
            Long id,
            Long warehouseId,
            String areaCode,
            String areaName,
            String useYn
    ) {
        public static AreaResponse from(Area area) {
            return new AreaResponse(
                    area.getId(),
                    area.getWarehouse().getId(),
                    area.getAreaCode(),
                    area.getAreaName(),
                    area.getUseYn()
            );
        }
    }

    public record ZoneResponse(
            Long id,
            Long areaId,
            String zoneCode,
            String zoneName,
            String useYn
    ) {
        public static ZoneResponse from(Zone zone) {
            return new ZoneResponse(
                    zone.getId(),
                    zone.getArea().getId(),
                    zone.getZoneCode(),
                    zone.getZoneName(),
                    zone.getUseYn()
            );
        }
    }

    public record LocationResponse(
            Long id,
            Long zoneId,
            String locationCode,
            String locationName,
            String useYn
    ) {
        public static LocationResponse from(Location location) {
            return new LocationResponse(
                    location.getId(),
                    location.getZone().getId(),
                    location.getLocationCode(),
                    location.getLocationName(),
                    location.getUseYn()
            );
        }
    }

    public record WarehouseLocationResponse(
            List<WarehouseResponse> warehouses,
            List<AreaResponse> areas,
            List<ZoneResponse> zones,
            List<LocationResponse> locations
    ) {
    }
}
