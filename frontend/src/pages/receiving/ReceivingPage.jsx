import { WmsGrid } from '../../components/common/WmsGrid.jsx'
import { fetchWithAuth } from '../../router/session.js'
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
  { name: 'receivingNo', label: '입고 번호', readOnly: true },
  { name: 'purchaseOrderNo', label: '구매주문 번호', readOnly: true },
  { name: 'receivingStatusSubCode', label: '입고 상태', readOnly: true },
  { name: 'receivingDate', label: '입고일', type: 'date', readOnly: true },
]

const detailColumns = [
  { header: '입고 번호', name: 'receivingNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: 'Location 코드', name: 'locationCode', width: 170 },
  { header: '입고 수량', name: 'receivedQuantity', width: 110, align: 'right' },
]

export function ReceivingPage({ authUser, data, onRefresh, page }) {
  const detailAfter = ({ selectedRow }) => {
    const rows = selectedRow
      ? data.inboundFlow.receivingDetails.filter((detail) => detail.receivingId === selectedRow.id)
      : []

    return (
      <section className="detail-grid-section">
        <div className="detail-section-title">
          <strong>입고 품목</strong>
          <span>선택한 입고 건의 품목과 로케이션별 입고 수량입니다.</span>
        </div>
        <WmsGrid columns={detailColumns} data={rows} minBodyHeight={260} rowHeaders={['rowNum']} />
      </section>
    )
  }

  const detailActions = ({ canEdit, refresh, selectedRow, setGridData, setMessage }) => {
    const isWaiting = selectedRow?.receivingStatusSubCode === 'WAITING'

    const handleConfirm = async () => {
      if (!selectedRow) {
        setMessage('확정할 입고 건을 선택하세요.')
        return
      }

      if (!canEdit) {
        setMessage('입고 확정을 처리할 수 없는 권한입니다.')
        return
      }

      try {
        const response = await fetchWithAuth(`/api/receivings/${selectedRow.id}/confirm`, {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('confirm-failed')
        }

        setMessage('입고 확정이 완료되었습니다. 재고가 반영되었습니다.')
        await refresh?.()
        setGridData(null)
      } catch {
        setMessage('입고 확정에 실패했습니다.')
      }
    }

    return (
      <button type="button" className="primary-button" disabled={!isWaiting || !canEdit} onClick={handleConfirm}>
        입고확정
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
      data={data.inboundFlow.receivings}
      detailActions={detailActions}
      detailAfter={detailAfter}
      detailFields={detailFields}
      endpoint="/api/receivings"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
