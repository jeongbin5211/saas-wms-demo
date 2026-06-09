import { useState } from 'react'
import { TabLayout } from '../../components/common/TabLayout.jsx'
import { StandardWorkPage } from '../StandardWorkPage.jsx'

const warehouseColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: '창고명', name: 'warehouseName', width: 220 },
  { header: '주소명', name: 'addressName', width: 220 },
  { header: '우선순위', name: 'priority', width: 100, align: 'right' },
  { header: '창고 유형', name: 'warehouseTypeSubCode', width: 120, align: 'center' },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '전화번호', name: 'phoneNo', width: 140 },
  { header: '팩스', name: 'faxNo', width: 140 },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const areaColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Area명', name: 'areaName', width: 220 },
  { header: '상세 설명', name: 'detailDescription', width: 260 },
  { header: '우선순위', name: 'priority', width: 100, align: 'right' },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const zoneColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Zone 코드', name: 'zoneCode', width: 150 },
  { header: 'Zone명', name: 'zoneName', width: 220 },
  { header: 'Area명', name: 'areaName', width: 180 },
  { header: '상세 설명', name: 'detailDescription', width: 260 },
  { header: '우선순위', name: 'priority', width: 100, align: 'right' },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const locationColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Zone 코드', name: 'zoneCode', width: 150 },
  { header: 'Location 코드', name: 'locationCode', width: 170 },
  { header: 'Location명', name: 'locationName', width: 230 },
  { header: 'Zone명', name: 'zoneName', width: 170 },
  { header: '상세 설명', name: 'detailDescription', width: 260 },
  { header: '유형', name: 'locationTypeSubCode', width: 120, align: 'center' },
  { header: '우선순위', name: 'priority', width: 100, align: 'right' },
  { header: 'Location 논리 유형', name: 'logicalTypeSubCode', width: 160 },
  { header: 'Mix Key', name: 'mixKey', width: 140 },
  { header: '적치 우선순위', name: 'putawayPriority', width: 120, align: 'right' },
  { header: '피킹 우선순위', name: 'pickingPriority', width: 120, align: 'right' },
  { header: '할당 우선순위', name: 'allocPriority', width: 120, align: 'right' },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const warehouseTypeOptions = [
  { label: '기본 창고', value: 'MAIN' },
  { label: '입고 창고', value: 'INBOUND' },
  { label: '출고 창고', value: 'OUTBOUND' },
]

const useYnOptions = [
  { label: 'Y', value: 'Y' },
  { label: 'N', value: 'N' },
]

const locationTypeOptions = [
  { label: '보관', value: 'STORAGE' },
  { label: '피킹', value: 'PICKING' },
  { label: '입고', value: 'RECEIVING' },
  { label: '출고', value: 'SHIPPING' },
]

const logicalTypeOptions = [
  { label: '일반', value: 'NORMAL' },
  { label: '보류', value: 'HOLD' },
  { label: '불량', value: 'DEFECT' },
]

