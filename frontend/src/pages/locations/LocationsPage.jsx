import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { WmsGrid } from '../../components/common/WmsGrid.jsx'
import { fetchWithAuth } from '../../router/session.js'
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

const accountLookupColumns = [
  { header: '거래처 코드', name: 'accountCode', width: 220 },
  { header: '거래처명', name: 'accountName', width: 360 },
  { header: '구분', name: 'accountTypeSubCode', width: 160, align: 'center' },
]

const addressLookupColumns = [
  { header: '주소 코드', name: 'addressCode', width: 150 },
  { header: '주소명', name: 'addressName', width: 190 },
  { header: '거래처', name: 'accountName', width: 150 },
  { header: '주소', name: 'fullAddress', width: 260 },
]

export function LocationsPage({ authUser, data, initialTypeTab = 0, onRefresh, page }) {
  const [accountLookupContext, setAccountLookupContext] = useState(null)
  const [addressLookupContext, setAddressLookupContext] = useState(null)
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
      onOpenAddressLookup: setAddressLookupContext,
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
      <AddressLookupModal
        accountCode={addressLookupContext?.values?.accountCode}
        accounts={data.accounts}
        addresses={data.accountAddresses ?? []}
        open={Boolean(addressLookupContext)}
        onClose={() => setAddressLookupContext(null)}
        onRefresh={onRefresh}
        onSelect={(address) => {
          addressLookupContext?.setDraftRow((current) => ({
            ...(current ?? {}),
            addressName: address.addressName,
            phoneNo: current?.phoneNo || address.phoneNo || '',
            faxNo: current?.faxNo || address.faxNo || '',
            contactName: current?.contactName || address.contactName || '',
          }))
          setAddressLookupContext(null)
        }}
      />
    </>
  )
}

function buildWarehousePage({ accounts, authUser, catalog, onOpenAccountLookup, onOpenAddressLookup, onRefresh, page }) {
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
      createSuccessMessage="등록이 완료되었습니다. 기본 Area, Zone, Location이 자동 생성되었습니다."
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
        { name: 'addressName', label: '주소명', section: '상세 정보', required: true, wide: true, placeholder: '예: 서울시 강남구 물류센터 1동', actionLabel: '조회' },
        { name: 'priority', label: '우선순위', section: '상세 정보', type: 'number', required: true },
        { name: 'phoneNo', label: '전화번호', section: '상세 정보' },
        { name: 'faxNo', label: '팩스', section: '상세 정보' },
        { name: 'closeTime', label: '마감 시간', section: '상세 정보', type: 'time' },
        { name: 'contactName', label: '담당자', section: '상세 정보' },
        { name: 'useYn', label: '사용 여부', section: '상세 정보', type: 'select', options: useYnOptions, required: true },
      ]}
      detailTabLabel="상세 목록"
      deleteConfirmTitle="미사용 처리하시겠습니까?"
      deleteLabel="미사용 처리"
      deleteSuccessMessage="미사용 처리되었습니다."
      endpoint="/api/warehouses"
      hideHeader
      listTabLabel="창고 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '로케이션 정보', title: '창고' }}
      detailFieldAction={(field, values, context) => {
        if (field.name === 'addressName') {
          if (!values.accountCode) {
            context.setMessage('창고 소속 거래처를 먼저 선택해 주세요.')
            return
          }

          onOpenAddressLookup({ ...context, values })
          return
        }

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
      ]}
    />
  )
}


function AccountLookupModal({ accounts, open, onClose, onSelect }) {
  return (
    <LookupGridModal
      columns={accountLookupColumns}
      data={accounts}
      emptyMessage="조회된 거래처가 없습니다."
      open={open}
      placeholder="거래처 코드 또는 거래처명"
      searchKeys={['accountCode', 'accountName', 'accountTypeSubCode']}
      title="창고 소속 거래처 조회"
      onClose={onClose}
      onSelect={onSelect}
    />
  )
}

