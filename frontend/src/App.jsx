import {
  ArrowRight,
  Boxes,
  Building2,
  CircleDollarSign,
  ClipboardList,
  FileText,
  LayoutGrid,
  LogIn,
  PackageCheck,
  RotateCcw,
  ServerCog,
  ShoppingCart,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { WorkspaceRouter } from './router/index.jsx'
import { authTokenKey, clearAuthSession, loadAuthUser, saveAuthSession, savedEmailKey } from './router/session.js'

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
    title: '게스트 계정으로 전체 업무 흐름을 체험할 수 있습니다.',
    description: '로그인 화면에서 "게스트 시연" 버튼을 클릭하면 바로 입장할 수 있습니다. 아래 순서대로 따라가면 OMS + WMS 전체 흐름을 자연스럽게 확인할 수 있습니다.',
    cards: [
      ['1단계 — 기준정보', '위치정보(창고·Area·Zone·Location)와 품목정보(대분류·중분류·품목)를 먼저 확인합니다.'],
      ['2단계 — 구매주문 & 입고', '구매주문을 조회하고 입고관리에서 "입고확정" 버튼을 클릭합니다. 재고가 증가합니다.'],
      ['3단계 — 판매주문 & 출고', '판매주문을 조회하고 출고관리에서 "출고확정" 버튼을 클릭합니다. 청구서가 자동 생성됩니다.'],
      ['4단계 — 반품 & 청구', '반품관리에서 구매반품/판매반품 확정을 처리하고 청구관리에서 청구서를 확인합니다.'],
    ],
  },
  '/tech': {
    kicker: '기술/인프라',
    title: '실무에서 쓰는 기술 스택으로 3계층 아키텍처를 구성했습니다.',
    description: 'Java 21 + Spring Boot 3.x + React 19 + MySQL 기반으로 개발하고, Docker + AWS(EC2·RDS·S3·CloudFront) + GitHub Actions로 CI/CD 파이프라인을 구축했습니다.',
    cards: [
      ['백엔드', 'Java 21 · Spring Boot 3.x · Spring Data JPA · Spring Security · JWT · OAuth2(Google/Kakao) · Swagger'],
      ['프론트엔드', 'React 19 · Vite · Tailwind CSS · TOAST UI Grid · Recharts · SPA 커스텀 라우팅'],
      ['인프라', 'AWS EC2(Docker) · RDS MySQL · S3 + CloudFront · GitHub Actions CI/CD · Nginx 리버스 프록시'],
      ['설계 원칙', 'DDD 도메인 패키지 구조 · 멀티테넌트 · 역할 기반 접근제어(RBAC) · 수평 확장 대비 설계'],
    ],
  },
}

function normalizeAccountCode(value) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function App() {
  const [route, setRoute] = useState(() => window.location.pathname)
  const [authUser, setAuthUser] = useState(loadAuthUser)

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

  const handleLogin = useCallback((auth) => {
    const user = saveAuthSession(auth)
    setAuthUser(user)
    navigate('/app/inventory')
  }, [navigate])

  const handleLogout = useCallback(() => {
    const token = window.localStorage.getItem(authTokenKey)

    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch(() => {})
    }

    clearAuthSession()
    setAuthUser(null)
    navigate('/login')
  }, [navigate])

  if (route.startsWith('/app')) {
    if (!authUser) {
      return <LoginPage onLogin={handleLogin} onNavigate={navigate} />
    }

    return (
      <WorkspaceRouter
        authUser={authUser}
        onLogout={handleLogout}
        onMoveHome={() => navigate('/')}
        onNavigate={navigate}
        route={route}
      />
    )
  }

  if (route === '/login') {
    return <LoginPage onLogin={handleLogin} onNavigate={navigate} />
  }

  if (route === '/register') {
    return <RegisterPage onLogin={handleLogin} onNavigate={navigate} />
  }

  if (route.startsWith('/oauth2/callback')) {
    return <OAuth2CallbackPage onLogin={handleLogin} onNavigate={navigate} />
  }

  return <LandingPage onEnterApp={() => navigate('/login')} onNavigate={navigate} route={route} />
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

function AuthHeader({ onNavigate }) {
  return (
    <header className="auth-header">
      <button type="button" className="landing-brand" onClick={() => onNavigate('/')}>
        <span className="brand-mark light">
          <LayoutGrid size={21} />
        </span>
        <strong>SaaS WMS</strong>
      </button>
    </header>
  )
}

