import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '반품 번호', name: 'salesReturnNo', width: 170 },
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '반품 상태', name: 'returnStatusSubCode', width: 120, align: 'center' },
  { header: '반품일', name: 'returnDate', width: 120, align: 'center' },
  { header: '사유', name: 'reason', width: 280 },
]

const searchFields = [
  { name: 'returnDate', label: '반품일', type: 'date' },
  { name: 'salesReturnNo', label: '반품 번호' },
  { name: 'salesOrderNo', label: '판매주문 번호' },
  { name: 'returnStatusSubCode', label: '상태' },
]

const detailFields = [
  { name: 'salesReturnNo', label: '반품 번호' },
  { name: 'salesOrderNo', label: '판매주문 번호' },
  { name: 'returnStatusSubCode', label: '반품 상태' },
  { name: 'returnDate', label: '반품일', type: 'date' },
  { name: 'reason', label: '사유', wide: true },
]

export function ReturnsPage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.returnFlow.salesReturns}
      detailFields={detailFields}
      endpoint="/api/sales-returns"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
