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

const detailFields = [
  { name: 'salesOrderNo', label: '판매주문 번호' },
  { name: 'customerAccountName', label: '고객사' },
  { name: 'orderStatusSubCode', label: '주문 상태' },
  { name: 'orderDate', label: '주문일', type: 'date' },
  { name: 'note', label: '비고', wide: true },
]

export function SalesPage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.outboundFlow.salesOrders}
      detailFields={detailFields}
      endpoint="/api/sales-orders"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
