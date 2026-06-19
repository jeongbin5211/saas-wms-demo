import { useState } from 'react'
import { CommonGridLookupModal } from '../../components/common/LookupPopup.jsx'
import { StandardWorkPage } from '../StandardWorkPage.jsx'

const itemMasterColumns = [
  { header: '마스터 코드', name: 'itemMasterCode', width: 180 },
  { header: '마스터명', name: 'itemMasterName', width: 240 },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const itemClassColumns = [
  { header: '마스터 코드', name: 'itemMasterCode', width: 160 },
  { header: '마스터명', name: 'itemMasterName', width: 200 },
  { header: '클래스 코드', name: 'itemClassCode', width: 160 },
  { header: '클래스명', name: 'itemClassName', width: 220 },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const itemColumns = [
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: '클래스 코드', name: 'itemClassCode', width: 150 },
  { header: '클래스명', name: 'itemClassName', width: 180 },
  { header: '바코드', name: 'barcode', width: 150 },
  { header: '단위', name: 'unit', width: 80, align: 'center' },
  { header: '매입가', name: 'purchasePrice', width: 110, align: 'right' },
  { header: '판매가', name: 'salesPrice', width: 110, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const useYnOptions = [
  { label: 'Y', value: 'Y' },
  { label: 'N', value: 'N' },
]

const itemMasterLookupColumns = [
  { header: '마스터 코드', name: 'itemMasterCode', width: 220 },
  { header: '마스터명', name: 'itemMasterName', width: 320 },
]

const itemMasterLookupSearchFields = [
  { name: 'keyword', label: '품목 마스터', placeholder: '마스터 코드 또는 마스터명', keys: ['itemMasterCode', 'itemMasterName'] },
]

const itemClassLookupColumns = [
  { header: '마스터명', name: 'itemMasterName', width: 200 },
  { header: '클래스 코드', name: 'itemClassCode', width: 180 },
  { header: '클래스명', name: 'itemClassName', width: 240 },
]

const itemClassLookupSearchFields = [
  { name: 'keyword', label: '품목 클래스', placeholder: '클래스 코드 또는 클래스명', keys: ['itemClassCode', 'itemClassName', 'itemMasterName'] },
]

export function ItemsPage({ authUser, data, initialTypeTab = 0, onRefresh, page }) {
  const [itemMasterLookupContext, setItemMasterLookupContext] = useState(null)
  const [itemClassLookupContext, setItemClassLookupContext] = useState(null)
  const catalog = data.itemCatalog
  const lookups = {
    openItemMaster: setItemMasterLookupContext,
    openItemClass: setItemClassLookupContext,
  }
  const pages = [
    buildItemMasterPage({ authUser, catalog, onRefresh, page }),
    buildItemClassPage({ authUser, catalog, lookups, onRefresh, page }),
    buildItemPage({ authUser, catalog, lookups, onRefresh, page }),
  ]

  return (
    <>
      {pages[initialTypeTab] ?? pages[0]}
      <CommonGridLookupModal
        columns={itemMasterLookupColumns}
        data={catalog.itemMasters}
        emptyMessage="조회된 품목 마스터가 없습니다."
        initialFilters={{ keyword: '' }}
        open={Boolean(itemMasterLookupContext)}
        searchFields={itemMasterLookupSearchFields}
        title="품목 마스터 조회"
        onClose={() => setItemMasterLookupContext(null)}
        onSelect={(master) => applyLookupSelection(
          itemMasterLookupContext,
          setItemMasterLookupContext,
          { itemMasterId: master.id, itemMasterCode: master.itemMasterCode, itemMasterName: master.itemMasterName },
          { itemMasterCode: master.itemMasterCode, itemMasterName: master.itemMasterName },
        )}
      />
      <CommonGridLookupModal
        columns={itemClassLookupColumns}
        data={catalog.itemClasses}
        emptyMessage="조회된 품목 클래스가 없습니다."
        initialFilters={{ keyword: '' }}
        open={Boolean(itemClassLookupContext)}
        searchFields={itemClassLookupSearchFields}
        title="품목 클래스 조회"
        onClose={() => setItemClassLookupContext(null)}
        onSelect={(itemClass) => applyLookupSelection(
          itemClassLookupContext,
          setItemClassLookupContext,
          { itemClassId: itemClass.id, itemClassCode: itemClass.itemClassCode, itemClassName: itemClass.itemClassName },
          { itemClassCode: itemClass.itemClassCode, itemClassName: itemClass.itemClassName },
        )}
      />
    </>
  )
}

function applyLookupSelection(context, setContext, draftValues, searchValues) {
  if (context?.mode === 'search') {
    context.setSearchParams((current) => ({ ...current, ...searchValues }))
  } else {
    context?.setDraftRow((current) => ({ ...(current ?? {}), ...draftValues }))
  }
  setContext(null)
}

function buildItemMasterPage({ authUser, catalog, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      buildPayload={(row) => ({
        itemMasterCode: row.itemMasterCode,
        itemMasterName: row.itemMasterName,
        useYn: row.useYn ?? 'Y',
      })}
      columns={itemMasterColumns}
      createDefaults={{ useYn: 'Y' }}
      data={catalog.itemMasters}
      detailFields={[
        { name: 'itemMasterCode', label: '마스터 코드', section: '기본 정보', required: true, readOnlyOnEdit: true },
        { name: 'itemMasterName', label: '마스터명', section: '기본 정보', required: true },
        { name: 'useYn', label: '사용 여부', section: '기본 정보', type: 'select', options: useYnOptions, required: true },
      ]}
      detailTabLabel="상세 목록"
      endpoint="/api/item-masters"
      hideHeader
      keepDetailAfterSave
      listTabLabel="품목 마스터 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '기준정보', title: '품목 마스터' }}
      searchFields={[
        { name: 'itemMasterCode', label: '마스터 코드' },
        { name: 'itemMasterName', label: '마스터명' },
        { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
      ]}
    />
  )
}

function buildItemClassPage({ authUser, catalog, lookups, onRefresh, page }) {
  const defaultMaster = catalog.itemMasters[0]

  return (
    <StandardWorkPage
      authUser={authUser}
      buildPayload={(row) => ({
        itemMasterId: Number(row.itemMasterId),
        itemClassCode: row.itemClassCode,
        itemClassName: row.itemClassName,
        useYn: row.useYn ?? 'Y',
      })}
      columns={itemClassColumns}
      createDefaults={{
        itemMasterId: defaultMaster?.id ?? '',
        itemMasterCode: defaultMaster?.itemMasterCode ?? '',
        itemMasterName: defaultMaster?.itemMasterName ?? '',
        useYn: 'Y',
      }}
      data={catalog.itemClasses}
      detailFields={[
        { name: 'itemMasterCode', label: '품목 마스터', section: '기본 정보', readOnly: true, required: true, actionLabel: '조회', actionDisabledOnEdit: true },
        { name: 'itemMasterName', label: '마스터명', section: '기본 정보', readOnly: true, required: true },
        { name: 'itemClassCode', label: '클래스 코드', section: '기본 정보', required: true, readOnlyOnEdit: true },
        { name: 'itemClassName', label: '클래스명', section: '기본 정보', required: true },
        { name: 'useYn', label: '사용 여부', section: '기본 정보', type: 'select', options: useYnOptions, required: true },
      ]}
      detailTabLabel="상세 목록"
      endpoint="/api/item-classes"
      hideHeader
      keepDetailAfterSave
      listTabLabel="품목 클래스 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '기준정보', title: '품목 클래스' }}
      detailFieldAction={(field, values, context) => {
        if (field.name !== 'itemMasterCode') {
          return
        }

        if (!context.isCreateMode) {
          context.setMessage('수정 중에는 품목 마스터를 변경할 수 없습니다.')
          return
        }

        lookups.openItemMaster({ ...context, values })
      }}
      searchFieldAction={(field, searchParams, searchContext) => {
        if (field.name === 'itemMasterLookup') {
          lookups.openItemMaster({ mode: 'search', setSearchParams: searchContext.setSearchParams })
        }
      }}
      searchFields={[
        { name: 'itemClassCode', label: '클래스 코드' },
        { name: 'itemClassName', label: '클래스명' },
        { name: 'itemMasterLookup', label: '품목 마스터', type: 'lookup', codeField: 'itemMasterCode', nameField: 'itemMasterName' },
        { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
      ]}
    />
  )
}

function buildItemPage({ authUser, catalog, lookups, onRefresh, page }) {
  const defaultClass = catalog.itemClasses[0]

  return (
    <StandardWorkPage
      authUser={authUser}
      buildPayload={(row) => ({
        itemClassId: Number(row.itemClassId),
        itemCode: row.itemCode,
        itemName: row.itemName,
        barcode: row.barcode || null,
        unit: row.unit,
        purchasePrice: toNumber(row.purchasePrice),
        salesPrice: toNumber(row.salesPrice),
        useYn: row.useYn ?? 'Y',
      })}
      columns={itemColumns}
      createDefaults={{
        itemClassId: defaultClass?.id ?? '',
        itemClassCode: defaultClass?.itemClassCode ?? '',
        itemClassName: defaultClass?.itemClassName ?? '',
        unit: 'EA',
        purchasePrice: 0,
        salesPrice: 0,
        useYn: 'Y',
      }}
      data={catalog.items}
      detailFields={[
        { name: 'itemClassCode', label: '품목 클래스', section: '기본 정보', readOnly: true, required: true, actionLabel: '조회', actionDisabledOnEdit: true },
        { name: 'itemClassName', label: '클래스명', section: '기본 정보', readOnly: true, required: true },
        { name: 'itemCode', label: '품목 코드', section: '기본 정보', required: true, readOnlyOnEdit: true },
        { name: 'itemName', label: '품목명', section: '기본 정보', required: true },
        { name: 'barcode', label: '바코드', section: '기본 정보' },
        { name: 'unit', label: '단위', section: '상세 정보', required: true },
        { name: 'purchasePrice', label: '매입가', section: '상세 정보', type: 'number', required: true },
        { name: 'salesPrice', label: '판매가', section: '상세 정보', type: 'number', required: true },
        { name: 'useYn', label: '사용 여부', section: '상세 정보', type: 'select', options: useYnOptions, required: true },
      ]}
      detailTabLabel="상세 목록"
      endpoint="/api/items"
      hideHeader
      keepDetailAfterSave
      listTabLabel="품목 목록"
      onRefresh={onRefresh}
      page={{ ...page, eyebrow: '기준정보', title: '품목' }}
      detailFieldAction={(field, values, context) => {
        if (field.name !== 'itemClassCode') {
          return
        }

        if (!context.isCreateMode) {
          context.setMessage('수정 중에는 품목 클래스를 변경할 수 없습니다.')
          return
        }

        lookups.openItemClass({ ...context, values })
      }}
      searchFieldAction={(field, searchParams, searchContext) => {
        if (field.name === 'itemClassLookup') {
          lookups.openItemClass({ mode: 'search', setSearchParams: searchContext.setSearchParams })
        }
      }}
      searchFields={[
        { name: 'itemCode', label: '품목 코드' },
        { name: 'itemName', label: '품목명' },
        { name: 'itemClassLookup', label: '품목 클래스', type: 'lookup', codeField: 'itemClassCode', nameField: 'itemClassName' },
        { name: 'useYn', label: '사용 여부', type: 'select', options: useYnOptions },
      ]}
    />
  )
}

function toNumber(value) {
  if (value === undefined || value === null || value === '') return 0
  return Number(value)
}
