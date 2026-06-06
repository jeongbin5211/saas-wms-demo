import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '공급처', name: 'supplierAccountName', width: 180 },
  { header: '주문 상태', name: 'orderStatusSubCode', width: 120, align: 'center' },
  { header: '주문일', name: 'orderDate', width: 120, align: 'center' },
  { header: '비고', name: 'note', width: 280 },
]

const searchFields = [
  { name: 'orderDate', label: '주문일', type: 'date' },
  { name: 'purchaseOrderNo', label: '주문 번호' },
  { name: 'supplierAccountName', label: '공급처' },
  { name: 'orderStatusSubCode', label: '상태' },
]

export function PurchasePage({ authUser, data, onRefresh, page }) {
  const accountOptions = data.accounts
    .filter((account) => account.useYn === 'Y' && account.id !== authUser?.accountId)
    .map((account) => ({
      label: `${account.accountName} (${account.accountCode})`,
      value: account.id,
    }))

  const detailFields = [
    { name: 'purchaseOrderNo', label: '구매주문 번호' },
    { name: 'supplierAccountId', label: '공급처', type: 'select', options: accountOptions },
    { name: 'orderStatusSubCode', label: '주문 상태', readOnly: true },
    { name: 'orderDate', label: '주문일', type: 'date' },
    { name: 'note', label: '비고', wide: true },
  ]

  const createDefaults = () => ({
    accountId: authUser?.accountId,
    orderStatusSubCode: 'WAITING',
    orderDate: new Date().toISOString().slice(0, 10),
  })

  const buildPayload = (row) => ({
    accountId: row.accountId ?? authUser?.accountId,
    supplierAccountId: Number(row.supplierAccountId),
    purchaseOrderNo: row.purchaseOrderNo,
    orderDate: row.orderDate,
    note: row.note ?? '',
  })

  return (
    <StandardWorkPage
      allowDelete={false}
      authUser={authUser}
      buildPayload={buildPayload}
      columns={columns}
      createDefaults={createDefaults}
      data={data.inboundFlow.purchaseOrders}
      detailFields={detailFields}
      endpoint="/api/purchase-orders"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
