import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '출고 번호', name: 'shippingNo', width: 170 },
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '출고 상태', name: 'shippingStatusSubCode', width: 120, align: 'center' },
  { header: '출고일', name: 'shippingDate', width: 120, align: 'center' },
]

const searchFields = [
  { name: 'shippingDate', label: '출고일', type: 'date' },
  { name: 'shippingNo', label: '출고 번호' },
  { name: 'salesOrderNo', label: '판매주문 번호' },
  { name: 'shippingStatusSubCode', label: '상태' },
]

const detailFields = [
  { name: 'shippingNo', label: '출고 번호' },
  { name: 'salesOrderNo', label: '판매주문 번호' },
  { name: 'shippingStatusSubCode', label: '출고 상태' },
  { name: 'shippingDate', label: '출고일', type: 'date' },
]

export function ShippingPage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.outboundFlow.shippings}
      detailFields={detailFields}
      endpoint="/api/shippings"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
