import { WmsGrid } from '../../components/common/WmsGrid.jsx'
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
  { name: 'billNo', label: '청구 번호', readOnly: true },
  { name: 'salesOrderNo', label: '판매주문 번호', readOnly: true },
  { name: 'billStatusSubCode', label: '청구 상태', readOnly: true },
  { name: 'billDate', label: '청구일', type: 'date', readOnly: true },
  { name: 'totalAmount', label: '청구 금액', type: 'number', readOnly: true },
]

const detailColumns = [
  { header: '청구 번호', name: 'billNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: '청구 수량', name: 'billQuantity', width: 110, align: 'right' },
  { header: '단가', name: 'unitPrice', width: 110, align: 'right' },
  { header: '금액', name: 'amount', width: 120, align: 'right' },
]

export function BillingPage({ authUser, data, onRefresh, page }) {
  const detailAfter = ({ selectedRow }) => {
    const rows = selectedRow
      ? data.billingFlow.billDetails.filter((detail) => detail.billId === selectedRow.id)
      : []

    return (
      <section className="detail-grid-section">
        <div className="detail-section-title">
          <strong>청구 품목</strong>
          <span>출고 확정 후 자동 생성된 청구 라인입니다.</span>
        </div>
        <WmsGrid columns={detailColumns} data={rows} minBodyHeight={260} rowHeaders={['rowNum']} />
      </section>
    )
  }

  return (
    <StandardWorkPage
      allowDelete={false}
      allowNew={false}
      allowSave={false}
      authUser={authUser}
      columns={columns}
      data={data.billingFlow.bills}
      detailAfter={detailAfter}
      detailFields={detailFields}
      endpoint="/api/bills"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
