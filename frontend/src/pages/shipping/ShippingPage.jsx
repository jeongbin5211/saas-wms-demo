import { WmsGrid } from '../../components/common/WmsGrid.jsx'
import { fetchWithAuth } from '../../router/session.js'
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
  { name: 'shippingNo', label: '출고 번호', readOnly: true },
  { name: 'salesOrderNo', label: '판매주문 번호', readOnly: true },
  { name: 'shippingStatusSubCode', label: '출고 상태', readOnly: true },
  { name: 'shippingDate', label: '출고일', type: 'date', readOnly: true },
]

const detailColumns = [
  { header: '출고 번호', name: 'shippingNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: 'Location 코드', name: 'locationCode', width: 170 },
  { header: '출고 수량', name: 'shippedQuantity', width: 110, align: 'right' },
]

export function ShippingPage({ authUser, data, onRefresh, page }) {
  const detailAfter = ({ selectedRow }) => {
    const rows = selectedRow
      ? data.outboundFlow.shippingDetails.filter((detail) => detail.shippingId === selectedRow.id)
      : []

    return (
      <section className="detail-grid-section">
        <div className="detail-section-title">
          <strong>출고 품목</strong>
          <span>선택한 출고 건의 품목과 로케이션별 출고 수량입니다.</span>
        </div>
        <WmsGrid columns={detailColumns} data={rows} minBodyHeight={260} rowHeaders={['rowNum']} />
      </section>
    )
  }

  const detailActions = ({ canEdit, refresh, selectedRow, setGridData, setMessage }) => {
    const isWaiting = selectedRow?.shippingStatusSubCode === 'WAITING'

    const handleConfirm = async () => {
      if (!selectedRow) {
        setMessage('확정할 출고 건을 선택하세요.')
        return
      }

      if (!canEdit) {
        setMessage('출고 확정을 처리할 수 없는 권한입니다.')
        return
      }

      try {
        const response = await fetchWithAuth(`/api/shippings/${selectedRow.id}/confirm`, {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('confirm-failed')
        }

        setMessage('출고 확정이 완료되었습니다. 재고 차감과 청구서 생성이 반영되었습니다.')
        await refresh?.()
        setGridData(null)
      } catch {
        setMessage('출고 확정에 실패했습니다.')
      }
    }

    return (
      <button type="button" className="primary-button" disabled={!isWaiting || !canEdit} onClick={handleConfirm}>
        출고확정
      </button>
    )
  }

  return (
    <StandardWorkPage
      allowDelete={false}
      allowNew={false}
      allowSave={false}
      authUser={authUser}
      columns={columns}
      data={data.outboundFlow.shippings}
      detailActions={detailActions}
      detailAfter={detailAfter}
      detailFields={detailFields}
      endpoint="/api/shippings"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
