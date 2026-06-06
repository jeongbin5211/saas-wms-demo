import { useState } from 'react'
import { TabLayout } from '../../components/common/TabLayout.jsx'
import { StandardWorkPage } from '../StandardWorkPage.jsx'

const warehouseColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: '창고명', name: 'warehouseName', width: 220 },
  { header: '창고 유형', name: 'warehouseTypeSubCode', width: 120, align: 'center' },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const areaColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Area명', name: 'areaName', width: 220 },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const zoneColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Zone 코드', name: 'zoneCode', width: 150 },
  { header: 'Zone명', name: 'zoneName', width: 220 },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const locationColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Zone 코드', name: 'zoneCode', width: 150 },
  { header: 'Location 코드', name: 'locationCode', width: 170 },
  { header: 'Location명', name: 'locationName', width: 230 },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const warehouseTypeOptions = [
  { label: '기본 창고', value: 'MAIN' },
  { label: '입고 창고', value: 'INBOUND' },
  { label: '출고 창고', value: 'OUTBOUND' },
]

export function LocationsPage({ authUser, data, onRefresh, page }) {
  const [activeTypeTab, setActiveTypeTab] = useState(0)
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
                })}
                columns={warehouseColumns}
                createDefaults={{ warehouseTypeSubCode: 'MAIN' }}
                data={catalog.warehouses}
                detailFields={[
                  { name: 'warehouseCode', label: '창고 코드', required: true },
                  { name: 'warehouseName', label: '창고명', required: true },
                  { name: 'warehouseTypeSubCode', label: '창고 유형', type: 'select', options: warehouseTypeOptions, required: true },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/warehouses"
                onRefresh={onRefresh}
                page={{ eyebrow: '위치정보', title: '창고 관리', description: '위치정보의 최상위 단위인 창고를 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'warehouseName', label: '창고명' },
                  { name: 'warehouseTypeSubCode', label: '창고 유형', type: 'select', options: warehouseTypeOptions },
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
                })}
                columns={areaColumns}
                createDefaults={{ warehouseId: catalog.warehouses[0]?.id ?? '' }}
                data={catalog.areas}
                detailFields={[
                  { name: 'warehouseId', label: '창고', type: 'select', options: warehouseOptions, required: true },
                  { name: 'areaCode', label: 'Area 코드', required: true },
                  { name: 'areaName', label: 'Area명', required: true },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/areas"
                onRefresh={onRefresh}
                page={{ eyebrow: '위치정보', title: 'Area 관리', description: '창고 하위의 작업 구역 단위인 Area를 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'areaCode', label: 'Area 코드' },
                  { name: 'areaName', label: 'Area명' },
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
                })}
                columns={zoneColumns}
                createDefaults={{ areaId: catalog.areas[0]?.id ?? '' }}
                data={catalog.zones}
                detailFields={[
                  { name: 'areaId', label: 'Area', type: 'select', options: areaOptions, required: true },
                  { name: 'zoneCode', label: 'Zone 코드', required: true },
                  { name: 'zoneName', label: 'Zone명', required: true },
                  { name: 'warehouseCode', label: '창고 코드', readOnly: true },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/zones"
                onRefresh={onRefresh}
                page={{ eyebrow: '위치정보', title: 'Zone 관리', description: 'Area 하위의 보관/작업 Zone을 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'areaCode', label: 'Area 코드' },
                  { name: 'zoneCode', label: 'Zone 코드' },
                  { name: 'zoneName', label: 'Zone명' },
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
                })}
                columns={locationColumns}
                createDefaults={{ zoneId: catalog.zones[0]?.id ?? '' }}
                data={catalog.locations}
                detailFields={[
                  { name: 'zoneId', label: 'Zone', type: 'select', options: zoneOptions, required: true },
                  { name: 'locationCode', label: 'Location 코드', required: true },
                  { name: 'locationName', label: 'Location명', required: true },
                  { name: 'warehouseCode', label: '창고 코드', readOnly: true },
                  { name: 'areaCode', label: 'Area 코드', readOnly: true },
                  { name: 'accountId', label: '거래처 ID', readOnly: true },
                  { name: 'useYn', label: '사용 여부', readOnly: true },
                ]}
                endpoint="/api/locations"
                onRefresh={onRefresh}
                page={{ eyebrow: '위치정보', title: 'Location 관리', description: '재고가 실제로 보관되는 최하위 로케이션을 관리합니다.' }}
                searchFields={[
                  { name: 'warehouseCode', label: '창고 코드' },
                  { name: 'areaCode', label: 'Area 코드' },
                  { name: 'zoneCode', label: 'Zone 코드' },
                  { name: 'locationCode', label: 'Location 코드' },
                  { name: 'locationName', label: 'Location명' },
                ]}
              />
            ),
          },
        ]}
      />
    </section>
  )
}
