import { useCallback, useEffect, useMemo, useState } from 'react'
import { Header } from '../components/layout/Header.jsx'
import { Sidebar } from '../components/layout/Sidebar.jsx'
import { AccountsPage } from '../pages/accounts/AccountsPage.jsx'
import { BillingPage } from '../pages/billing/BillingPage.jsx'
import { DashboardPage } from '../pages/dashboard/DashboardPage.jsx'
import { InventoryHistoryPage } from '../pages/inventory/InventoryHistoryPage.jsx'
import { InventoryPage } from '../pages/inventory/InventoryPage.jsx'
import { ItemsPage } from '../pages/items/ItemsPage.jsx'
import { LocationsPage } from '../pages/locations/LocationsPage.jsx'
import { PurchasePage } from '../pages/purchase/PurchasePage.jsx'
import { ReceivingPage } from '../pages/receiving/ReceivingPage.jsx'
import { ReturnsPage } from '../pages/returns/ReturnsPage.jsx'
import { SalesPage } from '../pages/sales/SalesPage.jsx'
import { ShippingPage } from '../pages/shipping/ShippingPage.jsx'
import { fetchWithAuth } from './session.js'

const emptyLocationCatalog = { warehouses: [], areas: [], zones: [], locations: [] }
const emptyItemCatalog = { itemMasters: [], itemClasses: [], items: [] }
const emptyInboundFlow = { purchaseOrders: [], purchaseOrderDetails: [], receivings: [], receivingDetails: [] }
const emptyOutboundFlow = { salesOrders: [], salesOrderDetails: [], shippings: [], shippingDetails: [] }
const emptyReturnFlow = { purchaseReturns: [], purchaseReturnDetails: [], salesReturns: [], salesReturnDetails: [] }
const emptyBillingFlow = { bills: [], billDetails: [] }

const internalPages = {
  dashboard: { title: '대시보드', eyebrow: '개요', description: '주요 운영 지표와 진행 상태를 한 화면에서 확인합니다.' },
  guide: { title: '시연 가이드', eyebrow: '개요', description: '업무 흐름을 순서대로 확인하는 안내 화면입니다.' },
  accounts: { title: '거래처', eyebrow: '기준정보', description: '거래처(고객사/공급사) 기준정보를 관리합니다.' },
  locations: { title: '위치정보', eyebrow: '기준정보', description: '창고, Area, Zone, Location 기준정보를 관리합니다.' },
  warehouse: { title: '창고', eyebrow: '기준정보', description: '로케이션 정보의 최상위 단위인 창고를 관리합니다.' },
  area: { title: 'Area', eyebrow: '기준정보', description: '창고 하위 작업 구역인 Area를 관리합니다.' },
  zone: { title: 'Zone', eyebrow: '기준정보', description: 'Area 하위 보관/작업 구역인 Zone을 관리합니다.' },
  location: { title: 'Location', eyebrow: '기준정보', description: '재고가 실제로 보관되는 최하위 로케이션을 관리합니다.' },
  items: { title: '품목정보', eyebrow: '기준정보', description: '품목 마스터, 품목 클래스, 품목 기준정보를 관리합니다.' },
  'item-master': { title: '품목 마스터', eyebrow: '기준정보', description: '품목 분류의 최상위 단위인 품목 마스터를 관리합니다.' },
  'item-class': { title: '품목 클래스', eyebrow: '기준정보', description: '품목 마스터 하위 분류인 품목 클래스를 관리합니다.' },
  item: { title: '품목', eyebrow: '기준정보', description: '품목 클래스에 속한 개별 품목을 관리합니다.' },
  inventory: { title: '재고 현황', eyebrow: '운영관리', description: '품목과 로케이션 기준의 현재고와 가용 재고를 조회합니다.' },
  'inventory-history': { title: '재고 이력', eyebrow: '운영관리', description: '입고, 출고, 반품, 조정으로 발생한 수량 변화를 추적합니다.' },
  purchase: { title: '구매주문', eyebrow: '운영관리', description: '거래처별 구매 요청과 주문 상태를 관리합니다.' },
  receiving: { title: '입고관리', eyebrow: '운영관리', description: '구매주문을 기준으로 입고 예정과 확정 수량을 처리합니다.' },
  sales: { title: '판매주문', eyebrow: '운영관리', description: '판매 요청과 출고 대상 주문을 관리합니다.' },
  shipping: { title: '출고관리', eyebrow: '운영관리', description: '판매주문 기준 출고 지시와 출고 확정을 처리합니다.' },
  returns: { title: '반품관리', eyebrow: '운영관리', description: '구매반품과 판매반품 흐름을 구분해 관리합니다.' },
  billing: { title: '청구관리', eyebrow: '운영관리', description: '출고 완료 내역을 기준으로 청구서를 생성하고 상태를 추적합니다.' },
}

