import { Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { StandardWorkPage } from '../StandardWorkPage.jsx'

const warehouseColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: '창고명', name: 'warehouseName', width: 220 },
  { header: '주소명', name: 'addressName', width: 220 },
  { header: '우선순위', name: 'priority', width: 100, align: 'right' },
  { header: '유형', name: 'warehouseTypeSubCode', width: 120, align: 'center' },
  { header: '소속 거래처', name: 'accountCode', width: 130 },
  { header: '소속 거래처명', name: 'accountName', width: 180 },
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
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const zoneColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: 'Zone 코드', name: 'zoneCode', width: 150 },
  { header: 'Zone명', name: 'zoneName', width: 220 },
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Area명', name: 'areaName', width: 180 },
  { header: '상세 설명', name: 'detailDescription', width: 260 },
  { header: '우선순위', name: 'priority', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const locationColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
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
  { header: '할당우선순위', name: 'allocPriority', width: 120, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const warehouseTypeOptions = [
  { label: '자사창고', value: 'OWN' },
  { label: '외주창고', value: 'OUTSOURCED' },
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
  { label: '반품', value: 'RETURN' },
]

const logicalTypeOptions = [
  { label: '일반', value: 'NORMAL' },
  { label: '보류', value: 'HOLD' },
  { label: '불량', value: 'DEFECT' },
]

export function LocationsPage({ authUser, data, initialTypeTab = 0, onRefresh, page }) {
  const [accountLookupContext, setAccountLookupContext] = useState(null)
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
    label: `${zone.warehouseCode} / ${zone.zoneCode} / ${zone.zoneName}`,
    value: zone.id,
  }))
  const pages = [
    buildWarehousePage({
      accounts: data.accounts,
      authUser,
      catalog,
      onOpenAccountLookup: setAccountLookupContext,
      onRefresh,
      page,
    }),
    buildAreaPage({ areaOptions, authUser, catalog, onRefresh, page, warehouseOptions }),
    buildZonePage({ areaOptions, authUser, catalog, onRefresh, page }),
    buildLocationPage({ authUser, catalog, onRefresh, page, zoneOptions }),
  ]

  return (
    <>
      {pages[initialTypeTab] ?? pages[0]}
      <AccountLookupModal
        accounts={data.accounts}
        open={Boolean(accountLookupContext)}
        onClose={() => setAccountLookupContext(null)}
        onSelect={(account) => {
          accountLookupContext?.setDraftRow((current) => ({
            ...(current ?? {}),
            accountId: account.id,
            accountCode: account.accountCode,
            accountName: account.accountName,
          }))
          setAccountLookupContext(null)
        }}
      />
    </>
  )
}

