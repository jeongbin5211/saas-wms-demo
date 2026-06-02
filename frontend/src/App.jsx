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
  { name: '관리 네이비', value: '#172033', usage: '사이드바, 핵심 구조, 주요 제목' },
  { name: '진행 블루', value: '#2563eb', usage: '주요 버튼, 활성 메뉴, 조회 액션' },
  { name: '재고 틸', value: '#0f766e', usage: '재고, 확정 상태, 정상 처리' },
  { name: '대기 앰버', value: '#d97706', usage: '대기 상태, 주의 수량' },
  { name: '예외 레드', value: '#dc2626', usage: '부족, 오류, 취소 상태' },
]

const publicNavItems = [
  { path: '/', label: '홈' },
  { path: '/about', label: '서비스 소개' },
  { path: '/features', label: '주요 기능' },
  { path: '/logistics', label: '물류 기본 지식' },
  { path: '/demo-guide', label: '시연 가이드' },
  { path: '/tech', label: '기술/인프라' },
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

const pageContent = {
  '/about': {
    kicker: '서비스 소개',
    title: '물류 운영을 하나의 업무 흐름으로 연결합니다.',
    description: '구매주문, 입고, 재고, 출고, 반품, 청구까지 물류 운영에서 반복되는 핵심 프로세스를 하나의 화면 흐름으로 관리합니다.',
    cards: [
      ['통합 운영', '주문과 창고 작업, 재고, 청구 데이터를 같은 흐름에서 확인합니다.'],
      ['거래처 구조', '상위 거래처와 하위 거래처 관계를 기준으로 SaaS형 운영 구조를 구성합니다.'],
      ['공통코드 관리', '역할, 상태, 이력 유형 같은 구분값은 공통코드로 관리합니다.'],
    ],
  },
  '/features': {
    kicker: '주요 기능',
    title: '기준정보부터 청구까지 핵심 기능을 제공합니다.',
    description: '거래처, 사용자, 창고 위치, 품목, 구매주문, 판매주문, 입출고, 반품, 청구서를 기준으로 운영 데이터를 추적합니다.',
    cards: serviceCards.map((card) => [card.title, card.description]),
  },
  '/logistics': {
    kicker: '물류 기본 지식',
    title: 'OMS와 WMS의 역할을 쉽게 이해할 수 있습니다.',
    description: 'OMS는 주문 흐름을 관리하고, WMS는 창고 작업과 재고 흐름을 관리합니다. 입고는 재고를 늘리고, 출고는 재고를 줄이며, 청구는 출고 결과를 금액으로 확정합니다.',
    cards: [
      ['OMS', '구매주문, 판매주문, 반품주문처럼 고객과 거래처 사이의 주문 흐름을 관리합니다.'],
      ['WMS', '창고 위치, 입고, 출고, 재고, 재고 이력처럼 물류 현장 작업을 관리합니다.'],
      ['로케이션', '창고 안의 Area, Zone, Location 단위로 재고가 어디에 있는지 추적합니다.'],
      ['재고 이력', '입고, 출고, 반품, 조정으로 발생한 수량 변화를 기록합니다.'],
    ],
  },
  '/demo-guide': {
    kicker: '시연 가이드',
    title: '게스트 시연은 정해진 업무 흐름대로 확인합니다.',
    description: '먼저 재고 현황을 보고, 구매주문과 입고, 판매주문과 출고, 반품과 청구 흐름을 순서대로 확인하면 전체 구조가 자연스럽게 보입니다.',
    cards: guideSteps.map((step, index) => [`${index + 1}단계`, step]),
  },
  '/tech': {
    kicker: '기술/인프라',
    title: '자바 백엔드와 리액트 프론트엔드를 3계층 구조로 구성합니다.',
    description: 'Spring Boot, JPA, MySQL, React, TOAST UI Grid, Docker, GitHub Actions를 기반으로 개발과 검증 흐름을 구성합니다.',
    cards: [
      ['백엔드', 'Java 21, Spring Boot, JPA 기반으로 도메인 모델과 API를 구성합니다.'],
      ['프론트엔드', 'React, Vite, TOAST UI Grid 기반으로 업무형 화면을 구성합니다.'],
      ['데이터베이스', 'MySQL을 사용하고 Docker Compose로 로컬 개발 환경을 관리합니다.'],
      ['배포 설계', 'AWS 3계층 구조와 GitHub Actions 기반 검증 흐름을 설계합니다.'],
    ],
  },
}

const menuGroups = [
  {
    title: '개요',
    items: [
      { id: 'dashboard', label: '대시보드', icon: Home },
      { id: 'guide', label: '시연 가이드', icon: FileText },
    ],
  },
  {
    title: '기준정보',
    items: [
      { id: 'locations', label: '위치정보', icon: Warehouse },
      { id: 'items', label: '품목정보', icon: PackageSearch },
    ],
  },
  {
    title: '운영관리',
    items: [
      { id: 'inventory', label: '재고 현황', icon: Boxes },
      { id: 'inventory-history', label: '재고 이력', icon: PackageCheck },
      { id: 'purchase', label: '구매주문', icon: ClipboardList },
      { id: 'receiving', label: '입고관리', icon: PackageCheck },
      { id: 'sales', label: '판매주문', icon: ShoppingCart },
      { id: 'shipping', label: '출고관리', icon: Truck },
      { id: 'returns', label: '반품관리', icon: RotateCcw },
      { id: 'billing', label: '청구관리', icon: ShieldCheck },
    ],
  },
]

const internalPages = {
  dashboard: { title: '대시보드', eyebrow: '개요', description: '주요 운영 지표와 진행 상태를 한 화면에서 확인합니다.' },
  guide: { title: '시연 가이드', eyebrow: '개요', description: '업무 흐름을 순서대로 확인하는 안내 화면입니다.' },
  locations: { title: '위치정보', eyebrow: '기준정보', description: '창고, Area, Zone, Location 기준정보를 관리합니다.' },
  items: { title: '품목정보', eyebrow: '기준정보', description: '품목 마스터, 품목 클래스, 품목 기준정보를 관리합니다.' },
  inventory: { title: '재고 현황', eyebrow: '운영관리', description: '품목과 로케이션 기준의 현재고와 가용 재고를 조회합니다.' },
  'inventory-history': { title: '재고 이력', eyebrow: '운영관리', description: '입고, 출고, 반품, 조정으로 발생한 수량 변화를 추적합니다.' },
  purchase: { title: '구매주문', eyebrow: '운영관리', description: '거래처별 구매 요청과 주문 상태를 관리합니다.' },
  receiving: { title: '입고관리', eyebrow: '운영관리', description: '구매주문을 기준으로 입고 예정과 확정 수량을 처리합니다.' },
  sales: { title: '판매주문', eyebrow: '운영관리', description: '판매 요청과 출고 대상 주문을 관리합니다.' },
  shipping: { title: '출고관리', eyebrow: '운영관리', description: '판매주문 기준 출고 지시와 출고 확정을 처리합니다.' },
  returns: { title: '반품관리', eyebrow: '운영관리', description: '구매반품과 판매반품 흐름을 구분해 관리합니다.' },
  billing: { title: '청구관리', eyebrow: '운영관리', description: '출고 완료 내역을 기준으로 청구서를 생성하고 상태를 추적합니다.' },
}

const inventoryColumns = [
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '로케이션', name: 'locationCode', width: 140, align: 'center' },
  { header: '현재고', name: 'quantity', width: 110, align: 'right' },
  { header: '할당 수량', name: 'allocatedQuantity', width: 110, align: 'right' },
  { header: '가용 재고', name: 'availableQuantity', width: 110, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const historyColumns = [
  { header: '이력 유형', name: 'historyTypeSubCode', width: 150 },
  { header: '품목 코드', name: 'itemCode', width: 170 },
  { header: '로케이션', name: 'locationCode', width: 130, align: 'center' },
  { header: '변경 수량', name: 'changeQuantity', width: 100, align: 'right' },
  { header: '변경 전', name: 'beforeQuantity', width: 100, align: 'right' },
  { header: '변경 후', name: 'afterQuantity', width: 100, align: 'right' },
  { header: '사유', name: 'reason', width: 320 },
]

const warehouseColumns = [
  { header: '창고 코드', name: 'warehouseCode', width: 150 },
  { header: '창고명', name: 'warehouseName', width: 210 },
  { header: '창고 유형', name: 'warehouseTypeSubCode', width: 120, align: 'center' },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const areaColumns = [
  { header: 'Area 코드', name: 'areaCode', width: 150 },
  { header: 'Area명', name: 'areaName', width: 210 },
  { header: '창고 ID', name: 'warehouseId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const zoneColumns = [
  { header: 'Zone 코드', name: 'zoneCode', width: 150 },
  { header: 'Zone명', name: 'zoneName', width: 210 },
  { header: 'Area ID', name: 'areaId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const locationColumns = [
  { header: 'Location 코드', name: 'locationCode', width: 170 },
  { header: 'Location명', name: 'locationName', width: 230 },
  { header: 'Zone ID', name: 'zoneId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const itemMasterColumns = [
  { header: '대분류 코드', name: 'itemMasterCode', width: 180 },
  { header: '대분류명', name: 'itemMasterName', width: 220 },
  { header: '거래처 ID', name: 'accountId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const itemClassColumns = [
  { header: '중분류 코드', name: 'itemClassCode', width: 180 },
  { header: '중분류명', name: 'itemClassName', width: 220 },
  { header: '대분류 ID', name: 'itemMasterId', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const itemColumns = [
  { header: '품목 코드', name: 'itemCode', width: 190 },
  { header: '품목명', name: 'itemName', width: 220 },
  { header: '바코드', name: 'barcode', width: 150 },
  { header: '단위', name: 'unit', width: 80, align: 'center' },
  { header: '매입가', name: 'purchasePrice', width: 100, align: 'right' },
  { header: '판매가', name: 'salesPrice', width: 100, align: 'right' },
  { header: '사용 여부', name: 'useYn', width: 90, align: 'center' },
]

const rowNumberHeaders = ['rowNum']
const selectableRowHeaders = ['rowNum', 'checkbox']
const inventorySummaryColumns = ['quantity', 'allocatedQuantity', 'availableQuantity']
const emptyLocationCatalog = { warehouses: [], areas: [], zones: [], locations: [] }
const emptyItemCatalog = { itemMasters: [], itemClasses: [], items: [] }

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
    return <WorkspaceApp onMoveHome={() => navigate('/')} onNavigate={navigate} route={route} />
  }

  return <LandingPage onEnterApp={() => navigate('/app/inventory')} onNavigate={navigate} route={route} />
}

function LandingPage({ onEnterApp, onNavigate, route }) {
  const isHome = route === '/'
  const currentPage = pageContent[route] ?? pageContent['/about']
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <button type="button" className="landing-brand" onClick={() => onNavigate('/')}>
          <span className="brand-mark light">
            <LayoutGrid size={21} />
          </span>
          <strong>SaaS WMS</strong>
        </button>
        <nav>
          {publicNavItems.map((item) => (
            <button
              type="button"
              className={route === item.path ? 'active' : ''}
              key={item.path}
              onClick={() => onNavigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button type="button" className="nav-login-button" onClick={onEnterApp}>
          <LogIn size={16} />
          로그인
        </button>
      </header>

      {isHome ? <LandingHero onEnterApp={onEnterApp} onNavigate={onNavigate} /> : null}

      <main className="landing-content">
        {isHome ? (
          <HomeLandingSections onEnterApp={onEnterApp} onNavigate={onNavigate} />
        ) : (
          <PublicSubPage currentPage={currentPage} onEnterApp={onEnterApp} route={route} />
        )}
      </main>
    </div>
  )
}

function LandingHero({ onEnterApp, onNavigate }) {
  return (
    <section className="landing-hero">
      <div className="hero-copy">
        <p className="hero-kicker">주문 관리 + 창고 관리 + 청구 관리</p>
        <h1>물류 운영을 하나의 흐름으로 연결하는 OMS + WMS 플랫폼</h1>
        <p>
          구매주문, 입고, 재고, 출고, 반품, 청구까지 물류 운영의 핵심 프로세스를 통합 관리합니다.
        </p>
        <div className="hero-actions">
          <button type="button" className="hero-primary" onClick={onEnterApp}>
            게스트 시연
            <ArrowRight size={17} />
          </button>
          <button type="button" className="hero-secondary" onClick={() => onNavigate('/features')}>
            서비스 둘러보기
          </button>
        </div>
      </div>
      <div className="hero-product">
        <div className="hero-screen-toolbar">
          <span />
          <span />
          <span />
          <strong>운영 콘솔</strong>
        </div>
        <div className="hero-screen" aria-label="내부 업무 화면 미리보기">
          <div className="hero-screen-sidebar">
            <strong>SaaS WMS</strong>
            <span className="active">재고관리</span>
            <span>구매 / 입고</span>
            <span>판매 / 출고</span>
            <span>청구</span>
          </div>
          <div className="hero-screen-main">
            <div className="mini-metrics">
              <span>품목 위치 3</span>
              <span>총 재고 617</span>
              <span>가용 재고 577</span>
            </div>
            <div className="mini-grid">
              <div>품목 코드</div>
              <div>로케이션</div>
              <div>수량</div>
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
  )
}

function HomeLandingSections({ onEnterApp, onNavigate }) {
  return (
    <>
      <section className="pain-section">
        <div className="section-heading centered">
          <p className="eyebrow">운영 고민</p>
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

      <ProcessSection />

      <section className="home-link-grid">
        {publicNavItems.filter((item) => item.path !== '/').map((item) => (
          <button type="button" key={item.path} onClick={() => onNavigate(item.path)}>
            <strong>{item.label}</strong>
            <span>자세히 보기</span>
            <ArrowRight size={16} />
          </button>
        ))}
      </section>

      <PreviewSection onEnterApp={onEnterApp} />
      <FinalCta onEnterApp={onEnterApp} />
    </>
  )
}

function PublicSubPage({ currentPage, onEnterApp, route }) {
  return (
    <>
      <section className="subpage-hero">
        <p className="eyebrow">{currentPage.kicker}</p>
        <h2>{currentPage.title}</h2>
        <p>{currentPage.description}</p>
      </section>

      {route === '/features' ? (
        <section className="feature-grid page-feature-grid">
          {serviceCards.map((card) => (
            <FeatureCard
              description={card.description}
              icon={card.icon}
              key={card.title}
              title={card.title}
            />
          ))}
        </section>
      ) : (
        <section className="subpage-card-grid">
          {currentPage.cards.map(([title, description]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </section>
      )}

      {route === '/about' ? <ProcessSection /> : null}
      {route === '/demo-guide' ? <PreviewSection onEnterApp={onEnterApp} /> : null}
      {route === '/tech' ? <ColorStory /> : null}
      <FinalCta onEnterApp={onEnterApp} />
    </>
  )
}

function ProcessSection() {
  return (
    <section className="process-section">
      <div className="section-heading">
        <p className="eyebrow">처리 과정</p>
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
  )
}

function PreviewSection({ onEnterApp }) {
  return (
    <section className="preview-section">
      <div className="preview-copy">
        <p className="eyebrow">업무 그리드</p>
        <h2>운영 데이터는 그리드에서 빠르게 확인합니다.</h2>
        <p>
          재고 현황과 재고 이력은 그리드 기반 화면으로 구성해 컬럼 크기 조정, 행 선택, 합계 표시가 가능합니다.
        </p>
        <button type="button" className="section-cta" onClick={onEnterApp}>
          내부 화면 보기
          <ArrowRight size={16} />
        </button>
      </div>
      <div className="preview-window">
        <div className="preview-table">
          <div>유형</div>
          <div>품목 코드</div>
          <div>로케이션</div>
          <div>변경 후</div>
          <div>입고</div>
          <div>ITEM-DETERGENT-1L</div>
          <div>L-PICK-001</div>
          <div>170</div>
          <div>출고</div>
          <div>ITEM-WIRELESS-KB</div>
          <div>L-PICK-002</div>
          <div>70</div>
          <div>반품입고</div>
          <div>ITEM-DETERGENT-1L</div>
          <div>L-PICK-001</div>
          <div>152</div>
        </div>
      </div>
    </section>
  )
}

function ColorStory() {
  return (
    <section className="color-story">
      <div>
        <p className="eyebrow">색상 기준</p>
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
  )
}

function FinalCta({ onEnterApp }) {
  return (
    <section className="final-cta">
      <div>
        <p className="eyebrow">시연 시작</p>
        <h2>물류 운영 흐름을 직접 확인해보세요.</h2>
      </div>
      <button type="button" onClick={onEnterApp}>
        게스트 시연 시작
        <ArrowRight size={17} />
      </button>
    </section>
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

function WorkspaceApp({ onMoveHome, onNavigate, route }) {
  const [inventories, setInventories] = useState([])
  const [histories, setHistories] = useState([])
  const [locationCatalog, setLocationCatalog] = useState(emptyLocationCatalog)
  const [itemCatalog, setItemCatalog] = useState(emptyItemCatalog)
  const [keyword, setKeyword] = useState('')
  const [historyKeyword, setHistoryKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [masterLoading, setMasterLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [masterErrorMessage, setMasterErrorMessage] = useState('')
  const activeMenu = route.replace(/^\/app\/?/, '') || 'inventory'
  const activePage = internalPages[activeMenu] ?? internalPages.inventory

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

  const filteredHistories = useMemo(() => {
    const normalizedKeyword = historyKeyword.trim().toLowerCase()

    if (!normalizedKeyword) {
      return histories
    }

    return histories.filter((history) => {
      const historyType = String(history.historyTypeSubCode ?? '').toLowerCase()
      const itemCode = String(history.itemCode ?? '').toLowerCase()
      const locationCode = String(history.locationCode ?? '').toLowerCase()
      const reason = String(history.reason ?? '').toLowerCase()

      return (
        historyType.includes(normalizedKeyword) ||
        itemCode.includes(normalizedKeyword) ||
        locationCode.includes(normalizedKeyword) ||
        reason.includes(normalizedKeyword)
      )
    })
  }, [histories, historyKeyword])

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

  const historySummary = useMemo(() => {
    let inboundCount = 0
    let outboundCount = 0
    let returnCount = 0

    for (const history of histories) {
      const historyType = String(history.historyTypeSubCode ?? '').toLowerCase()

      if (historyType.includes('in')) {
        inboundCount += 1
      }

      if (historyType.includes('out')) {
        outboundCount += 1
      }

      if (historyType.includes('return')) {
        returnCount += 1
      }
    }

    return {
      totalHistory: histories.length,
      inboundCount,
      outboundCount,
      returnCount,
    }
  }, [histories])

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

  const loadMasterData = useCallback(async () => {
    setMasterLoading(true)
    setMasterErrorMessage('')

    try {
      const [locationResponse, itemResponse] = await Promise.all([
        fetch('/api/warehouse-locations'),
        fetch('/api/item-catalog'),
      ])

      if (!locationResponse.ok || !itemResponse.ok) {
        throw new Error('API response was not successful.')
      }

      const locationData = await locationResponse.json()
      const itemData = await itemResponse.json()

      setLocationCatalog(locationData)
      setItemCatalog(itemData)
    } catch {
      setMasterErrorMessage('기준정보 API에 연결할 수 없습니다. 백엔드 서버 상태를 확인하세요.')
    } finally {
      setMasterLoading(false)
    }
  }, [])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadWarehouseData()
      loadMasterData()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [loadMasterData, loadWarehouseData])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <button type="button" className="brand-mark" onClick={onMoveHome} title="메인으로 이동">
            <LayoutGrid size={21} />
          </button>
          <div>
            <strong>SaaS WMS</strong>
            <span>운영 콘솔</span>
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
                    onClick={() => onNavigate(`/app/${item.id}`)}
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
            <p className="eyebrow">{activePage.eyebrow}</p>
            <h1>{activePage.title}</h1>
          </div>
          <div className="user-chip">
            <span>게스트</span>
            <strong>시연 사용자</strong>
          </div>
        </header>

        {activeMenu === 'guide' ? <GuideView /> : null}
        {activeMenu === 'inventory' ? (
          <InventoryStatusView
            dashboardSummary={dashboardSummary}
            errorMessage={errorMessage}
            filteredInventories={filteredInventories}
            keyword={keyword}
            loading={loading}
            onKeywordChange={setKeyword}
            onRefresh={loadWarehouseData}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'inventory-history' ? (
          <InventoryHistoryView
            errorMessage={errorMessage}
            filteredHistories={filteredHistories}
            historyKeyword={historyKeyword}
            historySummary={historySummary}
            loading={loading}
            onHistoryKeywordChange={setHistoryKeyword}
            onRefresh={loadWarehouseData}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'locations' ? (
          <LocationMasterView
            catalog={locationCatalog}
            errorMessage={masterErrorMessage}
            loading={masterLoading}
            onRefresh={loadMasterData}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'items' ? (
          <ItemMasterView
            catalog={itemCatalog}
            errorMessage={masterErrorMessage}
            loading={masterLoading}
            onRefresh={loadMasterData}
            page={activePage}
          />
        ) : null}
        {!['guide', 'inventory', 'inventory-history', 'locations', 'items'].includes(activeMenu) ? (
          <PlaceholderWorkView page={activePage} />
        ) : null}
      </main>
    </div>
  )
}

function InventoryStatusView({
  dashboardSummary,
  errorMessage,
  filteredInventories,
  keyword,
  loading,
  onKeywordChange,
  onRefresh,
  page,
}) {
  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="품목 위치" value={dashboardSummary.totalSku} tone="blue" />
        <MetricCard label="총 재고" value={dashboardSummary.totalStock.toLocaleString()} tone="teal" />
        <MetricCard label="가용 재고" value={dashboardSummary.totalAvailable.toLocaleString()} tone="navy" />
        <MetricCard label="부족 주의" value={dashboardSummary.lowStockCount} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="재고 관리"
        title="재고 현황"
        toolbar={
          <>
            <button type="button" className="icon-button" onClick={onRefresh} title="새로고침">
              <RefreshCw size={16} />
            </button>
            <button type="button" className="primary-button">
              <BarChart3 size={16} />
              조회
            </button>
          </>
        }
      >
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
            {loading ? '조회 중...' : `${filteredInventories.length}건`}
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
      </WorkPage>
    </div>
  )
}

function InventoryHistoryView({
  errorMessage,
  filteredHistories,
  historyKeyword,
  historySummary,
  loading,
  onHistoryKeywordChange,
  onRefresh,
  page,
}) {
  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="전체 이력" value={historySummary.totalHistory} tone="blue" />
        <MetricCard label="입고 계열" value={historySummary.inboundCount} tone="teal" />
        <MetricCard label="출고 계열" value={historySummary.outboundCount} tone="navy" />
        <MetricCard label="반품 계열" value={historySummary.returnCount} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="재고 이동"
        title="재고 이력"
        toolbar={
          <>
            <button type="button" className="icon-button" onClick={onRefresh} title="새로고침">
              <RefreshCw size={16} />
            </button>
            <button type="button" className="primary-button">
              <Search size={16} />
              조회
            </button>
          </>
        }
      >
        <div className="filter-bar">
          <label className="search-field">
            <Search size={16} />
            <input
              type="search"
              placeholder="이력 유형, 품목코드, 로케이션, 사유 검색"
              value={historyKeyword}
              onChange={(event) => onHistoryKeywordChange(event.target.value)}
            />
          </label>
          <div className="status-message">
            {loading ? '조회 중...' : `${filteredHistories.length}건`}
          </div>
        </div>

        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}

        <WmsGrid
          columns={historyColumns}
          data={filteredHistories}
          minBodyHeight={430}
          rowHeaders={rowNumberHeaders}
        />
      </WorkPage>
    </div>
  )
}

function LocationMasterView({ catalog, errorMessage, loading, onRefresh, page }) {
  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="창고" value={catalog.warehouses.length} tone="blue" />
        <MetricCard label="Area" value={catalog.areas.length} tone="teal" />
        <MetricCard label="Zone" value={catalog.zones.length} tone="navy" />
        <MetricCard label="Location" value={catalog.locations.length} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="위치 기준정보"
        title="창고 위치 체계"
        toolbar={<RefreshButton loading={loading} onRefresh={onRefresh} />}
      >
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={warehouseColumns} data={catalog.warehouses} title="창고" />
          <GridSection columns={areaColumns} data={catalog.areas} title="Area" />
          <GridSection columns={zoneColumns} data={catalog.zones} title="Zone" />
          <GridSection columns={locationColumns} data={catalog.locations} title="Location" />
        </div>
      </WorkPage>
    </div>
  )
}

function ItemMasterView({ catalog, errorMessage, loading, onRefresh, page }) {
  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="대분류" value={catalog.itemMasters.length} tone="blue" />
        <MetricCard label="중분류" value={catalog.itemClasses.length} tone="teal" />
        <MetricCard label="품목" value={catalog.items.length} tone="navy" />
        <MetricCard label="사용 품목" value={catalog.items.filter((item) => item.useYn === 'Y').length} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="품목 기준정보"
        title="품목 분류 체계"
        toolbar={<RefreshButton loading={loading} onRefresh={onRefresh} />}
      >
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={itemMasterColumns} data={catalog.itemMasters} title="품목 마스터" />
          <GridSection columns={itemClassColumns} data={catalog.itemClasses} title="품목 클래스" />
          <GridSection columns={itemColumns} data={catalog.items} title="품목" wide />
        </div>
      </WorkPage>
    </div>
  )
}

function GridSection({ columns, data, title, wide = false }) {
  return (
    <section className={`grid-section ${wide ? 'wide' : ''}`}>
      <div className="grid-section-header">
        <h3>{title}</h3>
        <span>{data.length}건</span>
      </div>
      <WmsGrid columns={columns} data={data} minBodyHeight={190} rowHeaders={rowNumberHeaders} />
    </section>
  )
}

function RefreshButton({ loading, onRefresh }) {
  return (
    <button type="button" className="icon-button" disabled={loading} onClick={onRefresh} title="새로고침">
      <RefreshCw size={16} />
    </button>
  )
}

function WorkPage({ children, description, eyebrow, title, toolbar }) {
  return (
    <section className="work-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          {description ? <p className="panel-description">{description}</p> : null}
        </div>
        {toolbar ? <div className="button-row">{toolbar}</div> : null}
      </div>
      {children}
    </section>
  )
}

function PlaceholderWorkView({ page }) {
  return (
    <WorkPage description={page.description} eyebrow={page.eyebrow} title={page.title}>
      <div className="empty-workspace">
        <FileText size={26} />
        <strong>화면 설계 대기</strong>
        <p>이 메뉴는 다음 작업 단위에서 그리드와 API 데이터를 연결합니다.</p>
      </div>
    </WorkPage>
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
            <p className="eyebrow">운영 가이드</p>
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