export function WorkspaceRouter({ authUser, onLogout, onMoveHome, onNavigate, route }) {
  const activeMenu = route.replace(/^\/app\/?/, '') || 'inventory'
  const activePage = internalPages[activeMenu] ?? internalPages.inventory
  const [data, setData] = useState({
    inventories: [],
    histories: [],
    accounts: [],
    accountAddresses: [],
    locationCatalog: emptyLocationCatalog,
    itemCatalog: emptyItemCatalog,
    inboundFlow: emptyInboundFlow,
    outboundFlow: emptyOutboundFlow,
    returnFlow: emptyReturnFlow,
    billingFlow: emptyBillingFlow,
  })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const loadAll = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')

    try {
      const [
        inventoryResponse,
        historyResponse,
        accountResponse,
        accountAddressResponse,
        locationResponse,
        itemResponse,
        purchaseResponse,
        purchaseDetailResponse,
        receivingResponse,
        receivingDetailResponse,
        salesResponse,
        salesDetailResponse,
        shippingResponse,
        shippingDetailResponse,
        purchaseReturnResponse,
        purchaseReturnDetailResponse,
        salesReturnResponse,
        salesReturnDetailResponse,
        billResponse,
        billDetailResponse,
      ] = await Promise.all([
        fetchWithAuth('/api/inventories'),
        fetchWithAuth('/api/inventory-histories'),
        fetchWithAuth('/api/accounts'),
        fetchWithAuth('/api/account-addresses'),
        fetchWithAuth('/api/warehouse-locations'),
        fetchWithAuth('/api/item-catalog'),
        fetchWithAuth('/api/purchase-orders'),
        fetchWithAuth('/api/purchase-order-details'),
        fetchWithAuth('/api/receivings'),
        fetchWithAuth('/api/receiving-details'),
        fetchWithAuth('/api/sales-orders'),
        fetchWithAuth('/api/sales-order-details'),
        fetchWithAuth('/api/shippings'),
        fetchWithAuth('/api/shipping-details'),
        fetchWithAuth('/api/purchase-returns'),
        fetchWithAuth('/api/purchase-return-details'),
        fetchWithAuth('/api/sales-returns'),
        fetchWithAuth('/api/sales-return-details'),
        fetchWithAuth('/api/bills'),
        fetchWithAuth('/api/bill-details'),
      ])

      const responses = [
        inventoryResponse,
        historyResponse,
        accountResponse,
        accountAddressResponse,
        locationResponse,
        itemResponse,
        purchaseResponse,
        purchaseDetailResponse,
        receivingResponse,
        receivingDetailResponse,
        salesResponse,
        salesDetailResponse,
        shippingResponse,
        shippingDetailResponse,
        purchaseReturnResponse,
        purchaseReturnDetailResponse,
        salesReturnResponse,
        salesReturnDetailResponse,
        billResponse,
        billDetailResponse,
      ]

      if (responses.some((response) => !response.ok)) {
        throw new Error('api-load-failed')
      }

      const [
        inventories,
        histories,
        accounts,
        accountAddresses,
        locationCatalog,
        itemCatalog,
        purchaseOrders,
        purchaseOrderDetails,
        receivings,
        receivingDetails,
        salesOrders,
        salesOrderDetails,
        shippings,
        shippingDetails,
        purchaseReturns,
        purchaseReturnDetails,
        salesReturns,
        salesReturnDetails,
        bills,
        billDetails,
      ] = await Promise.all(responses.map((response) => response.json()))

      setData({
        inventories,
        histories,
        accounts,
        accountAddresses,
        locationCatalog,
        itemCatalog,
        inboundFlow: { purchaseOrders, purchaseOrderDetails, receivings, receivingDetails },
        outboundFlow: { salesOrders, salesOrderDetails, shippings, shippingDetails },
        returnFlow: { purchaseReturns, purchaseReturnDetails, salesReturns, salesReturnDetails },
        billingFlow: { bills, billDetails },
      })
    } catch {
      setErrorMessage('업무 데이터를 불러올 수 없습니다. 백엔드 서버와 로그인 상태를 확인하세요.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadAll()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [loadAll])

  const pageProps = useMemo(() => ({
    authUser,
    data,
    onRefresh: loadAll,
    page: activePage,
  }), [activePage, authUser, data, loadAll])

  return (
    <div className="app-shell">
      <Sidebar activeMenu={activeMenu} onMoveHome={onMoveHome} onNavigate={onNavigate} />
      <main className="workspace">
        <Header activePage={activePage} authUser={authUser} onLogout={onLogout} />
        {loading ? <div className="info-banner">업무 데이터를 조회 중입니다.</div> : null}
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        {renderPage(activeMenu, pageProps)}
      </main>
    </div>
  )
}

function renderPage(activeMenu, pageProps) {
  if (activeMenu === 'dashboard') return <DashboardPage {...pageProps} />
  if (activeMenu === 'accounts') return <AccountsPage {...pageProps} />
  if (activeMenu === 'locations') return <LocationsPage {...pageProps} />
  if (activeMenu === 'warehouse') return <LocationsPage key="warehouse" {...pageProps} initialTypeTab={0} />
  if (activeMenu === 'area') return <LocationsPage key="area" {...pageProps} initialTypeTab={1} />
  if (activeMenu === 'zone') return <LocationsPage key="zone" {...pageProps} initialTypeTab={2} />
  if (activeMenu === 'location') return <LocationsPage key="location" {...pageProps} initialTypeTab={3} />
  if (activeMenu === 'items') return <ItemsPage {...pageProps} />
  if (activeMenu === 'item-master') return <ItemsPage key="item-master" {...pageProps} initialTypeTab={0} />
  if (activeMenu === 'item-class') return <ItemsPage key="item-class" {...pageProps} initialTypeTab={1} />
  if (activeMenu === 'item') return <ItemsPage key="item" {...pageProps} initialTypeTab={2} />
  if (activeMenu === 'inventory') return <InventoryPage {...pageProps} />
  if (activeMenu === 'inventory-history') return <InventoryHistoryPage {...pageProps} />
  if (activeMenu === 'purchase') return <PurchasePage {...pageProps} />
  if (activeMenu === 'receiving') return <ReceivingPage {...pageProps} />
  if (activeMenu === 'sales') return <SalesPage {...pageProps} />
  if (activeMenu === 'shipping') return <ShippingPage {...pageProps} />
  if (activeMenu === 'returns') return <ReturnsPage {...pageProps} />
  if (activeMenu === 'billing') return <BillingPage {...pageProps} />

  return (
    <section className="empty-workspace">
      <strong>준비 중인 화면입니다.</strong>
      <p>좌측 메뉴에서 운영 화면을 선택하세요.</p>
    </section>
  )
}
