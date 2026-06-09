import {
  Boxes,
  ChevronDown,
  ClipboardList,
  FileText,
  Home,
  LayoutGrid,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const menuGroups = [
  {
    title: '대시보드',
    items: [
      { id: 'dashboard', label: '대시보드', icon: Home },
      { id: 'guide', label: '시연 가이드', icon: FileText },
    ],
  },
  {
    title: '기준 정보',
    items: [
      {
        id: 'location-info',
        label: '로케이션 정보',
        icon: Warehouse,
        children: [
          { id: 'warehouse', label: '창고', route: '/app/warehouse' },
          { id: 'area', label: 'Area', route: '/app/area' },
          { id: 'zone', label: 'Zone', route: '/app/zone' },
          { id: 'location', label: 'Location', route: '/app/location' },
        ],
      },
      {
        id: 'item-info',
        label: '품목',
        icon: PackageSearch,
        children: [
          { id: 'item-master', label: '품목 마스터', route: '/app/items' },
          { id: 'item-class', label: '품목 클래스', route: '/app/items' },
          { id: 'item', label: '품목', route: '/app/items' },
        ],
      },
    ],
  },
  {
    title: '주문',
    items: [
      { id: 'purchase', label: '구매주문', icon: ClipboardList },
      { id: 'sales', label: '판매주문', icon: ShoppingCart },
      { id: 'returns', label: '반품관리', icon: RotateCcw },
    ],
  },
  {
    title: '입출고/재고',
    items: [
      { id: 'receiving', label: '입고관리', icon: PackageCheck },
      { id: 'inventory', label: '재고 현황', icon: Boxes },
      { id: 'inventory-history', label: '재고 이력', icon: PackageCheck },
      { id: 'shipping', label: '출고관리', icon: Truck },
    ],
  },
  {
    title: '청구서',
    items: [
      { id: 'billing', label: '청구관리', icon: ShieldCheck },
    ],
  },
]

const menuSearchItems = menuGroups.flatMap((group) => group.items.flatMap((item) => {
  if (item.children) {
    return item.children.map((child) => ({
      ...child,
      group: group.title,
      parent: item.label,
      icon: item.icon,
    }))
  }

  return [{
    ...item,
    group: group.title,
    route: `/app/${item.id}`,
  }]
}))

function isMenuActive(activeMenu, item) {
  if (item.children) {
    return item.children.some((child) => child.route?.replace('/app/', '') === activeMenu)
  }

  return activeMenu === item.id
}

function getActiveParentIds(activeMenu) {
  const parentIds = []

  for (const group of menuGroups) {
    for (const item of group.items) {
      if (item.children?.some((child) => child.route?.replace('/app/', '') === activeMenu)) {
        parentIds.push(item.id)
      }
    }
  }

  return parentIds
}

export function Sidebar({ activeMenu, onMoveHome, onNavigate }) {
  const [keyword, setKeyword] = useState('')
  const [expandedMenus, setExpandedMenus] = useState(() => new Set(getActiveParentIds(activeMenu)))

  const searchResults = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    if (!normalizedKeyword) return []

    return menuSearchItems
      .filter((item) => `${item.group} ${item.parent ?? ''} ${item.label}`.toLowerCase().includes(normalizedKeyword))
      .slice(0, 8)
  }, [keyword])

  const handleNavigate = (route) => {
    setKeyword('')
    const targetMenu = route.replace(/^\/app\/?/, '')
    const activeParentIds = getActiveParentIds(targetMenu)

    if (activeParentIds.length > 0) {
      setExpandedMenus((previous) => {
        const next = new Set(previous)

        for (const parentId of activeParentIds) {
          next.add(parentId)
        }

        return next
      })
    }

    onNavigate(route)
  }

  const toggleMenu = (item) => {
    setExpandedMenus((previous) => {
      const next = new Set(previous)

      if (next.has(item.id)) {
        next.delete(item.id)
      } else {
        next.add(item.id)
      }

      return next
    })
  }

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

      <div className="menu-search">
        <Search size={15} />
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="메뉴 검색..."
        />
        {searchResults.length > 0 ? (
          <div className="menu-search-results">
            {searchResults.map((item, index) => {
              const Icon = item.icon ?? FileText

              return (
                <button
                  type="button"
                  className={index === 0 ? 'selected' : ''}
                  key={`${item.parent ?? item.group}-${item.id}`}
                  onClick={() => handleNavigate(item.route)}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                  <small>{item.parent ?? item.group}</small>
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      <nav className="side-nav">
        {menuGroups.map((group) => (
          <section className="nav-group" key={group.title}>
            <p>{group.title}</p>
            {group.items.map((item) => {
              const Icon = item.icon
              const active = isMenuActive(activeMenu, item)
              const hasChildren = Boolean(item.children)
              const expanded = hasChildren && expandedMenus.has(item.id)

              return (
                <div className="nav-item-block" key={item.id}>
                  <button
                    type="button"
                    className={[
                      active ? 'active' : '',
                      hasChildren ? 'parent-menu' : '',
                      expanded ? 'expanded' : '',
                    ].filter(Boolean).join(' ')}
                    aria-expanded={hasChildren ? expanded : undefined}
                    onClick={() => (hasChildren ? toggleMenu(item) : handleNavigate(`/app/${item.id}`))}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                    {hasChildren ? <ChevronDown className="nav-chevron" size={14} /> : null}
                  </button>
                  {hasChildren && expanded ? (
                    <div className="nav-sub-items" role="group" aria-label={`${item.label} 하위 메뉴`}>
                      {item.children.map((child) => (
                        <button
                          type="button"
                          className={activeMenu === child.id ? 'active child-active' : ''}
                          key={child.id}
                          onClick={() => handleNavigate(child.route)}
                        >
                          <span>{child.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </section>
        ))}
      </nav>
    </aside>
  )
}
