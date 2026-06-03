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

const statusCodeGroups = [
  'WAREHOUSE_TYPE',
  'INVENTORY_HISTORY_TYPE',
  'PURCHASE_ORDER_STATUS',
  'RECEIVING_STATUS',
  'SALES_ORDER_STATUS',
  'SHIPPING_STATUS',
  'PURCHASE_RETURN_STATUS',
  'SALES_RETURN_STATUS',
  'BILL_STATUS',
]

const fallbackCodeNames = {
  WAREHOUSE_TYPE: {
    MAIN: '일반 창고',
    RETURN: '반품 창고',
  },
  INVENTORY_HISTORY_TYPE: {
    INBOUND: '입고',
    OUTBOUND: '출고',
    ADJUSTMENT: '조정',
    RETURN_INBOUND: '반품입고',
    RETURN_OUTBOUND: '반품출고',
  },
  PURCHASE_ORDER_STATUS: {
    WAITING: '대기',
    RECEIVED: '입고완료',
    CLOSED: '마감',
  },
  RECEIVING_STATUS: {
    WAITING: '대기',
    CONFIRMED: '확정',
  },
  SALES_ORDER_STATUS: {
    WAITING: '대기',
    SHIPPED: '출고완료',
    BILLED: '청구완료',
  },
  SHIPPING_STATUS: {
    WAITING: '대기',
    CONFIRMED: '확정',
  },
  PURCHASE_RETURN_STATUS: {
    WAITING: '대기',
    SHIPPED: '반품출고',
  },
  SALES_RETURN_STATUS: {
    WAITING: '대기',
    RECEIVED: '반품입고',
  },
  BILL_STATUS: {
    ISSUED: '발행',
    PAID: '입금완료',
  },
}

const statusToneBySubCode = {
  WAITING: 'amber',
  CONFIRMED: 'teal',
  RECEIVED: 'teal',
  SHIPPED: 'blue',
  BILLED: 'blue',
  ISSUED: 'blue',
  PAID: 'teal',
  CLOSED: 'navy',
  INBOUND: 'teal',
  OUTBOUND: 'blue',
  ADJUSTMENT: 'amber',
  RETURN_INBOUND: 'teal',
  RETURN_OUTBOUND: 'red',
}

