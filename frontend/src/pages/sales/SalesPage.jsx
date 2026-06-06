import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '고객사', name: 'customerAccountName', width: 180 },
  { header: '주문 상태', name: 'orderStatusSubCode', width: 120, align: 'center' },
  { header: '주문일', name: 'orderDate', width: 120, align: 'center' },
  { header: '비고', name: 'note', width: 280 },
]

const searchFields = [
  { name: 'orderDate', label: '주문일', type: 'date' },
  { name: 'salesOrderNo', label: '주문 번호' },
  { name: 'customerAccountName', label: '고객사' },
  { name: 'orderStatusSubCode', label: '상태' },
]

export function SalesPage({ authUser, data, onRefresh, page }) {
  const accountOptions = data.accounts
    .filter((account) => account.useYn === 'Y' && account.id !== authUser?.accountId)
    .map((account) => ({
      label: `${account.accountName} (${account.accountCode})`,
      value: account.id,
    }))

  const detailFields = [
    { name: 'salesOrderNo', label: '판매주문 번호' },
    { name: 'customerAccountId', label: '고객사', type: 'select', options: accountOptions },
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
    customerAccountId: Number(row.customerAccountId),
    salesOrderNo: row.salesOrderNo,
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
      data={data.outboundFlow.salesOrders}
      detailFields={detailFields}
      endpoint="/api/sales-orders"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
