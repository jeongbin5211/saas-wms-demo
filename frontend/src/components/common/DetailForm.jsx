export function DetailForm({
  actionsDisabled = false,
  extraActions,
  fields = [],
  modeLabel,
  onCancel,
  onDelete,
  onFieldChange,
  onSave,
  row,
  isCreateMode = row == null,
  showSave = true,
}) {
  const values = row ?? {}

  return (
    <form className="detail-form" onSubmit={onSave}>
      <div className="detail-form-heading">
        <div>
          <strong>{modeLabel ?? (isCreateMode ? '신규 등록' : '상세')}</strong>
          <span>{isCreateMode ? '새 데이터를 입력합니다.' : '선택한 행의 상세 정보를 확인합니다.'}</span>
        </div>
      </div>

      <div className="detail-form-grid">
        {fields.map((field) => (
          <label className={field.wide ? 'wide' : ''} key={field.name}>
            <span>{field.label}</span>
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
          </label>
        ))}
      </div>

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
    </form>
  )
}