function buildWarehousePage({ accounts, authUser, catalog, onOpenAccountLookup, onRefresh, page }) {
  const defaultAccount = accounts[0]

  return (
    <StandardWorkPage
      authUser={authUser}
      buildPayload={(row) => ({
        accountId: Number(row.accountId),
        warehouseCode: row.warehouseCode,
        warehouseName: row.warehouseName,
        warehouseTypeSubCode: row.warehouseTypeSubCode,
        addressName: row.addressName,
        priority: toOptionalNumber(row.priority),
        phoneNo: row.phoneNo,
        faxNo: row.faxNo,
        closeTime: row.closeTime,
        contactName: row.contactName,
        useYn: row.useYn ?? 'Y',
      })}
      columns={warehouseColumns}
      createDefaults={{
        accountCode: defaultAccount?.accountCode ?? '',
        accountId: defaultAccount?.id ?? '',
        accountName: defaultAccount?.accountName ?? '',
        priority: 0,
        useYn: 'Y',
        warehouseTypeSubCode: 'OWN',
      }}
      data={catalog.warehouses}
      detailFields={[
        { name: 'warehouseTypeSubCode', label: '창고 유형', section: '기본 정보', type: 'select', options: warehouseTypeOptions, required: true },
        { name: 'accountCode', label: '창고 소속 거래처', section: '기본 정보', readOnly: true, required: true, actionLabel: '조회', actionDisabledOnEdit: true },
        { name: 'accountName', label: '소속 거래처명', section: '기본 정보', readOnly: true, required: true },
        { name: 'warehouseCode', label: '창고 코드', section: '기본 정보', required: true, readOnlyOnEdit: true },
        { name: 'warehouseName', label: '창고명', section: '기본 정보', required: true },
        { name: 'addressName', label: '주소명', section: '상세 정보', required: true, wide: true, placeholder: '예: 서울시 강남구 물류센터 1동' },
        { name: 'priority', label: '우선순위', section: '상세 정보', type: 'number', required: true },
        { name: 'phoneNo', label: '전화번호', section: '상세 정보' },
        { name: 'faxNo', label: '팩스', section: '상세 정보' },
        { name: 'closeTime', label: '마감 시간', section: '상세 정보', type: 'time' },
        { name: 'contactName', label: '담당자', section: '상세 정보' },
        { name: 'useYn', label: '사용 여부', section: '상세 정보', type: 'select', options: useYnOptions, required: true },
      ]}
      detailTabLabel="상세 목록"
      endpoint="/api/warehouses"
      hideHeader
      listTabLabel="창고 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '로케이션 정보', title: '창고' }}
      detailFieldAction={(field, values, context) => {
        if (field.name !== 'accountCode') {
          return
        }

        if (!context.isCreateMode) {
          context.setMessage('수정 중에는 창고 소속 거래처를 변경할 수 없습니다.')
          return
        }

        onOpenAccountLookup(context)
      }}
      searchFields={[
        { name: 'warehouseCode', label: '창고 코드' },
        { name: 'warehouseName', label: '창고명' },
        { name: 'warehouseTypeSubCode', label: '창고 유형', type: 'select', options: warehouseTypeOptions },
        { name: 'accountCode', label: '소속 거래처 코드' },
        { name: 'accountName', label: '소속 거래처명' },
        { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
      ]}
    />
  )
}

function AccountLookupModal({ accounts, open, onClose, onSelect }) {
  const [keyword, setKeyword] = useState('')
  const filteredAccounts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return accounts
    }

    return accounts.filter((account) => (
      account.accountCode.toLowerCase().includes(normalizedKeyword)
      || account.accountName.toLowerCase().includes(normalizedKeyword)
      || account.accountTypeSubCode.toLowerCase().includes(normalizedKeyword)
    ))
  }, [accounts, keyword])

  if (!open) {
    return null
  }

  return (
    <div className="lookup-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="lookup-modal" role="dialog" aria-modal="true" aria-label="창고 소속 거래처 조회" onMouseDown={(event) => event.stopPropagation()}>
        <header className="lookup-modal-header">
          <strong>창고 소속 거래처 조회</strong>
          <button type="button" className="icon-only-button" aria-label="닫기" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="lookup-modal-filter">
          <Search size={16} />
          <input
            autoFocus
            placeholder="거래처 코드 또는 거래처명"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <div className="lookup-modal-grid">
          <table>
            <thead>
              <tr>
                <th>거래처 코드</th>
                <th>거래처명</th>
                <th>구분</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} onDoubleClick={() => onSelect(account)}>
                  <td>{account.accountCode}</td>
                  <td>{account.accountName}</td>
                  <td>{account.accountTypeSubCode}</td>
                  <td>
                    <button type="button" className="primary-button compact" onClick={() => onSelect(account)}>
                      선택
                    </button>
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="lookup-empty-cell">조회된 거래처가 없습니다.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function buildAreaPage({ authUser, catalog, onRefresh, page, warehouseOptions }) {
  return (
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
      createDefaults={{ priority: 0, warehouseId: catalog.warehouses[0]?.id ?? '' }}
      data={catalog.areas}
      detailFields={[
        { name: 'areaCode', label: 'Area 코드', required: true },
        { name: 'areaName', label: 'Area명', required: true },
        { name: 'warehouseId', label: '창고', type: 'select', options: warehouseOptions, required: true },
        { name: 'detailDescription', label: '상세 설명', wide: true },
        { name: 'priority', label: '우선순위', type: 'number' },
        { name: 'useYn', label: '사용 여부', readOnly: true },
      ]}
      detailTabLabel="상세 목록"
      endpoint="/api/areas"
      headerActions={<button type="button" className="icon-text-button">엑셀 업로드</button>}
      listTabLabel="Area 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '로케이션 정보', title: 'Area' }}
      searchFields={[
        { name: 'areaCode', label: 'Area 코드' },
        { name: 'areaName', label: 'Area명' },
        { name: 'warehouseCode', label: '창고 코드' },
        { name: 'warehouseName', label: '창고명' },
        { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
      ]}
    />
  )
}

function buildZonePage({ areaOptions, authUser, catalog, onRefresh, page }) {
  return (
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
        { name: 'zoneCode', label: 'Zone 코드', required: true },
        { name: 'zoneName', label: 'Zone명', required: true },
        { name: 'areaId', label: 'Area', type: 'select', options: areaOptions, required: true },
        { name: 'warehouseCode', label: '창고 코드', readOnly: true },
        { name: 'areaCode', label: 'Area 코드', readOnly: true },
        { name: 'areaName', label: 'Area명', readOnly: true },
        { name: 'detailDescription', label: '상세 설명', wide: true },
        { name: 'priority', label: '우선순위', type: 'number' },
        { name: 'useYn', label: '사용 여부', readOnly: true },
      ]}
      detailTabLabel="상세 목록"
      endpoint="/api/zones"
      headerActions={<button type="button" className="icon-text-button">엑셀 업로드</button>}
      listTabLabel="Zone 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '로케이션 정보', title: 'Zone' }}
      searchFields={[
        { name: 'zoneCode', label: 'Zone 코드' },
        { name: 'zoneName', label: 'Zone명' },
        { name: 'warehouseCode', label: '창고 코드' },
        { name: 'warehouseName', label: '창고명' },
        { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
      ]}
    />
  )
}

function buildLocationPage({ authUser, catalog, onRefresh, page, zoneOptions }) {
  return (
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
        allocPriority: 0,
        locationTypeSubCode: 'STORAGE',
        logicalTypeSubCode: 'NORMAL',
        pickingPriority: 0,
        priority: 0,
        putawayPriority: 0,
        zoneId: catalog.zones[0]?.id ?? '',
      }}
      data={catalog.locations}
      detailActions={() => <button type="button" className="icon-text-button">바코드</button>}
      detailFields={[
        { name: 'locationCode', label: 'Location 코드', required: true },
        { name: 'locationName', label: 'Location명', required: true },
        { name: 'zoneId', label: 'Zone', type: 'select', options: zoneOptions, required: true },
        { name: 'warehouseCode', label: '창고 코드', readOnly: true },
        { name: 'zoneName', label: 'Zone명', readOnly: true },
        { name: 'detailDescription', label: '상세 설명', wide: true },
        { name: 'locationTypeSubCode', label: '유형', type: 'select', options: locationTypeOptions },
        { name: 'priority', label: '우선순위', type: 'number' },
        { name: 'logicalTypeSubCode', label: 'Location 논리 유형', type: 'select', options: logicalTypeOptions },
        { name: 'mixKey', label: 'Mix Key' },
        { name: 'putawayPriority', label: '적치 우선순위', type: 'number' },
        { name: 'pickingPriority', label: '피킹 우선순위', type: 'number' },
        { name: 'allocPriority', label: '할당우선순위', type: 'number' },
        { name: 'useYn', label: '사용 여부', readOnly: true },
      ]}
      detailTabLabel="상세 목록"
      endpoint="/api/locations"
      headerActions={<button type="button" className="icon-text-button">엑셀 업로드</button>}
      listTabLabel="Location 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '로케이션 정보', title: 'Location' }}
      searchFields={[
        { name: 'locationCode', label: 'Location 코드' },
        { name: 'locationName', label: 'Location명' },
        { name: 'warehouseCode', label: '창고 코드' },
        { name: 'warehouseName', label: '창고명' },
        { name: 'zoneCode', label: 'Zone 코드' },
        { name: 'zoneName', label: 'Zone명' },
        { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
      ]}
    />
  )
}

function toOptionalNumber(value) {
  if (value === undefined || value === null || value === '') return null
  return Number(value)
}
