import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: '품목 코드', name: 'itemCode', width: 190 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: '바코드', name: 'barcode', width: 150 },
  { header: '단위', name: 'unit', width: 80, align: 'center' },
  { header: '매입가', name: 'purchasePrice', width: 100, align: 'right' },
  { header: '판매가', name: 'salesPrice', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const searchFields = [
  { name: 'itemCode', label: '품목 코드' },
  { name: 'itemName', label: '품목명' },
  { name: 'barcode', label: '바코드' },
]

export function ItemsPage({ authUser, data, onRefresh, page }) {
  const itemClassOptions = data.itemCatalog.itemClasses.map((itemClass) => ({
    label: itemClass.itemClassCode,
    value: itemClass.id,
  }))

  const detailFields = [
    { name: 'itemClassId', label: '품목 클래스', type: 'select', options: itemClassOptions },
    { name: 'itemCode', label: '품목 코드' },
    { name: 'itemName', label: '품목명' },
    { name: 'barcode', label: '바코드' },
    { name: 'unit', label: '단위' },
    { name: 'purchasePrice', label: '매입가', type: 'number' },
    { name: 'salesPrice', label: '판매가', type: 'number' },
    { name: 'useYn', label: '사용 여부', readOnly: true },
  ]

  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.itemCatalog.items}
      detailFields={detailFields}
      endpoint="/api/items"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