function AddressLookupModal({ accountCode: initialAccountCode, accounts, addresses, open, onClose, onRefresh, onSelect }) {
  const [searchAccountCode, setSearchAccountCode] = useState('')
  const [searchAddressCode, setSearchAddressCode] = useState('')
  const [formData, setFormData] = useState(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (open) {
      setSearchAccountCode(initialAccountCode ?? '')
      setSearchAddressCode('')
      setFormData(null)
      setIsNew(false)
      setErrorMsg('')
    }
  }, [open, initialAccountCode])

  const filteredData = useMemo(() => {
    let result = addresses
    const accCode = searchAccountCode.trim().toLowerCase()
    const addrCode = searchAddressCode.trim().toLowerCase()
    if (accCode) result = result.filter((r) => r.accountCode?.toLowerCase().includes(accCode))
    if (addrCode) result = result.filter((r) => (
      r.addressCode?.toLowerCase().includes(addrCode) || r.addressName?.toLowerCase().includes(addrCode)
    ))
    return result
  }, [addresses, searchAccountCode, searchAddressCode])

  const handleRowOpen = (row) => {
    setFormData({ ...row })
    setIsNew(false)
    setErrorMsg('')
  }

  const handleNew = () => {
    setFormData({
      accountId: '', accountCode: '', accountName: '',
      addressCode: '', addressName: '',
      addressLine1: '', addressLine2: '', city: '', state: '', zipcode: '', country: '',
      phoneNo: '', faxNo: '', contactName: '',
    })
    setIsNew(true)
    setErrorMsg('')
  }

  const handleSave = async () => {
    if (!formData?.addressCode?.trim()) { setErrorMsg('주소 코드는 필수입니다.'); return }
    if (!formData?.addressName?.trim()) { setErrorMsg('주소명은 필수입니다.'); return }
    if (!formData?.accountId) { setErrorMsg('거래처를 선택해 주세요.'); return }

    setSaving(true)
    setErrorMsg('')
    try {
      const response = await fetchWithAuth('/api/account-addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: Number(formData.accountId),
          addressCode: formData.addressCode.trim(),
          addressName: formData.addressName.trim(),
          addressLine1: formData.addressLine1?.trim() || null,
          addressLine2: formData.addressLine2?.trim() || null,
          city: formData.city?.trim() || null,
          state: formData.state?.trim() || null,
          zipcode: formData.zipcode?.trim() || null,
          country: formData.country?.trim() || null,
          phoneNo: formData.phoneNo?.trim() || null,
          faxNo: formData.faxNo?.trim() || null,
          contactName: formData.contactName?.trim() || null,
        }),
      })
      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        setErrorMsg(body.message ?? '저장에 실패했습니다.')
        return
      }
      const created = await response.json()
      await onRefresh?.()
      setFormData({ ...created })
      setIsNew(false)
    } catch {
      setErrorMsg('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="lookup-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="lookup-modal address-lookup-modal" role="dialog" aria-modal="true" aria-label="주소 조회" onMouseDown={(e) => e.stopPropagation()}>
        <header className="lookup-modal-header">
          <strong>주소 조회</strong>
          <div className="lookup-modal-header-actions">
            <button type="button" className="primary-button compact" onClick={handleNew}>신규</button>
            {isNew && (
              <button type="button" className="save-button compact" onClick={handleSave} disabled={saving}>
                {saving ? '저장 중...' : '저장'}
              </button>
            )}
            {formData && !isNew && (
              <button type="button" className="primary-button compact" onClick={() => onSelect(formData)}>선택</button>
            )}
            <button type="button" className="icon-only-button" aria-label="닫기" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </header>
        <div className="address-lookup-body">
          <div className="address-lookup-list">
            <div className="address-lookup-search">
              <div className="address-lookup-search-row">
                <span>거래처 코드</span>
                <input placeholder="거래처 코드" value={searchAccountCode} onChange={(e) => setSearchAccountCode(e.target.value)} />
              </div>
              <div className="address-lookup-search-row">
                <span>주소 코드</span>
                <input placeholder="주소 코드 또는 주소명" value={searchAddressCode} onChange={(e) => setSearchAddressCode(e.target.value)} />
              </div>
            </div>
            <div className="address-lookup-grid">
              <WmsGrid
                columns={addressLookupColumns}
                data={filteredData}
                fillHeight
                includeAuditColumns={false}
                minBodyHeight={300}
                onRowDoubleClick={handleRowOpen}
                rowHeaders={['rowNum']}
              />
            </div>
          </div>
          {formData !== null && (
            <div className="address-lookup-form">
              <div className="address-lookup-form-inner">
                <AddressFormSection title="기본 정보">
                  <AddressFormField label="주소 코드" required={isNew}>
                    <input value={formData.addressCode ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, addressCode: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="주소명" required>
                    <input value={formData.addressName ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, addressName: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="거래처" required={isNew}>
                    {isNew ? (
                      <select
                        value={formData.accountId ?? ''}
                        onChange={(e) => {
                          const account = accounts.find((a) => String(a.id) === e.target.value)
                          setFormData({ ...formData, accountId: e.target.value, accountCode: account?.accountCode ?? '', accountName: account?.accountName ?? '' })
                        }}
                      >
                        <option value="">거래처 선택</option>
                        {accounts.map((a) => (
                          <option key={a.id} value={String(a.id)}>{a.accountCode} / {a.accountName}</option>
                        ))}
                      </select>
                    ) : (
                      <input value={`${formData.accountCode ?? ''} / ${formData.accountName ?? ''}`} readOnly />
                    )}
                  </AddressFormField>
                </AddressFormSection>
                <AddressFormSection title="상세 주소">
                  <AddressFormField label="주소 1">
                    <input value={formData.addressLine1 ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="주소 2">
                    <input value={formData.addressLine2 ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="도시">
                    <input value={formData.city ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="우편번호">
                    <input value={formData.zipcode ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, zipcode: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="국가">
                    <input value={formData.country ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
                  </AddressFormField>
                </AddressFormSection>
                <AddressFormSection title="연락처">
                  <AddressFormField label="전화번호">
                    <input value={formData.phoneNo ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="팩스">
                    <input value={formData.faxNo ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, faxNo: e.target.value })} />
                  </AddressFormField>
                  <AddressFormField label="담당자">
                    <input value={formData.contactName ?? ''} readOnly={!isNew} onChange={(e) => setFormData({ ...formData, contactName: e.target.value })} />
                  </AddressFormField>
                </AddressFormSection>
                {errorMsg && <div className="address-lookup-error">{errorMsg}</div>}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function AddressFormSection({ title, children }) {
  return (
    <div className="address-lookup-form-section">
      <div className="address-lookup-form-title">{title}</div>
      <div className="address-lookup-form-fields">{children}</div>
    </div>
  )
}

function AddressFormField({ label, required, children }) {
  return (
    <div className="address-form-field">
      <label className={required ? 'required' : ''}>{label}</label>
      {children}
    </div>
  )
}

function LookupGridModal({
  columns,
  data,
  emptyMessage,
  open,
  placeholder,
  searchKeys,
  title,
  wide = false,
  onClose,
  onSelect,
}) {
  const [keyword, setKeyword] = useState('')
  const filteredData = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return data
    }

    return data.filter((row) => searchKeys.some((key) => (
      String(row[key] ?? '').toLowerCase().includes(normalizedKeyword)
    )))
  }, [data, keyword, searchKeys])

  if (!open) {
    return null
  }

  return (
    <div className="lookup-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className={`lookup-modal${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="lookup-modal-header">
          <strong>{title}</strong>
          <button type="button" className="icon-only-button" aria-label="닫기" onClick={onClose}>
            <X size={18} />
          </button>
        </header>
        <div className="lookup-modal-filter">
          <Search size={16} />
          <input
            autoFocus
            placeholder={placeholder}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>
        <div className="lookup-modal-grid">
          {filteredData.length > 0 ? (
            <WmsGrid
              columns={columns}
              data={filteredData}
              includeAuditColumns={false}
              minBodyHeight={360}
              onRowDoubleClick={onSelect}
              rowHeaders={['rowNum']}
            />
          ) : (
            <div className="lookup-empty-cell">{emptyMessage}</div>
          )}
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
