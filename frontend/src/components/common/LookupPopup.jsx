import { X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { matchesSearchFields } from '../../utils/lookupSearch.js'
import { WmsGrid } from './WmsGrid.jsx'

export function LookupPopupFrame({
  actions,
  children,
  className = '',
  onClose,
  title,
  wide = false,
}) {
  const classes = [
    'lookup-modal',
    wide ? 'wide' : '',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className="lookup-modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className={classes} role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
        <header className="lookup-modal-header">
          <strong>{title}</strong>
          <div className="lookup-modal-header-actions">
            {actions}
            <button type="button" className="icon-only-button" aria-label="닫기" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </header>
        {children}
      </section>
    </div>
  )
}

export function LookupSearchPanel({ fields, values, onChange, onSubmit }) {
  return (
    <form className="lookup-search-panel" onSubmit={(event) => { event.preventDefault(); onSubmit?.() }}>
      {fields.map((field) => (
        <div className="lookup-search-row" key={field.name}>
          <span>{field.label}</span>
          <input
            placeholder={field.placeholder ?? field.label}
            value={values[field.name] ?? ''}
            onChange={(event) => onChange(field.name, event.target.value)}
          />
        </div>
      ))}
    </form>
  )
}

export function CommonGridLookupModal({
  columns,
  data,
  emptyMessage,
  initialFilters = {},
  onClose,
  onSelect,
  open,
  rowHeaders = ['rowNum'],
  searchFields,
  title,
  wide = false,
}) {
  if (!open) return null

  return (
    <CommonGridLookupModalContent
      key={JSON.stringify(initialFilters)}
      columns={columns}
      data={data}
      emptyMessage={emptyMessage}
      initialFilters={initialFilters}
      onClose={onClose}
      onSelect={onSelect}
      rowHeaders={rowHeaders}
      searchFields={searchFields}
      title={title}
      wide={wide}
    />
  )
}

function CommonGridLookupModalContent({
  columns,
  data,
  emptyMessage,
  initialFilters,
  onClose,
  onSelect,
  rowHeaders,
  searchFields,
  title,
  wide,
}) {
  const [draftFilters, setDraftFilters] = useState(initialFilters)
  const [appliedFilters, setAppliedFilters] = useState(initialFilters)
  const filteredData = useMemo(() => (
    data.filter((row) => matchesSearchFields(row, searchFields, appliedFilters))
  ), [data, appliedFilters, searchFields])

  const handleFilterChange = (name, value) => {
    setDraftFilters((current) => ({ ...current, [name]: value }))
  }

  return (
    <LookupPopupFrame
      title={title}
      wide={wide}
      onClose={onClose}
      actions={(
        <button type="button" className="primary-button compact" onClick={() => setAppliedFilters(draftFilters)}>
          검색
        </button>
      )}
    >
      <LookupSearchPanel
        fields={searchFields}
        values={draftFilters}
        onChange={handleFilterChange}
        onSubmit={() => setAppliedFilters(draftFilters)}
      />
      <div className="lookup-modal-grid">
        {filteredData.length > 0 ? (
          <WmsGrid
            columns={columns}
            data={filteredData}
            includeAuditColumns={false}
            minBodyHeight={360}
            onRowDoubleClick={onSelect}
            rowHeaders={rowHeaders}
          />
        ) : (
          <div className="lookup-empty-cell">{emptyMessage}</div>
        )}
      </div>
    </LookupPopupFrame>
  )
}
