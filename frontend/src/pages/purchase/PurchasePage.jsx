import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '공급사', name: 'supplierAccountName', width: 180 },
  { header: '주문 상태', name: 'orderStatusSubCode', width: 120, align: 'center' },
  { header: '주문일', name: 'orderDate', width: 120, align: 'center' },
  { header: '비고', name: 'note', width: 280 },
]

const searchFields = [
  { name: 'orderDate', label: '주문일', type: 'date' },
  { name: 'purchaseOrderNo', label: '주문 번호' },
  { name: 'supplierAccountName', label: '공급사' },
  { name: 'orderStatusSubCode', label: '상태' },
]

const detailFields = [
  { name: 'purchaseOrderNo', label: '구매주문 번호' },
  { name: 'supplierAccountName', label: '공급사' },
  { name: 'orderStatusSubCode', label: '주문 상태' },
  { name: 'orderDate', label: '주문일', type: 'date' },
  { name: 'note', label: '비고', wide: true },
]

export function PurchasePage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.inboundFlow.purchaseOrders}
      detailFields={detailFields}
      endpoint="/api/purchase-orders"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