const statusBadgeFormatter = ({ value }) => {
  if (!value) {
    return ''
  }

  const label = value.label ?? value
  const tone = value.tone ?? 'navy'

  return `<span class="status-badge ${tone}">${label}</span>`
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
  { header: '이력 유형', name: 'historyTypeDisplay', width: 150, formatter: statusBadgeFormatter },
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
  { header: '창고 유형', name: 'warehouseTypeDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
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

const purchaseOrderColumns = [
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '공급사', name: 'supplierAccountName', width: 180 },
  { header: '주문 상태', name: 'orderStatusDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
  { header: '주문일', name: 'orderDate', width: 120, align: 'center' },
  { header: '비고', name: 'note', width: 280 },
]

const purchaseOrderDetailColumns = [
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '주문 수량', name: 'orderQuantity', width: 110, align: 'right' },
  { header: '단가', name: 'unitPrice', width: 100, align: 'right' },
  { header: '금액', name: 'amount', width: 110, align: 'right' },
]

const receivingColumns = [
  { header: '입고 번호', name: 'receivingNo', width: 170 },
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '입고 상태', name: 'receivingStatusDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
  { header: '입고일', name: 'receivingDate', width: 120, align: 'center' },
]

const receivingDetailColumns = [
  { header: '입고 번호', name: 'receivingNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '로케이션', name: 'locationCode', width: 130, align: 'center' },
  { header: '입고 수량', name: 'receivedQuantity', width: 110, align: 'right' },
]

const salesOrderColumns = [
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '고객사', name: 'customerAccountName', width: 180 },
  { header: '주문 상태', name: 'orderStatusDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
  { header: '주문일', name: 'orderDate', width: 120, align: 'center' },
  { header: '비고', name: 'note', width: 280 },
]

const salesOrderDetailColumns = [
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '주문 수량', name: 'orderQuantity', width: 110, align: 'right' },
  { header: '단가', name: 'unitPrice', width: 100, align: 'right' },
  { header: '금액', name: 'amount', width: 110, align: 'right' },
]

const shippingColumns = [
  { header: '출고 번호', name: 'shippingNo', width: 170 },
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '출고 상태', name: 'shippingStatusDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
  { header: '출고일', name: 'shippingDate', width: 120, align: 'center' },
]

const shippingDetailColumns = [
  { header: '출고 번호', name: 'shippingNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '로케이션', name: 'locationCode', width: 130, align: 'center' },
  { header: '출고 수량', name: 'shippedQuantity', width: 110, align: 'right' },
]

const purchaseReturnColumns = [
  { header: '구매반품 번호', name: 'purchaseReturnNo', width: 170 },
  { header: '구매주문 번호', name: 'purchaseOrderNo', width: 180 },
  { header: '반품 상태', name: 'returnStatusDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
  { header: '반품일', name: 'returnDate', width: 120, align: 'center' },
  { header: '사유', name: 'reason', width: 280 },
]

const purchaseReturnDetailColumns = [
  { header: '구매반품 번호', name: 'purchaseReturnNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '로케이션', name: 'locationCode', width: 130, align: 'center' },
  { header: '반품 수량', name: 'returnQuantity', width: 110, align: 'right' },
]

const salesReturnColumns = [
  { header: '판매반품 번호', name: 'salesReturnNo', width: 170 },
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '반품 상태', name: 'returnStatusDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
  { header: '반품일', name: 'returnDate', width: 120, align: 'center' },
  { header: '사유', name: 'reason', width: 280 },
]

const salesReturnDetailColumns = [
  { header: '판매반품 번호', name: 'salesReturnNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '로케이션', name: 'locationCode', width: 130, align: 'center' },
  { header: '반품 수량', name: 'returnQuantity', width: 110, align: 'right' },
]

const billColumns = [
  { header: '청구 번호', name: 'billNo', width: 170 },
  { header: '판매주문 번호', name: 'salesOrderNo', width: 180 },
  { header: '청구 상태', name: 'billStatusDisplay', width: 120, align: 'center', formatter: statusBadgeFormatter },
  { header: '청구일', name: 'billDate', width: 120, align: 'center' },
  { header: '청구 금액', name: 'totalAmount', width: 120, align: 'right' },
]

const billDetailColumns = [
  { header: '청구 번호', name: 'billNo', width: 170 },
  { header: '품목 코드', name: 'itemCode', width: 180 },
  { header: '품목명', name: 'itemName', width: 210 },
  { header: '청구 수량', name: 'billQuantity', width: 110, align: 'right' },
  { header: '단가', name: 'unitPrice', width: 100, align: 'right' },
  { header: '금액', name: 'amount', width: 110, align: 'right' },
]

const rowNumberHeaders = ['rowNum']
const selectableRowHeaders = ['rowNum', 'checkbox']
const inventorySummaryColumns = ['quantity', 'allocatedQuantity', 'availableQuantity']
const emptyLocationCatalog = { warehouses: [], areas: [], zones: [], locations: [] }
const emptyItemCatalog = { itemMasters: [], itemClasses: [], items: [] }
const emptyInboundFlow = { purchaseOrders: [], purchaseOrderDetails: [], receivings: [], receivingDetails: [] }
const emptyOutboundFlow = { salesOrders: [], salesOrderDetails: [], shippings: [], shippingDetails: [] }
const emptyReturnFlow = { purchaseReturns: [], purchaseReturnDetails: [], salesReturns: [], salesReturnDetails: [] }
const emptyBillingFlow = { bills: [], billDetails: [] }
const emptyCodeMaps = {}
const authTokenKey = 'wmsAuthToken'
const authUserKey = 'wmsAuthUser'
const savedEmailKey = 'savedEmail'
const roleNames = {
  ADMIN: '관리자',
  STAFF: '일반 직원',
  GUEST: '게스트',
}

function saveAuthSession(auth) {
  const user = {
    userId: auth.userId,
    accountId: auth.accountId,
    topAccountId: auth.topAccountId,
    name: auth.name,
    email: auth.email,
    roleSubCode: auth.roleSubCode,
  }

  window.localStorage.setItem(authTokenKey, auth.token)
  window.localStorage.setItem(authUserKey, JSON.stringify(user))

  return user
}

function loadAuthUser() {
  const rawUser = window.localStorage.getItem(authUserKey)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    window.localStorage.removeItem(authUserKey)
    return null
  }
}

function clearAuthSession() {
  window.localStorage.removeItem(authTokenKey)
  window.localStorage.removeItem(authUserKey)
}

function fetchWithAuth(input, options = {}) {
  const token = window.localStorage.getItem(authTokenKey)
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(input, {
    ...options,
    headers,
  })
}

function normalizeAccountCode(value) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function buildCodeMaps(groupResults) {
  const codeMaps = {}

  for (const result of groupResults) {
    codeMaps[result.groupCode] = {}

    for (const code of result.codes) {
      codeMaps[result.groupCode][code.subCode] = code.codeName
    }
  }

  return codeMaps
}

function resolveCodeName(codeMaps, groupCode, subCode) {
  if (!subCode) {
    return ''
  }

  return codeMaps[groupCode]?.[subCode] ?? fallbackCodeNames[groupCode]?.[subCode] ?? subCode
}

function buildStatusDisplay(codeMaps, groupCode, subCode) {
  return {
    label: resolveCodeName(codeMaps, groupCode, subCode),
    tone: statusToneBySubCode[subCode] ?? 'navy',
  }
}

function withStatusDisplay(row, codeMaps, groupCode, sourceField, targetField) {
  return {
    ...row,
    [targetField]: buildStatusDisplay(codeMaps, groupCode, row[sourceField]),
  }
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
      <WorkspaceApp
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

  const requestLogin = async (loginEmail, loginPassword) => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setMessage('사용자 계정과 비밀번호를 입력하세요.')
      return
    }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail.trim(),
          password: loginPassword,
        }),
      })

      if (!response.ok) {
        throw new Error('login-failed')
      }

      const auth = await response.json()

      if (saveEmail) {
        window.localStorage.setItem(savedEmailKey, loginEmail.trim())
      } else {
        window.localStorage.removeItem(savedEmailKey)
      }

      onLogin(auth)
    } catch {
      setMessage('계정 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setSubmitting(false)
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

    requestLogin(guestEmail, guestPassword)
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

function WorkspaceApp({ authUser, onLogout, onMoveHome, onNavigate, route }) {
  const [inventories, setInventories] = useState([])
  const [histories, setHistories] = useState([])
  const [locationCatalog, setLocationCatalog] = useState(emptyLocationCatalog)
  const [itemCatalog, setItemCatalog] = useState(emptyItemCatalog)
  const [inboundFlow, setInboundFlow] = useState(emptyInboundFlow)
  const [outboundFlow, setOutboundFlow] = useState(emptyOutboundFlow)
  const [returnFlow, setReturnFlow] = useState(emptyReturnFlow)
  const [billingFlow, setBillingFlow] = useState(emptyBillingFlow)
  const [codeMaps, setCodeMaps] = useState(emptyCodeMaps)
  const [keyword, setKeyword] = useState('')
  const [historyKeyword, setHistoryKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [masterLoading, setMasterLoading] = useState(false)
  const [inboundLoading, setInboundLoading] = useState(false)
  const [outboundLoading, setOutboundLoading] = useState(false)
  const [returnLoading, setReturnLoading] = useState(false)
  const [billingLoading, setBillingLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [masterErrorMessage, setMasterErrorMessage] = useState('')
  const [inboundErrorMessage, setInboundErrorMessage] = useState('')
  const [outboundErrorMessage, setOutboundErrorMessage] = useState('')
  const [returnErrorMessage, setReturnErrorMessage] = useState('')
  const [billingErrorMessage, setBillingErrorMessage] = useState('')
  const activeMenu = route.replace(/^\/app\/?/, '') || 'inventory'
  const activePage = internalPages[activeMenu] ?? internalPages.inventory

  const displayHistories = useMemo(() => {
    const rows = []

    for (const history of histories) {
      rows.push(withStatusDisplay(history, codeMaps, 'INVENTORY_HISTORY_TYPE', 'historyTypeSubCode', 'historyTypeDisplay'))
    }

    return rows
  }, [codeMaps, histories])

  const displayLocationCatalog = useMemo(() => {
    const warehouses = []

    for (const warehouse of locationCatalog.warehouses) {
      warehouses.push(withStatusDisplay(warehouse, codeMaps, 'WAREHOUSE_TYPE', 'warehouseTypeSubCode', 'warehouseTypeDisplay'))
    }

    return {
      ...locationCatalog,
      warehouses,
    }
  }, [codeMaps, locationCatalog])

  const displayInboundFlow = useMemo(() => {
    const purchaseOrders = []
    const receivings = []

    for (const purchaseOrder of inboundFlow.purchaseOrders) {
      purchaseOrders.push(
        withStatusDisplay(purchaseOrder, codeMaps, 'PURCHASE_ORDER_STATUS', 'orderStatusSubCode', 'orderStatusDisplay'),
      )
    }

    for (const receiving of inboundFlow.receivings) {
      receivings.push(
        withStatusDisplay(receiving, codeMaps, 'RECEIVING_STATUS', 'receivingStatusSubCode', 'receivingStatusDisplay'),
      )
    }

    return {
      ...inboundFlow,
      purchaseOrders,
      receivings,
    }
  }, [codeMaps, inboundFlow])

  const displayOutboundFlow = useMemo(() => {
    const salesOrders = []
    const shippings = []

    for (const salesOrder of outboundFlow.salesOrders) {
      salesOrders.push(
        withStatusDisplay(salesOrder, codeMaps, 'SALES_ORDER_STATUS', 'orderStatusSubCode', 'orderStatusDisplay'),
      )
    }

    for (const shipping of outboundFlow.shippings) {
      shippings.push(
        withStatusDisplay(shipping, codeMaps, 'SHIPPING_STATUS', 'shippingStatusSubCode', 'shippingStatusDisplay'),
      )
    }

    return {
      ...outboundFlow,
      salesOrders,
      shippings,
    }
  }, [codeMaps, outboundFlow])

  const displayReturnFlow = useMemo(() => {
    const purchaseReturns = []
    const salesReturns = []

    for (const purchaseReturn of returnFlow.purchaseReturns) {
      purchaseReturns.push(
        withStatusDisplay(purchaseReturn, codeMaps, 'PURCHASE_RETURN_STATUS', 'returnStatusSubCode', 'returnStatusDisplay'),
      )
    }

    for (const salesReturn of returnFlow.salesReturns) {
      salesReturns.push(
        withStatusDisplay(salesReturn, codeMaps, 'SALES_RETURN_STATUS', 'returnStatusSubCode', 'returnStatusDisplay'),
      )
    }

    return {
      ...returnFlow,
      purchaseReturns,
      salesReturns,
    }
  }, [codeMaps, returnFlow])

  const displayBillingFlow = useMemo(() => {
    const bills = []

    for (const bill of billingFlow.bills) {
      bills.push(withStatusDisplay(bill, codeMaps, 'BILL_STATUS', 'billStatusSubCode', 'billStatusDisplay'))
    }

    return {
      ...billingFlow,
      bills,
    }
  }, [billingFlow, codeMaps])

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
      return displayHistories
    }

    return displayHistories.filter((history) => {
      const historyType = String(history.historyTypeSubCode ?? '').toLowerCase()
      const historyTypeLabel = String(history.historyTypeDisplay?.label ?? '').toLowerCase()
      const itemCode = String(history.itemCode ?? '').toLowerCase()
      const locationCode = String(history.locationCode ?? '').toLowerCase()
      const reason = String(history.reason ?? '').toLowerCase()

      return (
        historyType.includes(normalizedKeyword) ||
        historyTypeLabel.includes(normalizedKeyword) ||
        itemCode.includes(normalizedKeyword) ||
        locationCode.includes(normalizedKeyword) ||
        reason.includes(normalizedKeyword)
      )
    })
  }, [displayHistories, historyKeyword])

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
        fetchWithAuth('/api/inventories'),
        fetchWithAuth('/api/inventory-histories'),
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

  const loadCommonCodes = useCallback(async () => {
    try {
      const groupResults = []

      for (const groupCode of statusCodeGroups) {
        const response = await fetchWithAuth(`/api/common-codes/${groupCode}`)

        if (!response.ok) {
          throw new Error('API response was not successful.')
        }

        const codes = await response.json()
        groupResults.push({ groupCode, codes })
      }

      setCodeMaps(buildCodeMaps(groupResults))
    } catch {
      setCodeMaps(emptyCodeMaps)
    }
  }, [])

  const loadMasterData = useCallback(async () => {
    setMasterLoading(true)
    setMasterErrorMessage('')

    try {
      const [locationResponse, itemResponse] = await Promise.all([
        fetchWithAuth('/api/warehouse-locations'),
        fetchWithAuth('/api/item-catalog'),
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

  const loadInboundFlow = useCallback(async () => {
    setInboundLoading(true)
    setInboundErrorMessage('')

    try {
      const [purchaseResponse, purchaseDetailResponse, receivingResponse, receivingDetailResponse] =
        await Promise.all([
          fetchWithAuth('/api/purchase-orders'),
          fetchWithAuth('/api/purchase-order-details'),
          fetchWithAuth('/api/receivings'),
          fetchWithAuth('/api/receiving-details'),
        ])

      if (
        !purchaseResponse.ok ||
        !purchaseDetailResponse.ok ||
        !receivingResponse.ok ||
        !receivingDetailResponse.ok
      ) {
        throw new Error('API response was not successful.')
      }

      const [purchaseOrders, purchaseOrderDetails, receivings, receivingDetails] = await Promise.all([
        purchaseResponse.json(),
        purchaseDetailResponse.json(),
        receivingResponse.json(),
        receivingDetailResponse.json(),
      ])

      setInboundFlow({ purchaseOrders, purchaseOrderDetails, receivings, receivingDetails })
    } catch {
      setInboundErrorMessage('구매/입고 API에 연결할 수 없습니다. 백엔드 서버 상태를 확인하세요.')
    } finally {
      setInboundLoading(false)
    }
  }, [])

  const loadOutboundFlow = useCallback(async () => {
    setOutboundLoading(true)
    setOutboundErrorMessage('')

    try {
      const [salesResponse, salesDetailResponse, shippingResponse, shippingDetailResponse] =
        await Promise.all([
          fetchWithAuth('/api/sales-orders'),
          fetchWithAuth('/api/sales-order-details'),
          fetchWithAuth('/api/shippings'),
          fetchWithAuth('/api/shipping-details'),
        ])

      if (!salesResponse.ok || !salesDetailResponse.ok || !shippingResponse.ok || !shippingDetailResponse.ok) {
        throw new Error('API response was not successful.')
      }

      const [salesOrders, salesOrderDetails, shippings, shippingDetails] = await Promise.all([
        salesResponse.json(),
        salesDetailResponse.json(),
        shippingResponse.json(),
        shippingDetailResponse.json(),
      ])

      setOutboundFlow({ salesOrders, salesOrderDetails, shippings, shippingDetails })
    } catch {
      setOutboundErrorMessage('판매/출고 API에 연결할 수 없습니다. 백엔드 서버 상태를 확인하세요.')
    } finally {
      setOutboundLoading(false)
    }
  }, [])

  const loadReturnFlow = useCallback(async () => {
    setReturnLoading(true)
    setReturnErrorMessage('')

    try {
      const [purchaseReturnResponse, purchaseReturnDetailResponse, salesReturnResponse, salesReturnDetailResponse] =
        await Promise.all([
          fetchWithAuth('/api/purchase-returns'),
          fetchWithAuth('/api/purchase-return-details'),
          fetchWithAuth('/api/sales-returns'),
          fetchWithAuth('/api/sales-return-details'),
        ])

      if (
        !purchaseReturnResponse.ok ||
        !purchaseReturnDetailResponse.ok ||
        !salesReturnResponse.ok ||
        !salesReturnDetailResponse.ok
      ) {
        throw new Error('API response was not successful.')
      }

      const [purchaseReturns, purchaseReturnDetails, salesReturns, salesReturnDetails] = await Promise.all([
        purchaseReturnResponse.json(),
        purchaseReturnDetailResponse.json(),
        salesReturnResponse.json(),
        salesReturnDetailResponse.json(),
      ])

      setReturnFlow({ purchaseReturns, purchaseReturnDetails, salesReturns, salesReturnDetails })
    } catch {
      setReturnErrorMessage('반품 API에 연결할 수 없습니다. 백엔드 서버 상태를 확인하세요.')
    } finally {
      setReturnLoading(false)
    }
  }, [])

  const loadBillingFlow = useCallback(async () => {
    setBillingLoading(true)
    setBillingErrorMessage('')

    try {
      const [billResponse, billDetailResponse] = await Promise.all([
        fetchWithAuth('/api/bills'),
        fetchWithAuth('/api/bill-details'),
      ])

      if (!billResponse.ok || !billDetailResponse.ok) {
        throw new Error('API response was not successful.')
      }

      const [bills, billDetails] = await Promise.all([billResponse.json(), billDetailResponse.json()])

      setBillingFlow({ bills, billDetails })
    } catch {
      setBillingErrorMessage('청구 API에 연결할 수 없습니다. 백엔드 서버 상태를 확인하세요.')
    } finally {
      setBillingLoading(false)
    }
  }, [])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadWarehouseData()
      loadCommonCodes()
      loadMasterData()
      loadInboundFlow()
      loadOutboundFlow()
      loadReturnFlow()
      loadBillingFlow()
    }, 0)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [
    loadBillingFlow,
    loadCommonCodes,
    loadInboundFlow,
    loadMasterData,
    loadOutboundFlow,
    loadReturnFlow,
    loadWarehouseData,
  ])

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
          <div className="user-actions">
            <div className="user-chip">
              <span>{roleNames[authUser.roleSubCode] ?? authUser.roleSubCode}</span>
              <strong>{authUser.name}</strong>
            </div>
            <button type="button" className="logout-button" onClick={onLogout}>
              로그아웃
            </button>
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
            catalog={displayLocationCatalog}
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
        {activeMenu === 'purchase' ? (
          <PurchaseOrderView
            errorMessage={inboundErrorMessage}
            flow={displayInboundFlow}
            loading={inboundLoading}
            onRefresh={loadInboundFlow}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'receiving' ? (
          <ReceivingView
            errorMessage={inboundErrorMessage}
            flow={displayInboundFlow}
            loading={inboundLoading}
            onRefresh={loadInboundFlow}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'sales' ? (
          <SalesOrderView
            errorMessage={outboundErrorMessage}
            flow={displayOutboundFlow}
            loading={outboundLoading}
            onRefresh={loadOutboundFlow}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'shipping' ? (
          <ShippingView
            errorMessage={outboundErrorMessage}
            flow={displayOutboundFlow}
            loading={outboundLoading}
            onRefresh={loadOutboundFlow}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'returns' ? (
          <ReturnView
            errorMessage={returnErrorMessage}
            flow={displayReturnFlow}
            loading={returnLoading}
            onRefresh={loadReturnFlow}
            page={activePage}
          />
        ) : null}
        {activeMenu === 'billing' ? (
          <BillingView
            errorMessage={billingErrorMessage}
            flow={displayBillingFlow}
            loading={billingLoading}
            onRefresh={loadBillingFlow}
            page={activePage}
          />
        ) : null}
        {![
          'guide',
          'inventory',
          'inventory-history',
          'locations',
          'items',
          'purchase',
          'receiving',
          'sales',
          'shipping',
          'returns',
          'billing',
        ].includes(activeMenu) ? (
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

function PurchaseOrderView({ errorMessage, flow, loading, onRefresh, page }) {
  const totalAmount = flow.purchaseOrderDetails.reduce((sum, detail) => sum + Number(detail.amount ?? 0), 0)
  const [filterOpen, setFilterOpen] = useState(true)

  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="구매주문" value={flow.purchaseOrders.length} tone="blue" />
        <MetricCard label="주문 상세" value={flow.purchaseOrderDetails.length} tone="teal" />
        <MetricCard label="주문 금액" value={totalAmount.toLocaleString()} tone="navy" />
        <MetricCard label="입고 연결" value={flow.receivings.length} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="구매 흐름"
        title="구매주문"
        toolbar={<WorkSearchButtons filterOpen={filterOpen} loading={loading} onRefresh={onRefresh} onToggle={() => setFilterOpen(!filterOpen)} />}
      >
        <WorkSearchPanel open={filterOpen}>
          <SearchInput label="주문일" type="date" />
          <SearchInput label="구매주문 번호" placeholder="PO 번호" />
          <SearchInput label="공급사" placeholder="공급사명" />
          <SearchSelect label="주문 상태" options={['대기', '입고완료', '마감']} />
        </WorkSearchPanel>
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={purchaseOrderColumns} data={flow.purchaseOrders} title="구매주문" />
          <GridSection columns={purchaseOrderDetailColumns} data={flow.purchaseOrderDetails} title="구매주문 상세" />
        </div>
      </WorkPage>
    </div>
  )
}

function ReceivingView({ errorMessage, flow, loading, onRefresh, page }) {
  const totalReceived = flow.receivingDetails.reduce(
    (sum, detail) => sum + Number(detail.receivedQuantity ?? 0),
    0,
  )
  const [filterOpen, setFilterOpen] = useState(true)

  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="입고 건수" value={flow.receivings.length} tone="blue" />
        <MetricCard label="입고 상세" value={flow.receivingDetails.length} tone="teal" />
        <MetricCard label="입고 수량" value={totalReceived.toLocaleString()} tone="navy" />
        <MetricCard label="구매 연결" value={flow.purchaseOrders.length} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="입고 흐름"
        title="입고관리"
        toolbar={<WorkSearchButtons filterOpen={filterOpen} loading={loading} onRefresh={onRefresh} onToggle={() => setFilterOpen(!filterOpen)} />}
      >
        <WorkSearchPanel open={filterOpen}>
          <SearchInput label="입고일" type="date" />
          <SearchInput label="입고 번호" placeholder="RCV 번호" />
          <SearchInput label="구매주문 번호" placeholder="PO 번호" />
          <SearchSelect label="입고 상태" options={['대기', '확정']} />
          <SearchInput label="품목" placeholder="품목 코드 또는 품목명" wide />
        </WorkSearchPanel>
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={receivingColumns} data={flow.receivings} title="입고" />
          <GridSection columns={receivingDetailColumns} data={flow.receivingDetails} title="입고 상세" />
        </div>
      </WorkPage>
    </div>
  )
}

function SalesOrderView({ errorMessage, flow, loading, onRefresh, page }) {
  const totalAmount = flow.salesOrderDetails.reduce((sum, detail) => sum + Number(detail.amount ?? 0), 0)
  const [filterOpen, setFilterOpen] = useState(true)

  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="판매주문" value={flow.salesOrders.length} tone="blue" />
        <MetricCard label="주문 상세" value={flow.salesOrderDetails.length} tone="teal" />
        <MetricCard label="주문 금액" value={totalAmount.toLocaleString()} tone="navy" />
        <MetricCard label="출고 연결" value={flow.shippings.length} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="판매 흐름"
        title="판매주문"
        toolbar={<WorkSearchButtons filterOpen={filterOpen} loading={loading} onRefresh={onRefresh} onToggle={() => setFilterOpen(!filterOpen)} />}
      >
        <WorkSearchPanel open={filterOpen}>
          <SearchInput label="주문일" type="date" />
          <SearchInput label="판매주문 번호" placeholder="SO 번호" />
          <SearchInput label="고객사" placeholder="고객사명" />
          <SearchSelect label="주문 상태" options={['대기', '출고완료', '청구완료']} />
        </WorkSearchPanel>
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={salesOrderColumns} data={flow.salesOrders} title="판매주문" />
          <GridSection columns={salesOrderDetailColumns} data={flow.salesOrderDetails} title="판매주문 상세" />
        </div>
      </WorkPage>
    </div>
  )
}

function ShippingView({ errorMessage, flow, loading, onRefresh, page }) {
  const totalShipped = flow.shippingDetails.reduce((sum, detail) => sum + Number(detail.shippedQuantity ?? 0), 0)
  const [filterOpen, setFilterOpen] = useState(true)

  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="출고 건수" value={flow.shippings.length} tone="blue" />
        <MetricCard label="출고 상세" value={flow.shippingDetails.length} tone="teal" />
        <MetricCard label="출고 수량" value={totalShipped.toLocaleString()} tone="navy" />
        <MetricCard label="판매 연결" value={flow.salesOrders.length} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="출고 흐름"
        title="출고관리"
        toolbar={<WorkSearchButtons filterOpen={filterOpen} loading={loading} onRefresh={onRefresh} onToggle={() => setFilterOpen(!filterOpen)} />}
      >
        <WorkSearchPanel open={filterOpen}>
          <SearchInput label="출고일" type="date" />
          <SearchInput label="출고 번호" placeholder="SHP 번호" />
          <SearchInput label="판매주문 번호" placeholder="SO 번호" />
          <SearchSelect label="출고 상태" options={['대기', '확정']} />
          <SearchInput label="품목" placeholder="품목 코드 또는 품목명" wide />
        </WorkSearchPanel>
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={shippingColumns} data={flow.shippings} title="출고" />
          <GridSection columns={shippingDetailColumns} data={flow.shippingDetails} title="출고 상세" />
        </div>
      </WorkPage>
    </div>
  )
}

function ReturnView({ errorMessage, flow, loading, onRefresh, page }) {
  const purchaseReturnQuantity = flow.purchaseReturnDetails.reduce(
    (sum, detail) => sum + Number(detail.returnQuantity ?? 0),
    0,
  )
  const salesReturnQuantity = flow.salesReturnDetails.reduce(
    (sum, detail) => sum + Number(detail.returnQuantity ?? 0),
    0,
  )
  const [filterOpen, setFilterOpen] = useState(true)

  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="구매반품" value={flow.purchaseReturns.length} tone="blue" />
        <MetricCard label="판매반품" value={flow.salesReturns.length} tone="teal" />
        <MetricCard label="구매반품 수량" value={purchaseReturnQuantity.toLocaleString()} tone="navy" />
        <MetricCard label="판매반품 수량" value={salesReturnQuantity.toLocaleString()} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="반품 흐름"
        title="반품관리"
        toolbar={<WorkSearchButtons filterOpen={filterOpen} loading={loading} onRefresh={onRefresh} onToggle={() => setFilterOpen(!filterOpen)} />}
      >
        <WorkSearchPanel open={filterOpen}>
          <SearchInput label="반품일" type="date" />
          <SearchInput label="반품 번호" placeholder="PR 또는 SR 번호" />
          <SearchSelect label="반품 구분" options={['구매반품', '판매반품']} />
          <SearchSelect label="반품 상태" options={['대기', '반품출고', '반품입고']} />
          <SearchInput label="품목" placeholder="품목 코드 또는 품목명" wide />
        </WorkSearchPanel>
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={purchaseReturnColumns} data={flow.purchaseReturns} title="구매반품" />
          <GridSection columns={purchaseReturnDetailColumns} data={flow.purchaseReturnDetails} title="구매반품 상세" />
          <GridSection columns={salesReturnColumns} data={flow.salesReturns} title="판매반품" />
          <GridSection columns={salesReturnDetailColumns} data={flow.salesReturnDetails} title="판매반품 상세" />
        </div>
      </WorkPage>
    </div>
  )
}

function BillingView({ errorMessage, flow, loading, onRefresh, page }) {
  const totalAmount = flow.bills.reduce((sum, bill) => sum + Number(bill.totalAmount ?? 0), 0)
  const detailAmount = flow.billDetails.reduce((sum, detail) => sum + Number(detail.amount ?? 0), 0)
  const [filterOpen, setFilterOpen] = useState(true)

  return (
    <div className="screen-stack">
      <section className="metric-grid">
        <MetricCard label="청구서" value={flow.bills.length} tone="blue" />
        <MetricCard label="청구 상세" value={flow.billDetails.length} tone="teal" />
        <MetricCard label="청구 금액" value={totalAmount.toLocaleString()} tone="navy" />
        <MetricCard label="상세 금액" value={detailAmount.toLocaleString()} tone="amber" />
      </section>

      <WorkPage
        description={page.description}
        eyebrow="청구 흐름"
        title="청구관리"
        toolbar={<WorkSearchButtons filterOpen={filterOpen} loading={loading} onRefresh={onRefresh} onToggle={() => setFilterOpen(!filterOpen)} />}
      >
        <WorkSearchPanel open={filterOpen}>
          <SearchInput label="청구일" type="date" />
          <SearchInput label="청구 번호" placeholder="BILL 번호" />
          <SearchInput label="판매주문 번호" placeholder="SO 번호" />
          <SearchSelect label="청구 상태" options={['발행', '입금완료']} />
        </WorkSearchPanel>
        {errorMessage ? <div className="error-banner">{errorMessage}</div> : null}
        <div className="master-grid-layout">
          <GridSection columns={billColumns} data={flow.bills} title="청구서" />
          <GridSection columns={billDetailColumns} data={flow.billDetails} title="청구 상세" />
        </div>
      </WorkPage>
    </div>
  )
}

function GridSection({ columns, data, title, wide = false }) {
  const [selectedRow, setSelectedRow] = useState(null)

  return (
    <section className={`grid-section ${wide ? 'wide' : ''}`}>
      <div className="grid-section-header">
        <h3>{title}</h3>
        <span>{selectedRow ? '선택됨' : `${data.length}건`}</span>
      </div>
      <WmsGrid
        columns={columns}
        data={data}
        minBodyHeight={190}
        rowHeaders={rowNumberHeaders}
        onRowDoubleClick={setSelectedRow}
      />
      {selectedRow ? <GridRowDetail row={selectedRow} /> : null}
    </section>
  )
}

function WorkSearchButtons({ filterOpen, loading, onRefresh, onToggle }) {
  return (
    <>
      <button type="button" className="primary-button" disabled={loading} onClick={onRefresh}>
        <Search size={16} />
        조회
      </button>
      <button type="button" className="danger-button" onClick={onRefresh}>
        초기화
      </button>
      <button type="button" className="icon-button" onClick={onToggle} title={filterOpen ? '검색조건 접기' : '검색조건 펼치기'}>
        {filterOpen ? '접기' : '열기'}
      </button>
    </>
  )
}

function WorkSearchPanel({ children, open }) {
  if (!open) {
    return null
  }

  return <div className="work-search-panel">{children}</div>
}

function SearchInput({ label, placeholder = '', type = 'text', wide = false }) {
  return (
    <label className={`work-search-field ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      <input placeholder={placeholder} type={type} />
    </label>
  )
}

function SearchSelect({ label, options, wide = false }) {
  return (
    <label className={`work-search-field ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      <select defaultValue="">
        <option value="" />
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

function GridRowDetail({ row }) {
  const entries = []

  for (const [key, value] of Object.entries(row)) {
    if (key === 'rowKey' || key === 'sortKey' || key.endsWith('Display')) {
      continue
    }

    entries.push([key, formatDetailValue(value)])
  }

  return (
    <div className="grid-row-detail">
      <div className="grid-row-detail-title">
        <strong>선택 행 상세</strong>
        <span>더블클릭한 행의 원본 데이터</span>
      </div>
      <dl>
        {entries.map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function formatDetailValue(value) {
  if (value == null || value === '') {
    return '-'
  }

  if (typeof value === 'object') {
    return value.label ?? JSON.stringify(value)
  }

  return String(value)
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
