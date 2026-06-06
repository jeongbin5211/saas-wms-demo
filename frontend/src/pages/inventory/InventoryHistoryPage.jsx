import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '이력 유형', name: 'historyTypeSubCode', width: 130 },
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '로케이션', name: 'locationCode', width: 130, align: 'center' },
  { header: '변경 수량', name: 'changeQuantity', width: 100, align: 'right' },
  { header: '변경 전', name: 'beforeQuantity', width: 100, align: 'right' },
  { header: '변경 후', name: 'afterQuantity', width: 100, align: 'right' },
  { header: '사유', name: 'reason', width: 320 },
]

const searchFields = [
  { name: 'historyTypeSubCode', label: '이력 유형' },
  { name: 'itemCode', label: '품목 코드' },
  { name: 'locationCode', label: '로케이션' },
  { name: 'reason', label: '사유', wide: true },
]

const detailFields = [
  { name: 'historyTypeSubCode', label: '이력 유형', readOnly: true },
  { name: 'itemCode', label: '품목 코드', readOnly: true },
  { name: 'locationCode', label: '로케이션', readOnly: true },
  { name: 'changeQuantity', label: '변경 수량', readOnly: true },
  { name: 'beforeQuantity', label: '변경 전', readOnly: true },
  { name: 'afterQuantity', label: '변경 후', readOnly: true },
  { name: 'reason', label: '사유', wide: true, readOnly: true },
]

export function InventoryHistoryPage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.histories}
      detailFields={detailFields}
      endpoint="/api/inventory-histories"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
