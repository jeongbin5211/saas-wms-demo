export function TabLayout({ activeTab, onTabChange, tabs, toolbar }) {
  return (
    <section className="tab-work-card">
      <div className="card_btn">
        <div className="card-tab-list">
          {tabs.map((tab, index) => (
            <button
              type="button"
              className={activeTab === index ? 'active' : ''}
              key={tab.label}
              onClick={() => onTabChange(index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {toolbar ? <div className="card-toolbar">{toolbar}</div> : null}
      </div>
      <div className="card_body">
        {tabs[activeTab]?.content}
      </div>
    </section>
  )
}
