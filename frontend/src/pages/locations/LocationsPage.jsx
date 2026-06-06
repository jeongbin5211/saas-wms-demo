import { StandardWorkPage } from '../StandardWorkPage.jsx'

const columns = [
  { header: 'Location 코드', name: 'locationCode', width: 170 },
  { header: 'Location명', name: 'locationName', width: 230 },
  { header: 'Zone ID', name: 'zoneId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const searchFields = [
  { name: 'locationCode', label: 'Location 코드' },
  { name: 'locationName', label: 'Location명' },
  { name: 'zoneId', label: 'Zone ID' },
]

export function LocationsPage({ authUser, data, onRefresh, page }) {
  const zoneOptions = data.locationCatalog.zones.map((zone) => ({
    label: zone.zoneCode,
    value: zone.id,
  }))

  const detailFields = [
    { name: 'zoneId', label: 'Zone', type: 'select', options: zoneOptions },
    { name: 'locationCode', label: 'Location 코드' },
    { name: 'locationName', label: 'Location명' },
    { name: 'useYn', label: '사용 여부', readOnly: true },
  ]

  return (
    <StandardWorkPage
      authUser={authUser}
      columns={columns}
      data={data.locationCatalog.locations}
      detailFields={detailFields}
      endpoint="/api/locations"
      onRefresh={onRefresh}
      page={page}
      searchFields={searchFields}
    />
  )
}
