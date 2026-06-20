import { useState } from 'react'
import { CommonGridLookupModal } from '../../components/common/LookupPopup.jsx'
import { OrderLineEditor } from '../../components/common/OrderLineEditor.jsx'
import { StandardWorkPage } from '../StandardWorkPage.jsx'

const orderStatusOptions = [
  { label: '대기', value: 'WAITING' },
  { label: '입고완료', value: 'RECEIVED' },
  { label: '취소', value: 'CANCELED' },
]

const statusLabel = (value) => orderStatusOptions.find((option) => option.value === value)?.label ?? value

const columns = [
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '공급처', name: 'supplierAccountName', width: 180 },
  { header: '주문 상태', name: 'orderStatusSubCode', width: 110, align: 'center', formatter: ({ value }) => statusLabel(value) },
  { header: '주문일', name: 'orderDate', width: 120, align: 'center' },
  { header: '비고', name: 'note', width: 280 },
]

const searchFields = [
  { name: 'purchaseOrderNo', label: '주문 번호' },
  { name: 'orderStatusSubCode', label: '주문 상태', type: 'select', options: orderStatusOptions },
  { name: 'orderDateFrom', label: '주문일(시작)', type: 'date' },
  { name: 'orderDateTo', label: '주문일(종료)', type: 'date' },
]

const detailFields = [
  { name: 'purchaseOrderNo', label: '구매주문 번호', section: '기본 정보', required: true, readOnlyOnEdit: true },
  { name: 'supplierAccountCode', label: '공급처', section: '기본 정보', readOnly: true, required: true, actionLabel: '조회' },
  { name: 'supplierAccountName', label: '공급처명', section: '기본 정보', readOnly: true, required: true },
  { name: 'orderDate', label: '주문일', section: '기본 정보', type: 'date', required: true },
  { name: 'orderStatusSubCode', label: '주문 상태', section: '기본 정보', type: 'select', options: orderStatusOptions, readOnly: true },
  { name: 'note', label: '비고', section: '기본 정보', wide: true },
]

const accountLookupColumns = [
  { header: '거래처 코드', name: 'accountCode', width: 200 },
  { header: '거래처명', name: 'accountName', width: 320 },
  { header: '구분', name: 'accountTypeSubCode', width: 140, align: 'center' },
]

const accountLookupSearchFields = [
  { name: 'keyword', label: '거래처', placeholder: '거래처 코드 또는 거래처명', keys: ['accountCode', 'accountName'] },
]

const itemLookupColumns = [
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 240 },
  { header: '클래스', name: 'itemClassName', width: 160 },
  { header: '매입가', name: 'purchasePrice', width: 110, align: 'right' },
]

const itemLookupSearchFields = [
  { name: 'keyword', label: '품목', placeholder: '품목 코드 또는 품목명', keys: ['itemCode', 'itemName', 'itemClassName'] },
]

export function PurchasePage({ authUser, data, onRefresh, page }) {
  const [accountLookupContext, setAccountLookupContext] = useState(null)
  const [itemPicker, setItemPicker] = useState(null)

  const suppliers = data.accounts.filter((account) => account.useYn === 'Y' && account.id !== authUser?.accountId)
  const items = data.itemCatalog.items

  const enrichDraftRow = (row, { isCreateMode }) => {
    if (isCreateMode) {
      return { ...row, details: [] }
    }
    const details = data.inboundFlow.purchaseOrderDetails
      .filter((detail) => detail.purchaseOrderId === row.id)
      .map((detail) => ({
        itemId: detail.itemId,
        itemCode: detail.itemCode,
        itemName: detail.itemName,
        orderQuantity: detail.orderQuantity,
        unitPrice: detail.unitPrice,
      }))
    return { ...row, details }
  }

  const createDefaults = () => ({
    accountId: authUser?.accountId,
    orderStatusSubCode: 'WAITING',
    orderDate: new Date().toISOString().slice(0, 10),
    details: [],
  })

  const buildPayload = (row) => ({
    accountId: row.accountId ?? authUser?.accountId,
    supplierAccountId: Number(row.supplierAccountId),
    purchaseOrderNo: row.purchaseOrderNo,
    orderDate: row.orderDate,
    note: row.note ?? '',
    details: (row.details ?? [])
      .filter((line) => line.itemId)
      .map((line) => ({
        itemId: Number(line.itemId),
        orderQuantity: Number(line.orderQuantity) || 0,
        unitPrice: Number(line.unitPrice) || 0,
      })),
  })

  const detailFieldAction = (field, values, context) => {
    if (field.name === 'supplierAccountCode') {
      setAccountLookupContext(context)
    }
  }

  const detailAfter = ({ draftRow, setDraftRow }) => (
    <OrderLineEditor
      lines={draftRow?.details ?? []}
      onChange={(details) => setDraftRow({ ...(draftRow ?? {}), details })}
      onPickItem={(apply) => setItemPicker({ apply })}
      title="구매 품목"
      description="공급처에서 매입할 품목을 추가하고 수량·단가를 입력하세요."
    />
  )

  return (
    <>
      <StandardWorkPage
        allowDelete={false}
        authUser={authUser}
        buildPayload={buildPayload}
        columns={columns}
        createDefaults={createDefaults}
        data={data.inboundFlow.purchaseOrders}
        detailAfter={detailAfter}
        detailFieldAction={detailFieldAction}
        detailFields={detailFields}
        enrichDraftRow={enrichDraftRow}
        endpoint="/api/purchase-orders"
        hideHeader
        listTabLabel="구매주문 목록"
        createSuccessMessage="구매주문이 등록되었습니다."
        onRefresh={onRefresh}
        page={{ ...page, eyebrow: '운영관리', title: '구매주문' }}
        searchFields={searchFields}
      />
      <CommonGridLookupModal
        columns={accountLookupColumns}
        data={suppliers}
        emptyMessage="조회된 공급처가 없습니다."
        initialFilters={{ keyword: '' }}
        open={Boolean(accountLookupContext)}
        searchFields={accountLookupSearchFields}
        title="공급처 조회"
        onClose={() => setAccountLookupContext(null)}
        onSelect={(account) => {
          accountLookupContext?.setDraftRow((current) => ({
            ...(current ?? {}),
            supplierAccountId: account.id,
            supplierAccountCode: account.accountCode,
            supplierAccountName: account.accountName,
          }))
          setAccountLookupContext(null)
        }}
      />
      <CommonGridLookupModal
        columns={itemLookupColumns}
        data={items}
        emptyMessage="조회된 품목이 없습니다."
        initialFilters={{ keyword: '' }}
        open={Boolean(itemPicker)}
        searchFields={itemLookupSearchFields}
        title="품목 조회"
        onClose={() => setItemPicker(null)}
        onSelect={(item) => {
          itemPicker?.apply?.(item)
          setItemPicker(null)
        }}
      />
    </>
  )
}
