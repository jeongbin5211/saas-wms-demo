import { Boxes, ClipboardList, FileText, Home, LayoutGrid, PackageCheck, PackageSearch, RotateCcw, ShieldCheck, ShoppingCart, Truck, Warehouse } from 'lucide-react'

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

export function Sidebar({ activeMenu, onMoveHome, onNavigate }) {
  return (
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
  )
}
