function Header({ title, children, showClose = true }) {
  return (
    <div className="window-title-bar">
      <div className="window-title-bar-text">{title}</div>
      <div className="window-controls">
        {children} {/* Render any passed children (e.g., logout button) */}
        {showClose && <button>X</button>}
      </div>
    </div>
  )
}

export default Header
