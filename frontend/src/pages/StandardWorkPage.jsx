import { useEffect, useState } from 'react'
import { DetailForm } from '../components/common/DetailForm.jsx'
import { SearchPanel } from '../components/common/SearchPanel.jsx'
import { TabLayout } from '../components/common/TabLayout.jsx'
import { WmsGrid } from '../components/common/WmsGrid.jsx'
import { fetchWithAuth } from '../router/session.js'

const rowNumberHeaders = ['rowNum']

export function StandardWorkPage({
  allowDelete = true,
  allowNew = true,
  allowSave = true,
  authUser,
  buildPayload,
  columns,
  createDefaults,
  createSuccessMessage,
  data,
  deleteConfirmTitle = '삭제하시겠습니까?',
  deleteLabel = '삭제',
  deleteSuccessMessage = '삭제가 완료되었습니다.',
  detailActions,
  detailAfter,
  detailFieldAction,
  detailFields,
  endpoint,
  headerActions,
  hideHeader = false,
  keepDetailAfterSave = false,
  listTabLabel,
  detailTabLabel,
  onRefresh,
  page,
  searchFields,
  saveConfirmTitle = '저장하시겠습니까?',
  title,
  updateSuccessMessage = '수정이 완료되었습니다.',
}) {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedRow, setSelectedRow] = useState(null)
  const [draftRow, setDraftRow] = useState(null)
  const [gridData, setGridData] = useState(null)
  const [searchParams, setSearchParams] = useState({})
  const [toast, setToast] = useState(null)
  const [toastShown, setToastShown] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [confirmShown, setConfirmShown] = useState(false)
  const [confirmResolver, setConfirmResolver] = useState(null)

  const canEdit = ['ADMIN', 'STAFF', 'GUEST'].includes(authUser?.roleSubCode)
  const visibleData = gridData ?? data

  useEffect(() => {
    if (!toast) return undefined

    const showTimer = window.setTimeout(() => setToastShown(true), 60)
    const hideTimer = window.setTimeout(() => dismissToast(), 3600)
    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(hideTimer)
    }
  }, [toast])

  useEffect(() => {
    if (!confirmDialog) return undefined

    const showTimer = window.setTimeout(() => setConfirmShown(true), 40)
    return () => window.clearTimeout(showTimer)
  }, [confirmDialog])

  const showToast = (nextMessage, type = 'info', title) => {
    if (!nextMessage) return

    setToastShown(false)
    setToast({
      message: nextMessage,
      title: title ?? toastTitle(type),
      type,
    })
  }

  function dismissToast() {
    setToastShown(false)
    window.setTimeout(() => setToast(null), 600)
  }

  const notify = (nextMessage, type, title) => {
    if (!nextMessage) {
      setToast(null)
      return
    }

    const resolvedType = type ?? inferToastType(nextMessage)
    showToast(nextMessage, resolvedType, title)
  }

  const requestConfirm = ({
    title = '처리하시겠습니까?',
    text = '',
    type = 'info',
  } = {}) => new Promise((resolve) => {
    setConfirmResolver(() => resolve)
    setConfirmShown(false)
    setConfirmDialog({ text, title, type })
  })

  const closeConfirm = (confirmed) => {
    setConfirmShown(false)
    window.setTimeout(() => {
      confirmResolver?.(confirmed)
      setConfirmResolver(null)
      setConfirmDialog(null)
    }, 220)
  }

  const handleDblClick = (rowData) => {
    setSelectedRow(rowData)
    setDraftRow({ ...rowData })
    setActiveTab(1)
    setToast(null)
  }

  const handleNew = () => {
    setSelectedRow(null)
    setDraftRow(typeof createDefaults === 'function' ? createDefaults() : (createDefaults ?? {}))
    setActiveTab(1)
    setToast(null)
  }

  const handleSearch = async () => {
    if (!endpoint) {
      applyClientFilter()
      notify('조회가 완료되었습니다.', 'success')
      return
    }

    try {
      const response = await fetchWithAuth(`${endpoint}?${toQueryString(searchParams)}`)

      if (!response.ok) {
        throw new Error('search-failed')
      }

      setGridData(await response.json())
      notify('조회가 완료되었습니다.', 'success')
    } catch {
      applyClientFilter()
      notify('검색 API 조건 조회를 사용할 수 없어 현재 데이터에서 필터링했습니다.', 'warning')
    }
  }

  const applyClientFilter = () => {
    const entries = Object.entries(searchParams).filter(([, value]) => String(value ?? '').trim())

    if (entries.length === 0) {
      setGridData(data)
      return
    }

    setGridData(data.filter((row) => entries.every(([, value]) => JSON.stringify(row).toLowerCase().includes(String(value).toLowerCase()))))
  }

  const handleReset = () => {
    setSearchParams({})
    setGridData(null)
    notify('검색 조건이 초기화되었습니다.', 'info')
  }

  const handleFieldChange = (name, value) => {
    setDraftRow({
      ...(draftRow ?? {}),
      [name]: value,
    })
  }

  const handleSave = async (event) => {
    event?.preventDefault()

    if (!allowSave) return
    if (!canEdit) { notify('저장할 수 없는 권한입니다.', 'error'); return }
    if (!endpoint) { notify('이 화면은 아직 저장 API가 연결되지 않았습니다.', 'warning'); return }

    const validationError = validateRequired(detailFields, draftRow)
    if (validationError) { notify(validationError, 'warning'); return }

    const confirmed = await requestConfirm({
      title: saveConfirmTitle,
      type: 'save',
    })
    if (!confirmed) return

    const method = selectedRow ? 'PUT' : 'POST'
    const saveUrl = selectedRow ? `${endpoint}/${selectedRow.id}` : endpoint
    const payload = buildPayload ? buildPayload(draftRow ?? {}, selectedRow) : (draftRow ?? {})

    try {
      const response = await fetchWithAuth(saveUrl, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorMessage = await parseApiError(response, selectedRow ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
        notify(errorMessage, 'error')
        return
      }

      const savedRow = await response.json()
      notify(selectedRow ? updateSuccessMessage : (createSuccessMessage ?? '등록이 완료되었습니다.'), 'success')
      await onRefresh?.()
      if (keepDetailAfterSave) {
        setSelectedRow(savedRow)
        setDraftRow({ ...savedRow })
        setGridData((current) => mergeSavedRow(current ?? data, savedRow))
        setActiveTab(1)
        return
      }

      setGridData(null)
      setActiveTab(0)
    } catch {
      notify(selectedRow ? '수정에 실패했습니다.' : '등록에 실패했습니다.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!canEdit) { notify('삭제할 수 없는 권한입니다.', 'error'); return }
    if (!endpoint || !selectedRow) { notify('삭제할 행을 선택하세요.', 'warning'); return }

    const confirmed = await requestConfirm({
      title: deleteConfirmTitle,
      type: 'delete',
    })
    if (!confirmed) return

    try {
      const response = await fetchWithAuth(`${endpoint}/${selectedRow.id}`, { method: 'DELETE' })

      if (!response.ok) {
        const errorMessage = await parseApiError(response, '삭제에 실패했습니다.')
        notify(errorMessage, 'error')
        return
      }

      notify(deleteSuccessMessage, 'success')
      await onRefresh?.()
      setGridData(null)
      setActiveTab(0)
    } catch {
      notify('삭제에 실패했습니다.', 'error')
    }
  }

  const actionContext = {
    canEdit,
    draftRow,
    goList: () => setActiveTab(0),
    isCreateMode: !selectedRow,
    refresh: onRefresh,
    selectedRow,
    setDraftRow,
    setGridData,
    setMessage: notify,
    confirmAction: requestConfirm,
    showToast,
  }

  const listToolbar = (
    <>
      {allowNew ? (
        <button type="button" className="primary-button" onClick={handleNew}>
          <span>신규</span>
        </button>
      ) : null}
      <button type="button" className="icon-text-button" onClick={() => exportGridToCsv(columns, visibleData, title ?? page.title)}>
        <span>Excel</span>
      </button>
      {headerActions}
    </>
  )

  const detailToolbar = (
    <>
      {allowNew ? (
        <button type="button" className="primary-button" onClick={handleNew}>
          <span>신규</span>
        </button>
      ) : null}
      {allowSave ? (
        <button type="button" className="save-button" onClick={() => handleSave()}>
          <span>저장</span>
        </button>
      ) : null}
      {detailActions?.(actionContext)}
      {selectedRow && allowDelete ? (
        <button type="button" className="danger-button" onClick={handleDelete}>
          <span>{deleteLabel}</span>
        </button>
      ) : null}
    </>
  )

  const toolbar = activeTab === 0 ? listToolbar : detailToolbar

  return (
    <section className="standard-page">
      {!hideHeader && (
        <div className="work-page-header">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h2>{title ?? page.title}</h2>
            <span>{page.description}</span>
          </div>
          <div className="work-page-actions">{toolbar}</div>
        </div>
      )}

      <ToastNotification toast={toast} shown={toastShown} onClose={dismissToast} />
      <ConfirmDialog dialog={confirmDialog} shown={confirmShown} onClose={closeConfirm} />

      <SearchPanel
        fields={searchFields}
        searchParams={searchParams}
        title={title ?? page.title}
        onChange={setSearchParams}
        onReset={handleReset}
        onSearch={handleSearch}
      />

      <TabLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        toolbar={hideHeader ? toolbar : null}
        tabs={[
          {
            label: listTabLabel ?? `${title ?? page.title} 목록`,
            content: (
              <section className="list-grid-section">
                <WmsGrid
                  columns={columns}
                  data={visibleData}
                  fillHeight
                  minBodyHeight={360}
                  rowHeaders={rowNumberHeaders}
                  onRowDoubleClick={handleDblClick}
                />
              </section>
            ),
          },
          {
            label: detailTabLabel ?? '상세 목록',
            content: (
              <>
                <DetailForm
                  extraActions={detailActions?.(actionContext)}
                  fields={detailFields}
                  isCreateMode={!selectedRow}
                  modeLabel={selectedRow ? (allowSave ? '상세 수정' : '상세') : '신규 등록'}
                  row={draftRow}
                  showActions={false}
                  showSave={allowSave}
                  onCancel={() => setActiveTab(0)}
                  onDelete={allowDelete ? handleDelete : null}
                  onFieldAction={(field, values) => detailFieldAction?.(field, values, actionContext)}
                  onFieldChange={handleFieldChange}
                  onSave={handleSave}
                />
                {detailAfter?.(actionContext)}
              </>
            ),
          },
        ]}
      />
    </section>
  )
}

function ConfirmDialog({ dialog, shown, onClose }) {
  if (!dialog) return null

  return (
    <div className={`confirm-dialog-layer${shown ? ' shown' : ''}`} role="presentation">
      <div className={`confirm-dialog confirm-dialog-${dialog.type}`} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
        <div className="confirm-dialog-body">
          <div className={`confirm-dialog-icon confirm-dialog-icon-${dialog.type}`} aria-hidden="true">
            {confirmIcon(dialog.type)}
          </div>
          <h3 id="confirm-dialog-title">{dialog.title}</h3>
          {dialog.text ? <p>{dialog.text}</p> : null}
        </div>
        <div className="confirm-dialog-actions">
          <button type="button" onClick={() => onClose(false)}>
            취소
          </button>
          <button type="button" onClick={() => onClose(true)}>
            확인
          </button>
        </div>
      </div>
    </div>
  )
}

function confirmIcon(type) {
  if (type === 'save') return '!'
  if (type === 'delete') return '!'
  return '!'
}

function ToastNotification({ toast, shown, onClose }) {
  if (!toast) return null

  return (
    <div className={`toast-notification toast-notification-${toast.type}${shown ? ' shown' : ''}`} role="status" aria-live="polite">
      <span className="toast-notification-icon" aria-hidden="true">
        {toast.type === 'success' ? '✓' : '!'}
      </span>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
      <button type="button" aria-label="알림 닫기" onClick={onClose}>
        x
      </button>
    </div>
  )
}

function toastTitle(type) {
  if (type === 'success') return 'Success!'
  if (type === 'error') return 'Error!'
  if (type === 'warning') return 'Warning!'
  return 'Info'
}

function inferToastType(message) {
  if (/완료|성공/.test(message)) return 'success'
  if (/실패|오류|권한|Error/i.test(message)) return 'error'
  if (/선택|필수|먼저|없어|않습니다|초기화/.test(message)) return 'warning'
  return 'info'
}

function exportGridToCsv(columns, rows, title) {
  const headers = columns.map((column) => column.header)
  const keys = columns.map((column) => column.name)
  const csvRows = [
    headers,
    ...rows.map((row) => keys.map((key) => row[key] ?? '')),
  ]
  const csvText = csvRows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')
  const blob = new Blob([`\uFEFF${csvText}`], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `${title || 'grid'}-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

function escapeCsvValue(value) {
  const text = String(value)

  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }

  return text
}

function toQueryString(params) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (String(value ?? '').trim()) query.set(key, value)
  }
  return query.toString()
}

function validateRequired(fields = [], row) {
  for (const field of fields) {
    if (!field.required) continue
    const value = row?.[field.name]
    if (value === undefined || value === null || String(value).trim() === '') {
      return `${field.label}은(는) 필수입니다.`
    }
  }
  return null
}

function mergeSavedRow(rows = [], savedRow) {
  if (!savedRow?.id) {
    return rows
  }

  const index = rows.findIndex((row) => row.id === savedRow.id)
  if (index < 0) {
    return [...rows, savedRow]
  }

  return rows.map((row) => (row.id === savedRow.id ? savedRow : row))
}

async function parseApiError(response, fallback) {
  try {
    const body = await response.json()
    return body.message ?? body.detail ?? body.error ?? fallback
  } catch {
    return fallback
  }
}
