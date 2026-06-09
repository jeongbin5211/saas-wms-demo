import { useState } from 'react'
import { WmsGrid } from '../../components/common/WmsGrid.jsx'
import { fetchWithAuth } from '../../router/session.js'
import { StandardWorkPage } from '../StandardWorkPage.jsx'

// ── 구매반품 ──
const purchaseColumns = [
  { header: '구매반품 번호', name: 'purchaseReturnNo', width: 180 },
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '반품 상태', name: 'returnStatusSubCode', width: 120, align: 'center' },
  { header: '반품일', name: 'returnDate', width: 120, align: 'center' },
  { header: '사유', name: 'reason', width: 260 },
]

const purchaseDetailFields = [
  { name: 'purchaseReturnNo', label: '구매반품 번호', readOnly: true },
  { name: 'purchaseOrderNo', label: '구매주문 번호', readOnly: true },
  { name: 'returnStatusSubCode', label: '반품 상태', readOnly: true },
  { name: 'returnDate', label: '반품일', type: 'date', readOnly: true },
  { name: 'reason', label: '사유', wide: true, readOnly: true },
]

const purchaseDetailColumns = [
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: 'Location', name: 'locationCode', width: 150 },
  { header: '반품 수량', name: 'returnQuantity', width: 110, align: 'right' },
]

// ── 판매반품 ──
const salesColumns = [
  { header: '판매반품 번호', name: 'salesReturnNo', width: 180 },
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '반품 상태', name: 'returnStatusSubCode', width: 120, align: 'center' },
  { header: '반품일', name: 'returnDate', width: 120, align: 'center' },
  { header: '사유', name: 'reason', width: 260 },
]

const salesDetailFields = [
  { name: 'salesReturnNo', label: '판매반품 번호', readOnly: true },
  { name: 'salesOrderNo', label: '판매주문 번호', readOnly: true },
  { name: 'returnStatusSubCode', label: '반품 상태', readOnly: true },
  { name: 'returnDate', label: '반품일', type: 'date', readOnly: true },
  { name: 'reason', label: '사유', wide: true, readOnly: true },
]

const salesDetailColumns = [
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: 'Location', name: 'locationCode', width: 150 },
  { header: '반품 수량', name: 'returnQuantity', width: 110, align: 'right' },
]

const returnSearchFields = [
  { name: 'returnDate', label: '반품일', type: 'date' },
  { name: 'returnStatusSubCode', label: '상태' },
]

export function ReturnsPage({ authUser, data, onRefresh, page }) {
  const [activeType, setActiveType] = useState('purchase')
  const isPurchase = activeType === 'purchase'

  const makePurchaseDetailAfter = ({ selectedRow }) => {
    const rows = selectedRow
      ? data.returnFlow.purchaseReturnDetails.filter((d) => d.purchaseReturnId === selectedRow.id)
      : []
    return (
      <section className="detail-grid-section">
        <div className="detail-section-title">
          <strong>반품 품목</strong>
          <span>선택한 구매반품 건의 품목별 반품 수량입니다.</span>
        </div>
        <WmsGrid columns={purchaseDetailColumns} data={rows} minBodyHeight={220} rowHeaders={['rowNum']} />
      </section>
    )
  }

  const makeSalesDetailAfter = ({ selectedRow }) => {
    const rows = selectedRow
      ? data.returnFlow.salesReturnDetails.filter((d) => d.salesReturnId === selectedRow.id)
      : []
    return (
      <section className="detail-grid-section">
        <div className="detail-section-title">
          <strong>반품 품목</strong>
          <span>선택한 판매반품 건의 품목별 반품 수량입니다.</span>
        </div>
        <WmsGrid columns={salesDetailColumns} data={rows} minBodyHeight={220} rowHeaders={['rowNum']} />
      </section>
    )
  }

  const makeConfirmAction = (apiPath, statusField, confirmedStatus, label) =>
    ({ canEdit, refresh, selectedRow, setGridData, setMessage }) => {
      const isWaiting = selectedRow?.[statusField] === 'WAITING'

      const handleConfirm = async () => {
        if (!selectedRow) { setMessage('확정할 반품 건을 선택하세요.'); return }
        if (!canEdit) { setMessage('반품 확정을 처리할 수 없는 권한입니다.'); return }

        try {
          const response = await fetchWithAuth(`${apiPath}/${selectedRow.id}/confirm`, { method: 'POST' })
          if (!response.ok) throw new Error('confirm-failed')
          setMessage(`${label}이 완료되었습니다. 재고가 반영되었습니다.`)
          await refresh?.()
          setGridData(null)
        } catch {
          setMessage(`${label}에 실패했습니다.`)
        }
      }

      return (
        <button type="button" className="primary-button" disabled={!isWaiting || !canEdit} onClick={handleConfirm}>
          {label}
        </button>
      )
    }

  return (
    <section className="standard-page">
      <div className="work-page-header">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h2>{page.title}</h2>
          <span>{page.description}</span>
        </div>
        <div className="return-type-toggle">
          <button
            type="button"
            className={activeType === 'purchase' ? 'primary-button' : 'icon-text-button'}
            onClick={() => setActiveType('purchase')}
          >
            구매반품
          </button>
          <button
            type="button"
            className={activeType === 'sales' ? 'primary-button' : 'icon-text-button'}
            onClick={() => setActiveType('sales')}
          >
            판매반품
          </button>
        </div>
      </div>

      {isPurchase ? (
        <StandardWorkPage
          key="purchase"
          allowDelete={false}
          allowNew={false}
          allowSave={false}
          hideHeader
          authUser={authUser}
          columns={purchaseColumns}
          data={data.returnFlow.purchaseReturns}
          detailActions={makeConfirmAction('/api/purchase-returns', 'returnStatusSubCode', 'SHIPPED', '구매반품 확정')}
          detailAfter={makePurchaseDetailAfter}
          detailFields={purchaseDetailFields}
          endpoint="/api/purchase-returns"
          onRefresh={onRefresh}
          page={{ ...page, title: '구매반품', eyebrow: '', description: '' }}
          searchFields={returnSearchFields}
        />
      ) : (
        <StandardWorkPage
          key="sales"
          allowDelete={false}
          allowNew={false}
          allowSave={false}
          hideHeader
          authUser={authUser}
          columns={salesColumns}
          data={data.returnFlow.salesReturns}
          detailActions={makeConfirmAction('/api/sales-returns', 'returnStatusSubCode', 'RECEIVED', '판매반품 확정')}
          detailAfter={makeSalesDetailAfter}
          detailFields={salesDetailFields}
          endpoint="/api/sales-returns"
          onRefresh={onRefresh}
          page={{ ...page, title: '판매반품', eyebrow: '', description: '' }}
          searchFields={returnSearchFields}
        />
      )}
    </section>
  )
}
