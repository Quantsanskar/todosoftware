function ActivityLog({ actions }) {
  return (
    <div className="window activity-log-panel">
      <h3>Activity Log</h3>
      {actions.length === 0 ? (
        <p>No recent activity.</p>
      ) : (
        <div>
          {actions.map((action) => (
            <div key={action._id} className="activity-log-item">
              <strong>{action.username}</strong> {action.details} ({new Date(action.timestamp).toLocaleString()})
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityLog
