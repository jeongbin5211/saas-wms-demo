import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '청구 번호', name: 'billNo', width: 170 },
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '청구 상태', name: 'billStatusSubCode', width: 120, align: 'center' },
  { header: '청구일', name: 'billDate', width: 120, align: 'center' },
  { header: '청구 금액', name: 'totalAmount', width: 120, align: 'right' },
]

const searchFields = [
  { name: 'billDate', label: '청구일', type: 'date' },
  { name: 'billNo', label: '청구 번호' },
  { name: 'salesOrderNo', label: '판매주문 번호' },
  { name: 'billStatusSubCode', label: '상태' },
]

const detailFields = [
  { name: 'billNo', label: '청구 번호' },
  { name: 'salesOrderNo', label: '판매주문 번호' },
  { name: 'billStatusSubCode', label: '청구 상태' },
  { name: 'billDate', label: '청구일', type: 'date' },
  { name: 'totalAmount', label: '청구 금액', type: 'number' },
]

export function BillingPage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.billingFlow.bills}
      detailFields={detailFields}
      endpoint="/api/bills"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