export function LocationsPage({ authUser, data, initialTypeTab = 0, onRefresh, page }) {
  const [activeTypeTab, setActiveTypeTab] = useState(initialTypeTab)
  const catalog = data.locationCatalog

  const warehouseOptions = catalog.warehouses.map((warehouse) => ({
    label: `${warehouse.warehouseCode} / ${warehouse.warehouseName}`,
    value: warehouse.id,
  }))

  const areaOptions = catalog.areas.map((area) => ({
    label: `${area.warehouseCode} / ${area.areaCode} / ${area.areaName}`,
    value: area.id,
  }))

  const zoneOptions = catalog.zones.map((zone) => ({
    label: `${zone.warehouseCode} / ${zone.areaCode} / ${zone.zoneCode}`,
    value: zone.id,
  }))

  return (
    <section className="standard-page">
      <div className="work-page-header">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h2>{page.title}</h2>
          <span>{page.description}</span>
        </div>
      </div>

      <TabLayout
        activeTab={activeTypeTab}
        onTabChange={setActiveTypeTab}
        tabs={[
          {
            label: '창고',
            content: (
              <StandardWorkPage
                authUser={authUser}
                buildPayload={(row) => ({
                  warehouseCode: row.warehouseCode,
                  warehouseName: row.warehouseName,
                  warehouseTypeSubCode: row.warehouseTypeSubCode,
                  addressName: row.addressName,
                  priority: toOptionalNumber(row.priority),
                  phoneNo: row.phoneNo,
                  faxNo: row.faxNo,
                })}
                columns={warehouseColumns}
                createDefaults={{ warehouseTypeSubCode: 'MAIN', priority: 0 }}
                data={catalog.warehouses}
                detailFields={[
                  { name: 'warehouseCode', label: '창고 코드', required: true },
                  { name: 'warehouseName', label: '창고명', required: true },
                  { name: 'warehouseTypeSubCode', label: '창고 유형', type: 'select', options: warehouseTypeOptions, required: true },
                  { name: 'addressName', label: '주소명', wide: true },
                  { name: 'priority', label: '우선순위', type: 'number' },
                  { name: 'phoneNo', label: '전화번호' },
                  { name: 'faxNo', label: '팩스' },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/warehouses"
                onRefresh={onRefresh}
                page={{ eyebrow: '로케이션 정보', title: '창고', description: '위치정보의 최상위 단위인 창고를 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'warehouseName', label: '창고명' },
                  { name: 'warehouseTypeSubCode', label: '창고 유형', type: 'select', options: warehouseTypeOptions },
                  { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
                ]}
              />
            ),
          },
          {
            label: 'Area',
            content: (
              <StandardWorkPage
                authUser={authUser}
                buildPayload={(row) => ({
                  warehouseId: Number(row.warehouseId),
                  areaCode: row.areaCode,
                  areaName: row.areaName,
                  detailDescription: row.detailDescription,
                  priority: toOptionalNumber(row.priority),
                })}
                columns={areaColumns}
                createDefaults={{ warehouseId: catalog.warehouses[0]?.id ?? '', priority: 0 }}
                data={catalog.areas}
                detailFields={[
                  { name: 'warehouseId', label: '창고', type: 'select', options: warehouseOptions, required: true },
                  { name: 'areaCode', label: 'Area 코드', required: true },
                  { name: 'areaName', label: 'Area명', required: true },
                  { name: 'detailDescription', label: '상세 설명', wide: true },
                  { name: 'priority', label: '우선순위', type: 'number' },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/areas"
                onRefresh={onRefresh}
                page={{ eyebrow: '로케이션 정보', title: 'Area', description: '창고 하위의 작업 구역 단위인 Area를 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'areaCode', label: 'Area 코드' },
                  { name: 'areaName', label: 'Area명' },
                  { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
                ]}
              />
            ),
          },
          {
            label: 'Zone',
            content: (
              <StandardWorkPage
                authUser={authUser}
                buildPayload={(row) => ({
                  areaId: Number(row.areaId),
                  zoneCode: row.zoneCode,
                  zoneName: row.zoneName,
                  detailDescription: row.detailDescription,
                  priority: toOptionalNumber(row.priority),
                })}
                columns={zoneColumns}
                createDefaults={{ areaId: catalog.areas[0]?.id ?? '', priority: 0 }}
                data={catalog.zones}
                detailFields={[
                  { name: 'areaId', label: 'Area', type: 'select', options: areaOptions, required: true },
                  { name: 'zoneCode', label: 'Zone 코드', required: true },
                  { name: 'zoneName', label: 'Zone명', required: true },
                  { name: 'warehouseCode', label: '창고 코드', readOnly: true },
                  { name: 'areaName', label: 'Area명', readOnly: true },
                  { name: 'detailDescription', label: '상세 설명', wide: true },
                  { name: 'priority', label: '우선순위', type: 'number' },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/zones"
                onRefresh={onRefresh}
                page={{ eyebrow: '로케이션 정보', title: 'Zone', description: 'Area 하위의 보관/작업 Zone을 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'areaCode', label: 'Area 코드' },
                  { name: 'zoneCode', label: 'Zone 코드' },
                  { name: 'zoneName', label: 'Zone명' },
                  { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
                ]}
              />
            ),
          },
          {
            label: 'Location',
            content: (
              <StandardWorkPage
                authUser={authUser}
                buildPayload={(row) => ({
                  zoneId: Number(row.zoneId),
                  locationCode: row.locationCode,
                  locationName: row.locationName,
                  detailDescription: row.detailDescription,
                  locationTypeSubCode: row.locationTypeSubCode,
                  logicalTypeSubCode: row.logicalTypeSubCode,
                  mixKey: row.mixKey,
                  priority: toOptionalNumber(row.priority),
                  putawayPriority: toOptionalNumber(row.putawayPriority),
                  pickingPriority: toOptionalNumber(row.pickingPriority),
                  allocPriority: toOptionalNumber(row.allocPriority),
                })}
                columns={locationColumns}
                createDefaults={{
                  zoneId: catalog.zones[0]?.id ?? '',
                  locationTypeSubCode: 'STORAGE',
                  logicalTypeSubCode: 'NORMAL',
                  priority: 0,
                  putawayPriority: 0,
                  pickingPriority: 0,
                  allocPriority: 0,
                }}
                data={catalog.locations}
                detailFields={[
                  { name: 'zoneId', label: 'Zone', type: 'select', options: zoneOptions, required: true },
                  { name: 'locationCode', label: 'Location 코드', required: true },
                  { name: 'locationName', label: 'Location명', required: true },
                  { name: 'warehouseCode', label: '창고 코드', readOnly: true },
                  { name: 'areaCode', label: 'Area 코드', readOnly: true },
                  { name: 'zoneName', label: 'Zone명', readOnly: true },
                  { name: 'detailDescription', label: '상세 설명', wide: true },
                  { name: 'locationTypeSubCode', label: '유형', type: 'select', options: locationTypeOptions },
                  { name: 'logicalTypeSubCode', label: 'Location 논리 유형', type: 'select', options: logicalTypeOptions },
                  { name: 'mixKey', label: 'Mix Key' },
                  { name: 'priority', label: '우선순위', type: 'number' },
                  { name: 'putawayPriority', label: '적치 우선순위', type: 'number' },
                  { name: 'pickingPriority', label: '피킹 우선순위', type: 'number' },
                  { name: 'allocPriority', label: '할당 우선순위', type: 'number' },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/locations"
                onRefresh={onRefresh}
                page={{ eyebrow: '로케이션 정보', title: 'Location', description: '재고가 실제로 보관되는 최하위 로케이션을 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'zoneCode', label: 'Zone 코드' },
                  { name: 'locationCode', label: 'Location 코드' },
                  { name: 'locationName', label: 'Location명' },
                  { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
                ]}
              />
            ),
          },
        ]}
      />
    </section>
  )
}

function toOptionalNumber(value) {
  if (value === undefined || value === null || value === '') return null
  return Number(value)
}
