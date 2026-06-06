import { useState } from 'react'
import { DetailForm } from '../components/common/DetailForm.jsx'
import { SearchPanel } from '../components/common/SearchPanel.jsx'
import { TabLayout } from '../components/common/TabLayout.jsx'
import { WmsGrid } from '../components/common/WmsGrid.jsx'
import { fetchWithAuth } from '../router/session.js'

const rowNumberHeaders = ['rowNum']

export function StandardWorkPage({
  authUser,
  columns,
  data,
  detailFields,
  endpoint,
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

  const canEdit = ['ADMIN', 'STAFF'].includes(authUser?.roleSubCode)

  const visibleData = gridData ?? data

  const handleDblClick = (rowData) => {
    setSelectedRow(rowData)
    setDraftRow({ ...rowData })
    setActiveTab(1)
    setMessage('')
  }

  const handleNew = () => {
    setSelectedRow(null)
    setDraftRow({})
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
    event.preventDefault()

    if (!canEdit) {
      setMessage('게스트 권한은 저장할 수 없습니다.')
      return
    }

    if (!endpoint) {
      setMessage('이 화면은 아직 저장 API가 연결되지 않았습니다.')
      return
    }

    const method = selectedRow ? 'PUT' : 'POST'
    const saveUrl = selectedRow ? `${endpoint}/${selectedRow.id}` : endpoint

    try {
      const response = await fetchWithAuth(saveUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draftRow ?? {}),
      })

      if (!response.ok) {
        throw new Error('save-failed')
      }

      setMessage(selectedRow ? '수정이 완료되었습니다.' : '등록이 완료되었습니다.')
      await onRefresh?.()
      setGridData(null)
      setActiveTab(0)
    } catch {
      setMessage(selectedRow ? '수정 API가 아직 연결되지 않았거나 저장에 실패했습니다.' : '등록에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!canEdit) {
      setMessage('게스트 권한은 삭제할 수 없습니다.')
      return
    }

    if (!endpoint || !selectedRow) {
      setMessage('삭제할 행을 선택하세요.')
      return
    }

    try {
      const response = await fetchWithAuth(`${endpoint}/${selectedRow.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('delete-failed')
      }

      setMessage('삭제가 완료되었습니다.')
      await onRefresh?.()
      setGridData(null)
      setActiveTab(0)
    } catch {
      setMessage('삭제 API가 아직 연결되지 않았거나 삭제에 실패했습니다.')
    }
  }

  return (
    <section className="standard-page">
      <div className="work-page-header">
        <div>
          <p className="eyebrow">{page.eyebrow}</p>
          <h2>{title ?? page.title}</h2>
          <span>{page.description}</span>
        </div>
        <button type="button" className="primary-button" onClick={handleNew}>
          신규등록
        </button>
      </div>

      {message ? <div className="info-banner">{message}</div> : null}

      <TabLayout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={[
          {
            label: '목록',
            content: (
              <>
                <SearchPanel
                  fields={searchFields}
                  searchParams={searchParams}
                  onChange={setSearchParams}
                  onReset={handleReset}
                  onSearch={handleSearch}
                />
                <WmsGrid
                  columns={columns}
                  data={visibleData}
                  minBodyHeight={430}
                  rowHeaders={rowNumberHeaders}
                  onRowDoubleClick={handleDblClick}
                />
              </>
            ),
          },
          {
            label: selectedRow ? '상세' : '상세/등록',
            content: (
              <DetailForm
                fields={detailFields}
                modeLabel={selectedRow ? '상세 수정' : '신규 등록'}
                readOnly={!canEdit}
                row={draftRow}
                onCancel={() => setActiveTab(0)}
                onDelete={handleDelete}
                onFieldChange={handleFieldChange}
                onSave={handleSave}
              />
            ),
          },
        ]}
      />
    </section>
  )
}

function toQueryString(params) {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (String(value ?? '').trim()) {
      query.set(key, value)
    }
  }

  return query.toString()
}