function LoginPage({ onLogin, onNavigate }) {
  const [email, setEmail] = useState(() => window.localStorage.getItem(savedEmailKey) ?? 'guest@saas-wms-demo.com')
  const [password, setPassword] = useState('guest1234')
  const [saveEmail, setSaveEmail] = useState(() => Boolean(window.localStorage.getItem(savedEmailKey)))
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const requestLogin = async (loginEmail, loginPassword, options = {}) => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setMessage('사용자 계정과 비밀번호를 입력하세요.')
      return
    }

    setSubmitting(true)
    setMessage('')

    let auth
    const endpoint = options.demo ? '/api/auth/demo-login' : '/api/auth/login'
    const requestOptions = options.demo
      ? { method: 'POST' }
      : {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        }

    try {
      const response = await fetch(endpoint, requestOptions)

      if (!response.ok) {
        let errorMessage = options.demo
          ? '게스트 시연 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.'
          : '계정 또는 비밀번호가 올바르지 않습니다.'

        try {
          const errorBody = await response.json()
          errorMessage = errorBody.message ?? errorMessage
        } catch {
          // 기본 메시지를 사용한다.
        }

        setMessage(errorMessage)
        return
      }

      auth = await response.json()
    } catch (error) {
      console.error('login request failed', error)
      setMessage('로그인 요청 중 오류가 발생했습니다.')
      return
    } finally {
      setSubmitting(false)
    }

    try {
      if (saveEmail) {
        window.localStorage.setItem(savedEmailKey, loginEmail.trim())
      } else {
        window.localStorage.removeItem(savedEmailKey)
      }

      onLogin(auth)
    } catch (error) {
      console.error('login session failed', error)
      setMessage('로그인 후 화면 전환 중 오류가 발생했습니다.')
    }
  }

  const submitLogin = (event) => {
    event.preventDefault()
    requestLogin(email, password)
  }

  const submitGuestLogin = () => {
    const guestEmail = 'guest@saas-wms-demo.com'
    const guestPassword = 'guest1234'
    setEmail(guestEmail)
    setPassword(guestPassword)

    if (saveEmail) {
      window.localStorage.setItem(savedEmailKey, guestEmail)
    }

    requestLogin(guestEmail, guestPassword, { demo: true })
  }

  return (
    <div className="auth-page">
      <AuthHeader onNavigate={onNavigate} />
      <main className="auth-shell">
        <div className="auth-bg-box" />
        <section className="auth-card login-card">
          <form onSubmit={submitLogin}>
            <div className="auth-title">
              <strong>환영합니다</strong>
              <p>서비스 이용을 위해 로그인이 필요합니다.</p>
            </div>

            {message ? <p className="auth-error">{message}</p> : null}

            <div className="auth-field-stack">
              <input
                id="email-input"
                name="email"
                placeholder="사용자 계정"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                name="password"
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <label className="auth-check">
                <input
                  checked={saveEmail}
                  type="checkbox"
                  onChange={(event) => setSaveEmail(event.target.checked)}
                />
                <span>아이디 저장</span>
              </label>
            </div>

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? '로그인 중' : '로그인'}
            </button>

            <div className="auth-links">
              <button type="button" onClick={submitGuestLogin}>
                게스트 시연
              </button>
              <span>|</span>
              <button type="button" onClick={() => setMessage('시연 버전에서는 비밀번호 찾기를 제공하지 않습니다.')}>
                비밀번호 찾기
              </button>
              <span>|</span>
              <button type="button" onClick={() => onNavigate('/register')}>
                이메일로 가입하기
              </button>
            </div>
          </form>

          <div className="auth-divider"><span>또는 소셜 계정으로 로그인</span></div>

          <div className="oauth-buttons">
            <a className="oauth-button oauth-google" href="/oauth2/authorization/google">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Google로 로그인
            </a>
            <a className="oauth-button oauth-kakao" href="/oauth2/authorization/kakao">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1C4.582 1 1 3.806 1 7.25c0 2.158 1.392 4.052 3.5 5.148L3.75 16l4.25-2.637c.33.046.664.07 1 .07 4.418 0 8-2.806 8-6.25S13.418 1 9 1z" fill="#3C1E1E"/>
              </svg>
              카카오로 로그인
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}

