import {
  BarChart3,
  Boxes,
  ClipboardList,
  FileText,
  Home,
  LayoutGrid,
  PackageSearch,
  RefreshCw,
  Search,
  ShieldCheck,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { WmsGrid } from './components/WmsGrid.jsx'

const pointColors = [
  { name: 'Control Navy', value: '#172033', usage: '사이드바와 핵심 구조' },
  { name: 'Process Blue', value: '#2563eb', usage: '주요 버튼과 활성 메뉴' },
  { name: 'Inventory Teal', value: '#0f766e', usage: '재고와 확정 상태' },
  { name: 'Pending Amber', value: '#d97706', usage: '대기 상태와 주의 수량' },
  { name: 'Exception Red', value: '#dc2626', usage: '부족/오류/취소 상태' },
]

const menuGroups = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
      { id: 'guide', label: 'Guide', icon: FileText },
    ],
  },
  {
    title: 'Master',
    items: [
      { id: 'warehouse', label: 'Location Master', icon: Warehouse },
      { id: 'items', label: 'Item Master', icon: PackageSearch },
    ],
  },
  {
    title: 'Operations',
    items: [
      { id: 'inventory', label: 'Inventory', icon: Boxes },
      { id: 'purchase', label: 'Purchase / Inbound', icon: ClipboardList },
      { id: 'sales', label: 'Sales / Outbound', icon: Truck },
      { id: 'billing', label: 'Billing', icon: ShieldCheck },
    ],
  },
]

const inventoryColumns = [
  { header: 'Item Code', name: 'itemCode', width: 170 },
  { header: 'Item Name', name: 'itemName', width: 210 },
  { header: 'Location', name: 'locationCode', width: 140, align: 'center' },
  { header: 'Stock Qty', name: 'quantity', width: 110, align: 'right' },
  { header: 'Allocated', name: 'allocatedQuantity', width: 110, align: 'right' },
  { header: 'Available', name: 'availableQuantity', width: 110, align: 'right' },
  { header: 'Use', name: 'useYn', width: 80, align: 'center' },
]

const historyColumns = [
  { header: 'Type', name: 'historyTypeSubCode', width: 150 },
  { header: 'Item Code', name: 'itemCode', width: 170 },
  { header: 'Location', name: 'locationCode', width: 130, align: 'center' },
  { header: 'Change', name: 'changeQuantity', width: 100, align: 'right' },
  { header: 'Before', name: 'beforeQuantity', width: 100, align: 'right' },
  { header: 'After', name: 'afterQuantity', width: 100, align: 'right' },
  { header: 'Reason', name: 'reason', width: 320 },
]

const rowNumberHeaders = ['rowNum']
const selectableRowHeaders = ['rowNum', 'checkbox']
const inventorySummaryColumns = ['quantity', 'allocatedQuantity', 'availableQuantity']

function App() {
  const [activeMenu, setActiveMenu] = useState('inventory')
  const [inventories, setInventories] = useState([])
  const [histories, setHistories] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const filteredInventories = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return inventories
    }

    return inventories.filter((inventory) => {
      return (
        inventory.itemCode.toLowerCase().includes(normalizedKeyword) ||
        inventory.itemName.toLowerCase().includes(normalizedKeyword) ||
        inventory.locationCode.toLowerCase().includes(normalizedKeyword)
      )
    })
  }, [inventories, keyword])

  const dashboardSummary = useMemo(() => {
    let totalStock = 0
    let totalAvailable = 0
    let lowStockCount = 0

    for (const inventory of inventories) {
      totalStock += inventory.quantity
      totalAvailable += inventory.availableQuantity

      if (inventory.availableQuantity <= 20) {
        lowStockCount += 1
      }
    }

    return {
      totalSku: inventories.length,
      totalStock,
      totalAvailable,
      lowStockCount,
    }
  }, [inventories])

  const loadWarehouseData = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const [inventoryResponse, historyResponse] = await Promise.all([
        fetch('/api/inventories'),
        fetch('/api/inventory-histories'),
      ])

      if (!inventoryResponse.ok || !historyResponse.ok) {
        throw new Error('API response was not successful.')
      }

      const inventoryData = await inventoryResponse.json()
      const historyData = await historyResponse.json()

      setInventories(inventoryData)
      setHistories(historyData)
    } catch {
      setErrorMessage('백엔드 API에 연결할 수 없습니다. Spring Boot 서버와 Docker MySQL 상태를 확인하세요.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadWarehouseData()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [loadWarehouseData])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <LayoutGrid size={21} />
          </div>
          <div>
            <strong>SaaS WMS</strong>
            <span>Portfolio Demo</span>
          </div>
        </div>

        <nav className="side-nav">
          {menuGroups.map((group) => (
            <section className="nav-group" key={group.title}>
              <p>{group.title}</p>
              {group.items.map((item) => {
                const Icon = item.icon

                return (
                  <button
                    type="button"
                    className={activeMenu === item.id ? 'active' : ''}
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </section>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">OMS + WMS demo workspace</p>
            <h1>{activeMenu === 'guide' ? 'Project Guide' : 'Inventory Control Center'}</h1>
          </div>
          <div className="user-chip">
            <span>Guest</span>
            <strong>Demo User</strong>
          </div>
        </header>

        {activeMenu === 'guide' ? (
          <GuideView />
        ) : (
          <InventoryView
            dashboardSummary={dashboardSummary}
            errorMessage={errorMessage}
            filteredInventories={filteredInventories}
            histories={histories}
            keyword={keyword}
            loading={loading}
            onKeywordChange={setKeyword}
            onRefresh={loadWarehouseData}
          />
        )}
      </main>
    </div>
  )
}

function InventoryView({
  dashboardSummary,
  errorMessage,
  filteredInventories,
  histories,
  keyword,
  loading,
  onKeywordChange,
  onRefresh,
}) {
  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="SKU Locations" value={dashboardSummary.totalSku} tone="blue" />
        <MetricCard label="Total Stock" value={dashboardSummary.totalStock.toLocaleString()} tone="teal" />
        <MetricCard label="Available Qty" value={dashboardSummary.totalAvailable.toLocaleString()} tone="navy" />
        <MetricCard label="Low Stock" value={dashboardSummary.lowStockCount} tone="amber" />
      </section>

      <section className="work-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">WMS / Inventory</p>
            <h2>재고 현황</h2>
          </div>
          <div className="button-row">
            <button type="button" className="icon-button" onClick={onRefresh} title="새로고침">
              <RefreshCw size={16} />
            </button>
            <button type="button" className="primary-button">
              <BarChart3 size={16} />
              조회
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <label className="search-field">
            <Search size={16} />
            <input
              type="search"
              placeholder="품목코드, 품목명, 로케이션 검색"
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
            />
          </label>
          <div className="status-message">
            {loading ? 'Loading...' : `${filteredInventories.length} rows`}
          </div>
        </div>

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        <WmsGrid
          columns={inventoryColumns}
          data={filteredInventories}
          minBodyHeight={310}
          rowHeaders={selectableRowHeaders}
          summaryColumns={inventorySummaryColumns}
        />
      </section>

      <section className="work-panel compact">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Stock Movement</p>
            <h2>최근 재고 이력</h2>
          </div>
        </div>
        <WmsGrid
          columns={historyColumns}
          data={histories}
          minBodyHeight={220}
          rowHeaders={rowNumberHeaders}
        />
      </section>
    </div>
  )
}

function MetricCard({ label, value, tone }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  )
}

function GuideView() {
  return (
    <div className="guide-layout">
      <section className="work-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Design Direction</p>
            <h2>위드웍스식 그리드 중심 WMS</h2>
          </div>
        </div>
        <div className="guide-copy">
          <p>
            이 데모는 실제 OMS + WMS 구조를 포트폴리오용으로 단순화한 프로젝트입니다.
            업무 화면은 검색 조건, 작업 버튼, 대형 그리드, 상세 패널이 중심이 되도록 구성합니다.
          </p>
          <p>
            TOAST UI Grid 기반 공통 컴포넌트를 사용해 행 선택, 컬럼 리사이즈, 수량 합계,
            입출고/반품/청구 흐름을 일관된 화면 경험으로 보여주는 것이 목표입니다.
          </p>
        </div>
      </section>

      <section className="work-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Point Colors</p>
            <h2>프론트 포인트 컬러 5가지</h2>
          </div>
        </div>
        <div className="color-grid">
          {pointColors.map((color) => (
            <article className="color-token" key={color.name}>
              <span style={{ backgroundColor: color.value }} />
              <strong>{color.name}</strong>
              <code>{color.value}</code>
              <p>{color.usage}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
