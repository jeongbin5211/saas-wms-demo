import { Search } from 'lucide-react'

export function DetailForm({
  actionsDisabled = false,
  extraActions,
  fields = [],
  modeLabel,
  onCancel,
  onDelete,
  onFieldAction,
  onFieldChange,
  onSave,
  row,
  isCreateMode = row == null,
  showActions = true,
  showSave = true,
}) {
  const values = row ?? {}
  const sections = groupFieldsBySection(fields)

  return (
    <form className="detail-form" onSubmit={onSave}>
      <div className="detail-form-heading">
        <div>
          <strong>{modeLabel ?? (isCreateMode ? '신규 등록' : '상세')}</strong>
          <span>{isCreateMode ? '새 데이터를 입력합니다.' : '선택한 행의 상세 정보를 확인합니다.'}</span>
        </div>
      </div>

      <div className="detail-form-sections">
        {sections.map((section) => (
          <section className="detail-form-section" key={section.title}>
            <div className="detail-section-title">
              <strong>{section.title}</strong>
            </div>
            <div className="detail-form-grid">
              {section.fields.map((field) => (
                <label className={field.wide ? 'wide detail-field' : 'detail-field'} key={field.name}>
                  <span>
                    {field.required ? <em>*</em> : null}
                    {field.label}
                  </span>
                  <div className={field.actionLabel ? 'detail-control-row has-action' : 'detail-control-row'}>
                    {field.type === 'select' ? (
                      <select
                        disabled={field.readOnly}
                        value={values[field.name] ?? ''}
                        onChange={(event) => onFieldChange(field.name, event.target.value)}
                      >
                        <option value="" />
                        {(field.options ?? []).map((option) => (
                          <option key={option.value ?? option} value={option.value ?? option}>
                            {option.label ?? option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        disabled={field.readOnly}
                        placeholder={field.placeholder ?? ''}
                        type={field.type ?? 'text'}
                        value={values[field.name] ?? ''}
                        onChange={(event) => onFieldChange(field.name, event.target.value)}
                      />
                    )}
                    {field.actionLabel ? (
                      <button
                        type="button"
                        className="field-lookup-button"
                        onClick={() => onFieldAction?.(field, values)}
                      >
                        <Search size={14} />
                        <span>{field.actionLabel}</span>
                      </button>
                    ) : null}
                  </div>
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>

      {showActions ? (
        <div className="detail-form-actions">
          {showSave ? (
            <button type="submit" className="primary-button" disabled={actionsDisabled}>
              저장
            </button>
          ) : null}
          {extraActions}
          <button type="button" className="icon-text-button" onClick={onCancel}>
            취소
          </button>
          {!isCreateMode && onDelete ? (
            <button type="button" className="danger-button" disabled={actionsDisabled} onClick={onDelete}>
              삭제
            </button>
          ) : null}
        </div>
      ) : null}
    </form>
  )
}

function groupFieldsBySection(fields) {
  const sections = []

  for (const field of fields) {
    const title = field.section ?? '상세 정보'
    let section = sections.find((candidate) => candidate.title === title)

    if (!section) {
      section = { title, fields: [] }
      sections.push(section)
    }

    section.fields.push(field)
  }

  return sections
}
