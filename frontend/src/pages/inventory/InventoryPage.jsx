import { StandardWorkPage } from '../StandardWorkPage.jsx'

const inventoryColumns = [
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '로케이션', name: 'locationCode', width: 140, align: 'center' },
  { header: '현재고', name: 'quantity', width: 110, align: 'right' },
  { header: '할당 수량', name: 'allocatedQuantity', width: 110, align: 'right' },
  { header: '가용 재고', name: 'availableQuantity', width: 110, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const fields = [
  { name: 'itemCode', label: '품목 코드' },
  { name: 'itemName', label: '품목명' },
  { name: 'locationCode', label: '로케이션' },
]

const detailFields = [
  { name: 'itemCode', label: '품목 코드', readOnly: true },
  { name: 'itemName', label: '품목명', readOnly: true },
  { name: 'locationCode', label: '로케이션', readOnly: true },
  { name: 'quantity', label: '현재고', type: 'number', readOnly: true },
  { name: 'allocatedQuantity', label: '할당 수량', type: 'number', readOnly: true },
  { name: 'availableQuantity', label: '가용 재고', type: 'number', readOnly: true },
]

export function InventoryPage({ authUser, data, onRefresh, page }) {
  return (
    <StandardWorkPage
      authUser={authUser}
      columns={inventoryColumns}
      data={data.inventories}
      detailFields={detailFields}
      endpoint="/api/inventories"
      onRefresh={onRefresh}
      page={page}
      searchFields={fields}
    />
  )
}
