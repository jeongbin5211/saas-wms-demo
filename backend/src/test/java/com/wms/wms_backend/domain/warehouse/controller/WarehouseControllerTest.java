package com.wms.wms_backend.domain.warehouse.controller;

import com.wms.wms_backend.common.security.SecurityUtil;
import com.wms.wms_backend.domain.account.entity.Account;
import com.wms.wms_backend.domain.account.repository.AccountRepository;
import com.wms.wms_backend.domain.inventory.repository.InventoryRepository;
import com.wms.wms_backend.domain.warehouse.entity.Area;
import com.wms.wms_backend.domain.warehouse.entity.Location;
import com.wms.wms_backend.domain.warehouse.entity.Warehouse;
import com.wms.wms_backend.domain.warehouse.entity.Zone;
import com.wms.wms_backend.domain.warehouse.repository.AreaRepository;
import com.wms.wms_backend.domain.warehouse.repository.LocationRepository;
import com.wms.wms_backend.domain.warehouse.repository.WarehouseRepository;
import com.wms.wms_backend.domain.warehouse.repository.ZoneRepository;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class WarehouseControllerTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private WarehouseRepository warehouseRepository;

    @Mock
    private AreaRepository areaRepository;

    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private ZoneRepository zoneRepository;

    @Mock
    private LocationRepository locationRepository;

    private WarehouseController controller;

    @BeforeEach
    void setUp() {
        controller = new WarehouseController(
                accountRepository,
                warehouseRepository,
                areaRepository,
                inventoryRepository,
                zoneRepository,
                locationRepository
        );
    }

    @Test
    void createsDefaultLocationHierarchyWhenWarehouseIsCreated() {
        Account account = account(10L, 1L);
        AtomicLong idSequence = new AtomicLong(100L);

        when(warehouseRepository.existsByTopAccountIdAndWarehouseCode(1L, "WH-NEW")).thenReturn(false);
        when(accountRepository.findById(10L)).thenReturn(Optional.of(account));
        when(warehouseRepository.save(any(Warehouse.class))).thenAnswer(invocation -> withId(invocation.getArgument(0), idSequence.getAndIncrement()));
        when(areaRepository.save(any(Area.class))).thenAnswer(invocation -> withId(invocation.getArgument(0), idSequence.getAndIncrement()));
        when(zoneRepository.save(any(Zone.class))).thenAnswer(invocation -> withId(invocation.getArgument(0), idSequence.getAndIncrement()));
        when(locationRepository.save(any(Location.class))).thenAnswer(invocation -> withId(invocation.getArgument(0), idSequence.getAndIncrement()));

        try (MockedStatic<SecurityUtil> ignored = mockSecurity("GUEST")) {
            WarehouseController.WarehouseResponse response = controller.createWarehouse(new WarehouseController.WarehouseCreateRequest(
                    10L,
                    "WH-NEW",
                    "New Warehouse",
                    "OWN",
                    "Seoul DC",
                    1,
                    "02-1111-2222",
                    "02-1111-2223",
                    "18:00",
                    "Demo Manager",
                    "Y"
            ));

            assertThat(response.warehouseCode()).isEqualTo("WH-NEW");
            assertThat(response.addressName()).isEqualTo("Seoul DC");
        }

        ArgumentCaptor<Area> areaCaptor = ArgumentCaptor.forClass(Area.class);
        ArgumentCaptor<Zone> zoneCaptor = ArgumentCaptor.forClass(Zone.class);
        ArgumentCaptor<Location> locationCaptor = ArgumentCaptor.forClass(Location.class);

        verify(areaRepository).save(areaCaptor.capture());
        verify(zoneRepository).save(zoneCaptor.capture());
        verify(locationRepository, times(5)).save(locationCaptor.capture());

        assertThat(areaCaptor.getValue().getAreaCode()).isEqualTo("WH-NEW");
        assertThat(zoneCaptor.getValue().getZoneCode()).isEqualTo("WH-NEW");
        assertThat(locationCaptor.getAllValues())
                .extracting(Location::getLocationCode)
                .containsExactly("WH-NEW-RCV", "WH-NEW-STG", "WH-NEW-PCK", "WH-NEW-SHP", "WH-NEW-RTN");
    }

    @Test
    void rejectsDuplicateWarehouseCode() {
        when(warehouseRepository.existsByTopAccountIdAndWarehouseCode(1L, "WH-DUP")).thenReturn(true);

        try (MockedStatic<SecurityUtil> ignored = mockSecurity("STAFF")) {
            assertThatThrownBy(() -> controller.createWarehouse(new WarehouseController.WarehouseCreateRequest(
                    10L,
                    "WH-DUP",
                    "Duplicate Warehouse",
                    "OWN",
                    null,
                    0,
                    null,
                    null,
                    null,
                    null,
                    "Y"
            )))
                    .isInstanceOf(ResponseStatusException.class)
                    .extracting(error -> ((ResponseStatusException) error).getStatusCode())
                    .isEqualTo(HttpStatus.CONFLICT);
        }

        verify(warehouseRepository, never()).save(any(Warehouse.class));
    }

    @Test
    void blocksWarehouseDeactivateWhenActiveStockExists() {
        Warehouse warehouse = warehouse(30L, account(10L, 1L));

        when(warehouseRepository.findById(30L)).thenReturn(Optional.of(warehouse));
        when(inventoryRepository.existsActiveStockByWarehouseId(30L)).thenReturn(true);

        try (MockedStatic<SecurityUtil> ignored = mockSecurity("STAFF")) {
            assertThatThrownBy(() -> controller.deleteWarehouse(30L))
                    .isInstanceOf(ResponseStatusException.class)
                    .extracting(error -> ((ResponseStatusException) error).getStatusCode())
                    .isEqualTo(HttpStatus.CONFLICT);
        }

        assertThat(warehouse.getUseYn()).isEqualTo("Y");
    }

    @Test
    void deactivatesWarehouseWhenNoActiveStockExists() {
        Warehouse warehouse = warehouse(30L, account(10L, 1L));

        when(warehouseRepository.findById(30L)).thenReturn(Optional.of(warehouse));
        when(inventoryRepository.existsActiveStockByWarehouseId(30L)).thenReturn(false);

        try (MockedStatic<SecurityUtil> ignored = mockSecurity("STAFF")) {
            controller.deleteWarehouse(30L);
        }

        assertThat(warehouse.getUseYn()).isEqualTo("N");
    }

    private MockedStatic<SecurityUtil> mockSecurity(String role) {
        Claims claims = mock(Claims.class);
        when(claims.get("role", String.class)).thenReturn(role);

        MockedStatic<SecurityUtil> securityUtil = mockStatic(SecurityUtil.class);
        securityUtil.when(SecurityUtil::currentClaims).thenReturn(claims);
        securityUtil.when(SecurityUtil::currentTopAccountId).thenReturn(1L);
        securityUtil.when(SecurityUtil::currentAccountId).thenReturn(10L);
        return securityUtil;
    }

    private Account account(Long id, Long topAccountId) {
        Account account = new Account(topAccountId, "SMART-SUPPLY", "Smart Supplier", "SUPPLIER");
        return withId(account, id);
    }

    private Warehouse warehouse(Long id, Account account) {
        Warehouse warehouse = new Warehouse(account, account.getTopAccountId(), "WH-TEST", "Test Warehouse", "OWN");
        return withId(warehouse, id);
    }

    private <T> T withId(T entity, Long id) {
        ReflectionTestUtils.setField(entity, "id", id);
        return entity;
    }
}
