import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const KPI_COLORS = ['#2563eb', '#0d9488', '#7c3aed', '#d97706']

export function DashboardPage({ data }) {
  const { inventories, inboundFlow, outboundFlow } = data
  const { purchaseOrders, receivings } = inboundFlow
  const { salesOrders, shippings } = outboundFlow

  const kpiCards = [
    {
      label: '총 재고 수량',
      value: inventories.reduce((sum, i) => sum + (i.quantity ?? 0), 0).toLocaleString(),
      unit: '개',
      sub: `${inventories.length}개 품목`,
    },
    {
      label: '구매주문 대기',
      value: purchaseOrders.filter((o) => o.orderStatusSubCode === 'WAITING').length,
      unit: '건',
      sub: `전체 ${purchaseOrders.length}건`,
    },
    {
      label: '입고 대기',
      value: receivings.filter((r) => r.receivingStatusSubCode === 'WAITING').length,
      unit: '건',
      sub: `전체 ${receivings.length}건`,
    },
    {
      label: '판매주문 대기',
      value: salesOrders.filter((o) => o.orderStatusSubCode === 'WAITING').length,
      unit: '건',
      sub: `전체 ${salesOrders.length}건`,
    },
  ]

  const monthlyChart = buildMonthlyChart(receivings, shippings)
  const topItems = buildTopItems(inventories)

  return (
    <section className="dashboard-page">
      <div className="kpi-grid">
        {kpiCards.map((card, i) => (
          <div className="kpi-card" key={card.label}>
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value-row">
              <strong className="kpi-value" style={{ color: KPI_COLORS[i] }}>
                {card.value}
              </strong>
              <span className="kpi-unit">{card.unit}</span>
            </div>
            <span className="kpi-sub">{card.sub}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3 className="chart-title">월별 입출고 추이 (최근 6개월)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyChart} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="입고" fill="#2563eb" radius={[3, 3, 0, 0]} />
              <Bar dataKey="출고" fill="#0d9488" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">품목별 재고 현황 (상위 5개)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={topItems}
              layout="vertical"
              margin={{ top: 8, right: 32, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={90} />
              <Tooltip />
              <Bar dataKey="수량" radius={[0, 3, 3, 0]}>
                {topItems.map((_, i) => (
                  <Cell key={i} fill={['#2563eb', '#0d9488', '#7c3aed', '#d97706', '#dc2626'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-status">
        <div className="status-card">
          <h3 className="chart-title">출고 대기 현황</h3>
          <table className="status-table">
            <thead>
              <tr>
                <th>출고번호</th>
                <th>판매주문번호</th>
                <th>출고일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {shippings.filter((s) => s.shippingStatusSubCode === 'WAITING').slice(0, 5).map((s) => (
                <tr key={s.id}>
                  <td>{s.shippingNo}</td>
                  <td>{s.salesOrderNo}</td>
                  <td>{s.shippingDate}</td>
                  <td><span className="badge badge-waiting">대기</span></td>
                </tr>
              ))}
              {shippings.filter((s) => s.shippingStatusSubCode === 'WAITING').length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af' }}>대기 중인 출고가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

function buildMonthlyChart(receivings, shippings) {
  const months = getLast6Months()
  return months.map((month) => ({
    month,
    입고: receivings.filter((r) => r.receivingDate?.startsWith(month)).length,
    출고: shippings.filter((s) => s.shippingDate?.startsWith(month)).length,
  }))
}

function getLast6Months() {
  const result = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }
  return result
}

function buildTopItems(inventories) {
  const itemMap = {}
  for (const inv of inventories) {
    const key = inv.itemCode
    itemMap[key] = (itemMap[key] ?? 0) + (inv.quantity ?? 0)
  }
  return Object.entries(itemMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([code, qty]) => ({ name: code, 수량: qty }))
}
