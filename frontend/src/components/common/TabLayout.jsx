export function TabLayout({ activeTab, onTabChange, tabs }) {
  return (
    <section className="tab-work-card">
      <div className="card_btn">
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
      {tabs.map((tab, index) => (
        <div className="card_body" hidden={activeTab !== index} key={tab.label}>
          {tab.content}
        </div>
      ))}
    </section>
  )
}
