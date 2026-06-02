import {
  ArrowRight,
  BarChart3,
  Boxes,
  Building2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  Home,
  LayoutGrid,
  LogIn,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  RefreshCw,
  Search,
  ServerCog,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { WmsGrid } from './components/WmsGrid.jsx'

const pointColors = [
  { name: 'Control Navy', value: '#172033', usage: '사이드바, 핵심 구조, 주요 제목' },
  { name: 'Process Blue', value: '#2563eb', usage: '주요 버튼, 활성 메뉴, 조회 액션' },
  { name: 'Inventory Teal', value: '#0f766e', usage: '재고, 확정 상태, 정상 처리' },
  { name: 'Pending Amber', value: '#d97706', usage: '대기 상태, 주의 수량' },
  { name: 'Exception Red', value: '#dc2626', usage: '부족, 오류, 취소 상태' },
]

const introTabs = [
  {
    id: 'service',
    label: '서비스 소개',
    title: '물류 운영을 하나의 업무 흐름으로 연결합니다.',
    body: '구매주문, 입고, 재고, 출고, 반품, 청구까지 물류 운영에서 반복되는 핵심 프로세스를 한 화면 흐름으로 관리합니다.',
  },
  {
    id: 'features',
    label: '주요 기능',
    title: 'OMS, WMS, Billing을 단순하고 명확하게 구성합니다.',
    body: '거래처와 사용자, 창고 위치, 품목, 주문, 입출고, 재고 이력, 청구서를 기준으로 운영 데이터를 추적합니다.',
  },
  {
    id: 'knowledge',
    label: '물류 기본 지식',
    title: '업무 개념을 모르는 사용자도 흐름을 따라갈 수 있습니다.',
    body: 'OMS는 주문을 관리하고, WMS는 창고 작업과 재고를 관리합니다. 입고는 재고를 늘리고, 출고는 재고를 줄이며, 청구는 출고 결과를 금액으로 확정합니다.',
  },
  {
    id: 'demo',
    label: '시연 가이드',
    title: '게스트 시연으로 실제 운영 화면을 확인합니다.',
    body: '재고 현황에서 시작해 구매주문, 입고, 판매주문, 출고, 반품, 청구 흐름을 순서대로 확인할 수 있습니다.',
  },
  {
    id: 'tech',
    label: '기술/인프라',
    title: 'Java, React, MySQL 기반의 3-Tier 구조를 사용합니다.',
    body: 'Spring Boot와 JPA로 도메인을 구성하고, React와 TOAST UI Grid로 업무 화면을 구현합니다. AWS 배포 구조와 GitHub Actions 기반 검증 흐름을 설계합니다.',
  },
]

const painPoints = [
  {
    label: '주문 처리',
    title: '구매와 판매 주문이 흩어져 있어요',
    description: '주문 상태와 입출고 진행 상황을 따로 확인하면 운영 판단이 늦어집니다.',
  },
  {
    label: '창고 운영',
    title: '창고 위치와 재고 수량을 바로 보기 어려워요',
    description: '창고, Area, Zone, Location 체계가 없으면 재고 추적이 복잡해집니다.',
  },
  {
    label: '반품 관리',
    title: '구매반품과 판매반품의 재고 반영이 헷갈려요',
    description: '반품입고와 반품출고를 구분해 재고 이력까지 남겨야 운영 신뢰도가 높아집니다.',
  },
  {
    label: '정산/청구',
    title: '출고 이후 청구 흐름이 분리되어 있어요',
    description: '판매주문, 출고, 청구서가 연결되어야 주문 마감 상태를 명확하게 볼 수 있습니다.',
  },
]

const processSteps = [
  { label: '구매주문', icon: ClipboardList },
  { label: '입고', icon: PackageCheck },
  { label: '재고', icon: Boxes },
  { label: '출고', icon: Truck },
  { label: '반품', icon: RotateCcw },
  { label: '청구', icon: CircleDollarSign },
]

const serviceCards = [
  {
    icon: Building2,
    title: '기준정보',
    description: '거래처, 사용자, 창고 위치, 품목 대/중/소 분류를 운영 기준으로 관리합니다.',
  },
  {
    icon: ShoppingCart,
    title: '주문관리',
    description: '구매주문과 판매주문을 기준으로 입고와 출고 프로세스를 연결합니다.',
  },
  {
    icon: Warehouse,
    title: '입출고 관리',
    description: '입고 확정, 출고 확정, 반품입고, 반품출고를 재고 증감과 연결합니다.',
  },
  {
    icon: Boxes,
    title: '재고관리',
    description: '품목과 로케이션별 현재고, 가용재고, 재고 이력을 그리드로 확인합니다.',
  },
  {
    icon: FileText,
    title: '청구관리',
    description: '출고 완료된 판매주문을 기준으로 청구서를 생성하고 상태를 관리합니다.',
  },
  {
    icon: ServerCog,
    title: '운영 구조',
    description: 'Spring Boot, JPA, React, MySQL 기반으로 확장 가능한 3-Tier 구조를 설계합니다.',
  },
]

const guideSteps = [
  '게스트 시연으로 내부 업무 화면 진입',
  '재고 현황과 최근 재고 이력 확인',
  '구매주문과 입고 흐름 확인',
  '판매주문, 출고, 반품, 청구 흐름 확인',
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
  const [route, setRoute] = useState(() => window.location.pathname)

  const navigate = useCallback((path) => {
    window.history.pushState({}, '', path)
    setRoute(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setRoute(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  if (route.startsWith('/app')) {
    return <WorkspaceApp onMoveHome={() => navigate('/')} />
  }

  return <LandingPage onEnterApp={() => navigate('/app')} />
}

function LandingPage({ onEnterApp }) {
  const [activeTab, setActiveTab] = useState('service')
  const activeContent = introTabs.find((tab) => tab.id === activeTab) ?? introTabs[0]

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button type="button" className="landing-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-mark light">
            <LayoutGrid size={21} />
          </span>
          <strong>SaaS WMS</strong>
        </button>
        <nav>
          {introTabs.map((tab) => (
            <button
              type="button"
              className={activeTab === tab.id ? 'active' : ''}
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <button type="button" className="nav-login-button" onClick={onEnterApp}>
          <LogIn size={16} />
          로그인
        </button>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="hero-kicker">OMS + WMS + Billing</p>
          <h1>물류 운영을 하나의 흐름으로 연결하는 OMS + WMS 플랫폼</h1>
          <p>
            구매주문, 입고, 재고, 출고, 반품, 청구까지 물류 운영의 핵심 프로세스를 통합 관리합니다.
          </p>
          <div className="hero-actions">
            <button type="button" className="hero-primary" onClick={onEnterApp}>
              게스트 시연
              <ArrowRight size={17} />
            </button>
            <button type="button" className="hero-secondary" onClick={() => setActiveTab('features')}>
              서비스 둘러보기
            </button>
          </div>
        </div>
        <div className="hero-product">
          <div className="hero-screen-toolbar">
            <span />
            <span />
            <span />
            <strong>Operations Console</strong>
          </div>
          <div className="hero-screen" aria-label="내부 업무 화면 미리보기">
            <div className="hero-screen-sidebar">
              <strong>SaaS WMS</strong>
              <span className="active">Inventory</span>
              <span>Purchase / Inbound</span>
              <span>Sales / Outbound</span>
              <span>Billing</span>
            </div>
            <div className="hero-screen-main">
              <div className="mini-metrics">
                <span>SKU 3</span>
                <span>Stock 617</span>
                <span>Available 577</span>
              </div>
              <div className="mini-grid">
                <div>Item Code</div>
                <div>Location</div>
                <div>Qty</div>
                <div>ITEM-DETERGENT-1L</div>
                <div>L-PICK-001</div>
                <div>152</div>
                <div>ITEM-USB-C-1M</div>
                <div>L-PICK-002</div>
                <div>395</div>
                <div>ITEM-WIRELESS-KB</div>
                <div>L-PICK-002</div>
                <div>70</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="landing-content">
        <section className="pain-section">
          <div className="section-heading centered">
            <p className="eyebrow">Operation Issues</p>
            <h2>아직도 물류 운영 데이터를 따로 확인하고 계신가요?</h2>
            <p>주문, 창고, 재고, 반품, 청구가 분리되면 운영 흐름을 한눈에 보기 어렵습니다.</p>
          </div>
          <div className="pain-card-track">
            {painPoints.map((point) => (
              <article className="pain-card" key={point.label}>
                <span>{point.label}</span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="process-section">
          <div className="section-heading">
            <p className="eyebrow">Process</p>
            <h2>주문부터 청구까지 이어지는 처리 과정</h2>
            <p>각 업무는 다음 업무의 기준 데이터가 되고, 재고 변화는 이력으로 추적됩니다.</p>
          </div>
          <div className="process-timeline">
            {processSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <div className="process-step" key={step.label}>
                  <div>
                    <Icon size={22} />
                  </div>
                  <strong>{step.label}</strong>
                  {index < processSteps.length - 1 ? <ArrowRight className="step-arrow" size={18} /> : null}
                </div>
              )
            })}
          </div>
        </section>

        <section className="intro-section">
          <div className="intro-tabs" aria-label="서비스 안내 탭">
            {introTabs.map((tab) => (
              <button
                type="button"
                className={activeTab === tab.id ? 'active' : ''}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="intro-panel">
            <div>
              <p className="eyebrow">Service Overview</p>
              <h2>{activeContent.title}</h2>
              <p>{activeContent.body}</p>
            </div>
            <div className="process-flow" aria-label="업무 흐름">
              <span>PO</span>
              <ArrowRight size={16} />
              <span>Inbound</span>
              <ArrowRight size={16} />
              <span>Inventory</span>
              <ArrowRight size={16} />
              <span>Outbound</span>
              <ArrowRight size={16} />
              <span>Billing</span>
            </div>
          </div>
        </section>

        <section className="feature-grid">
          {serviceCards.map((card) => (
            <FeatureCard
              description={card.description}
              icon={card.icon}
              key={card.title}
              title={card.title}
            />
          ))}
        </section>

        <section className="preview-section">
          <div className="preview-copy">
            <p className="eyebrow">WMS Grid</p>
            <h2>운영 데이터는 그리드에서 빠르게 확인합니다.</h2>
            <p>
              재고 현황과 재고 이력은 TOAST UI Grid 기반 화면으로 구성해 컬럼 리사이즈, 행 선택, 합계 표시가 가능합니다.
            </p>
            <button type="button" className="section-cta" onClick={onEnterApp}>
              내부 화면 보기
              <ArrowRight size={16} />
            </button>
          </div>
          <div className="preview-window">
            <div className="preview-table">
              <div>Type</div>
              <div>Item Code</div>
              <div>Location</div>
              <div>After</div>
              <div>INBOUND</div>
              <div>ITEM-DETERGENT-1L</div>
              <div>L-PICK-001</div>
              <div>170</div>
              <div>OUTBOUND</div>
              <div>ITEM-WIRELESS-KB</div>
              <div>L-PICK-002</div>
              <div>70</div>
              <div>RETURN_INBOUND</div>
              <div>ITEM-DETERGENT-1L</div>
              <div>L-PICK-001</div>
              <div>152</div>
            </div>
          </div>
        </section>

        <section className="demo-guide-section">
          <div className="section-heading centered">
            <p className="eyebrow">Demo Guide</p>
            <h2>게스트 시연은 이 순서로 확인하면 됩니다.</h2>
          </div>
          <div className="guide-step-list">
            {guideSteps.map((step, index) => (
              <article key={step}>
                <span>{index + 1}</span>
                <p>{step}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="color-story">
          <div>
            <p className="eyebrow">Visual System</p>
            <h2>업무 상태를 구분하는 5가지 포인트 컬러</h2>
          </div>
          <div className="landing-color-list">
            {pointColors.map((color) => (
              <article key={color.name}>
                <span style={{ backgroundColor: color.value }} />
                <strong>{color.name}</strong>
                <code>{color.value}</code>
              </article>
            ))}
          </div>
        </section>

        <section className="final-cta">
          <div>
            <p className="eyebrow">Start Demo</p>
            <h2>물류 운영 흐름을 직접 확인해보세요.</h2>
          </div>
          <button type="button" onClick={onEnterApp}>
            게스트 시연 시작
            <ArrowRight size={17} />
          </button>
        </section>
      </main>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <article className="feature-card">
      <div>
        <Icon size={21} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}

function WorkspaceApp({ onMoveHome }) {
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
          <button type="button" className="brand-mark" onClick={onMoveHome} title="메인으로 이동">
            <LayoutGrid size={21} />
          </button>
          <div>
            <strong>SaaS WMS</strong>
            <span>Operations Console</span>
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
            <p className="eyebrow">OMS + WMS Operations</p>
            <h1>{activeMenu === 'guide' ? '시연 가이드' : 'Inventory Control Center'}</h1>
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
            <p className="eyebrow">Operation Guide</p>
            <h2>업무 흐름 시연 순서</h2>
          </div>
        </div>
        <div className="guide-copy">
          <p>
            재고 현황에서 현재 수량을 확인한 뒤 구매주문, 입고, 판매주문, 출고, 반품, 청구 흐름을 순서대로 확인합니다.
          </p>
          <p>
            입고와 판매반품은 재고를 증가시키고, 출고와 구매반품은 재고를 감소시킵니다. 모든 수량 변화는 재고 이력으로 추적됩니다.
          </p>
        </div>
      </section>

      <section className="work-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Point Colors</p>
            <h2>업무 상태를 구분하는 포인트 컬러</h2>
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
