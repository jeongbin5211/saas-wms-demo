import { Search } from 'lucide-react'

export function SearchPanel({ fields = [], onChange, onReset, onSearch, searchParams }) {
  const updateValue = (name, value) => {
    onChange({
      ...searchParams,
      [name]: value,
    })
  }

  return (
    <div className="search-panel">
      <div className="search-panel-fields">
        {fields.map((field) => (
          <label className={field.wide ? 'wide' : ''} key={field.name}>
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
  )
}
