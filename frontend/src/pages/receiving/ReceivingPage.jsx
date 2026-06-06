import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '입고 번호', name: 'receivingNo', width: 170 },
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '입고 상태', name: 'receivingStatusSubCode', width: 120, align: 'center' },
  { header: '입고일', name: 'receivingDate', width: 120, align: 'center' },
]

const searchFields = [
  { name: 'receivingDate', label: '입고일', type: 'date' },
  { name: 'receivingNo', label: '입고 번호' },
  { name: 'purchaseOrderNo', label: '구매주문 번호' },
  { name: 'receivingStatusSubCode', label: '상태' },
]

const detailFields = [
  { name: 'receivingNo', label: '입고 번호' },
  { name: 'purchaseOrderNo', label: '구매주문 번호' },
  { name: 'receivingStatusSubCode', label: '입고 상태' },
  { name: 'receivingDate', label: '입고일', type: 'date' },
]

export function ReceivingPage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.inboundFlow.receivings}
      detailFields={detailFields}
      endpoint="/api/receivings"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