function RegisterPage({ onLogin, onNavigate }) {
  const [agreeAll, setAgreeAll] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submitRegister = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const accountName = String(formData.get('accountName') ?? '').trim()
    const accountCode = normalizeAccountCode(String(formData.get('accountCode') ?? ''))
    const name = String(formData.get('name') ?? '').trim()
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const passwordConfirm = String(formData.get('passwordConfirm') ?? '')

    if (!agreeAll) {
      setMessage('필수 약관에 동의해야 가입 신청을 진행할 수 있습니다.')
      return
    }

    if (!accountName || !accountCode || !name || !email || !password) {
      setMessage('회사 정보와 사용자 계정을 모두 입력하세요.')
      return
    }

    if (password !== passwordConfirm) {
      setMessage('비밀번호 확인 값이 일치하지 않습니다.')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountName,
          accountCode,
          name,
          email,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error('register-failed')
      }

      const auth = await response.json()
      onLogin(auth)
    } catch {
      setMessage('가입 처리 중 오류가 발생했습니다. 이미 등록된 이메일 또는 회사 코드인지 확인하세요.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <AuthHeader onNavigate={onNavigate} />
      <main className="auth-shell register-shell">
        <div className="auth-bg-box" />
        <section className="auth-card register-card">
          <form onSubmit={submitRegister}>
            <div className="auth-title">
              <strong>회원가입</strong>
              <p>회사 정보와 사용자 계정을 입력하세요.</p>
            </div>

            {message ? <p className="auth-info">{message}</p> : null}

            <div className="register-form-grid">
              <label>
                <span>회사명</span>
                <input required name="accountName" placeholder="예: 글로벌 물류" />
              </label>
              <label>
                <span>회사 코드</span>
                <input required name="accountCode" placeholder="예: GLOBAL-LOGISTICS" />
              </label>
              <label>
                <span>담당자명</span>
                <input required name="name" placeholder="예: 홍길동" />
              </label>
              <label>
                <span>이메일</span>
                <input required name="email" placeholder="abcd@company.co.kr" type="email" />
              </label>
              <label>
                <span>비밀번호</span>
                <input required name="password" placeholder="영문/숫자/특수문자 8자 이상" type="password" />
              </label>
              <label>
                <span>비밀번호 확인</span>
                <input required name="passwordConfirm" placeholder="비밀번호 확인" type="password" />
              </label>
              <label>
                <span>업종</span>
                <select required name="industry" defaultValue="">
                  <option value="" disabled />
                  <option value="logistics">물류/창고</option>
                  <option value="commerce">유통/커머스</option>
                  <option value="manufacturing">제조</option>
                </select>
              </label>
              <label>
                <span>사업자등록증</span>
                <input name="businessFile" type="file" />
              </label>
            </div>

            <div className="agree-box">
              <label className="auth-check strong">
                <input
                  checked={agreeAll}
                  type="checkbox"
                  onChange={(event) => setAgreeAll(event.target.checked)}
                />
                <span>전체 약관에 동의합니다.</span>
              </label>
              <div>
                <p>(필수) 서비스 이용약관</p>
                <p>(필수) 회원가입 이용약관</p>
                <p>(필수) 개인정보 처리방침</p>
                <p>(선택) 마케팅 정보 수신 동의</p>
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={submitting}>
              {submitting ? '가입 처리 중' : '가입하기'}
            </button>
            <p className="auth-bottom-link">
              이미 회원이신가요?{' '}
              <button type="button" onClick={() => onNavigate('/login')}>
                로그인하기
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

function OAuth2CallbackPage({ onLogin, onNavigate }) {
  const params = new URLSearchParams(window.location.search)
  const token = params.get('token')
  const [error, setError] = useState(() => (token ? '' : '소셜 로그인에 실패했습니다. 다시 시도해 주세요.'))

  useEffect(() => {
    if (!token) {
      return
    }

    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('me-failed')
        return res.json()
      })
      .then((me) => {
        onLogin({ token, ...me })
      })
      .catch(() => {
        setError('소셜 로그인 처리 중 오류가 발생했습니다.')
      })
  }, [onLogin, token])

  return (
    <div className="auth-page">
      <main className="auth-shell" style={{ justifyContent: 'center', alignItems: 'center' }}>
        {error ? (
          <section className="auth-card" style={{ textAlign: 'center', gap: 16 }}>
            <p className="auth-error">{error}</p>
            <button type="button" className="auth-submit" onClick={() => onNavigate('/login')}>
              로그인으로 돌아가기
            </button>
          </section>
        ) : (
          <p style={{ color: '#667085' }}>소셜 로그인 처리 중...</p>
        )}
      </main>
    </div>
  )
}

export default App
