import { Search } from 'lucide-react'

export function SearchPanel({ fields = [], onChange, onFieldAction, onReset, onSearch, searchParams, title }) {
  const updateValue = (name, value) => {
    onChange({
      ...searchParams,
      [name]: value,
    })
  }

  return (
    <section className="filter-card">
      <div className="filter-card-header">
        <div className="filter-card-title">
          <strong>{title}</strong>
        </div>
        <div className="search-panel-actions">
          <button type="button" className="primary-button" onClick={onSearch}>
            <Search size={16} />
            검색
          </button>
          <button type="button" className="danger-button" onClick={onReset}>
            조건 초기화
          </button>
        </div>
      </div>
      <div className="search-panel">
        <div className="search-panel-fields">
          {fields.map((field) => (
            <label className={field.wide || field.type === 'lookup' ? 'wide' : ''} key={field.name}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select value={searchParams[field.name] ?? ''} onChange={(event) => updateValue(field.name, event.target.value)}>
                  <option value="" />
                  {(field.options ?? []).map((option) => (
                    <option key={option.value ?? option} value={option.value ?? option}>
                      {option.label ?? option}
                    </option>
                  ))}
                </select>
              ) : field.type === 'lookup' ? (
                <div className="search-field-with-action">
                  <input
                    placeholder={field.codePlaceholder ?? '코드'}
                    value={searchParams[field.codeField] ?? ''}
                    onChange={(event) => updateValue(field.codeField, event.target.value)}
                  />
                  <input
                    placeholder={field.namePlaceholder ?? '이름'}
                    value={searchParams[field.nameField] ?? ''}
                    onChange={(event) => updateValue(field.nameField, event.target.value)}
                  />
                  <button type="button" className="field-lookup-button" aria-label={`${field.label} 조회`} onClick={() => onFieldAction?.(field)}>
                    <Search size={15} />
                  </button>
                </div>
              ) : (
                <input
                  placeholder={field.placeholder ?? ''}
                  type={field.type ?? 'text'}
                  value={searchParams[field.name] ?? ''}
                  onChange={(event) => updateValue(field.name, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>
      </div>
    </section>
  )
}
