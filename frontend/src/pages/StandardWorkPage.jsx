import { useState } from 'react'
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
  data,
  detailActions,
  detailAfter,
  detailFieldAction,
  detailFields,
  endpoint,
  headerActions,
  hideHeader = false,
  listTabLabel,
  detailTabLabel,
  onRefresh,
  page,
  searchFields,
  title,
}) {
  const [activeTab, setActiveTab] = useState(0)
  const [selectedRow, setSelectedRow] = useState(null)
  const [draftRow, setDraftRow] = useState(null)
  const [gridData, setGridData] = useState(null)
  const [message, setMessage] = useState('')
  const [searchParams, setSearchParams] = useState({})

  const canEdit = ['ADMIN', 'STAFF', 'GUEST'].includes(authUser?.roleSubCode)
  const visibleData = gridData ?? data

  const handleDblClick = (rowData) => {
    setSelectedRow(rowData)
    setDraftRow({ ...rowData })
    setActiveTab(1)
    setMessage('')
  }

  const handleNew = () => {
    setSelectedRow(null)
    setDraftRow(typeof createDefaults === 'function' ? createDefaults() : (createDefaults ?? {}))
    setActiveTab(1)
    setMessage('')
  }

  const handleSearch = async () => {
    if (!endpoint) {
      applyClientFilter()
      return
    }

    try {
      const response = await fetchWithAuth(`${endpoint}?${toQueryString(searchParams)}`)

      if (!response.ok) {
        throw new Error('search-failed')
      }

      setGridData(await response.json())
      setMessage('')
    } catch {
      applyClientFilter()
      setMessage('검색 API 조건 조회를 사용할 수 없어 현재 데이터에서 필터링했습니다.')
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
    setMessage('')
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
    if (!canEdit) { setMessage('저장할 수 없는 권한입니다.'); return }
    if (!endpoint) { setMessage('이 화면은 아직 저장 API가 연결되지 않았습니다.'); return }

    const validationError = validateRequired(detailFields, draftRow)
    if (validationError) { setMessage(validationError); return }

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
        setMessage(errorMessage)
        return
      }

      setMessage(selectedRow ? '수정이 완료되었습니다.' : '등록이 완료되었습니다.')
      await onRefresh?.()
      setGridData(null)
      setActiveTab(0)
    } catch {
      setMessage(selectedRow ? '수정에 실패했습니다.' : '등록에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!canEdit) { setMessage('삭제할 수 없는 권한입니다.'); return }
    if (!endpoint || !selectedRow) { setMessage('삭제할 행을 선택하세요.'); return }

    try {
      const response = await fetchWithAuth(`${endpoint}/${selectedRow.id}`, { method: 'DELETE' })

      if (!response.ok) {
        const errorMessage = await parseApiError(response, '삭제에 실패했습니다.')
        setMessage(errorMessage)
        return
      }

      setMessage('삭제가 완료되었습니다.')
      await onRefresh?.()
      setGridData(null)
      setActiveTab(0)
    } catch {
      setMessage('삭제에 실패했습니다.')
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
    setMessage,
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
      {allowSave ? (
        <button type="button" className="primary-button" onClick={() => handleSave()}>
          <span>저장</span>
        </button>
      ) : null}
      {detailActions?.(actionContext)}
      {selectedRow && allowDelete ? (
        <button type="button" className="danger-button" onClick={handleDelete}>
          <span>삭제</span>
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

      {message ? <div className="info-banner">{message}</div> : null}

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
      return `'${field.label}' 항목은 필수입니다.`
    }
  }
  return null
}

async function parseApiError(response, fallback) {
  try {
    const body = await response.json()
    return body.message ?? fallback
  } catch {
    return fallback
  }
}
