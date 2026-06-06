const roleNames = {
  ADMIN: '관리자',
  STAFF: '일반 직원',
  GUEST: '게스트',
}

export function Header({ activePage, authUser, onLogout }) {
  return (
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
  )
}
