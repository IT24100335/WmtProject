import { Panel } from "../../components/common/Panel";

export function UsersOverview({ users = [] }) {
  return (
    <Panel eyebrow="Users" title="Accounts">
      <div className="stack compact">
        {users.map((user) => (
          <article key={user._id} className="mini-card">
            <div className="panel-top">
              <strong>{user.username}</strong>
              <span className="pill muted">{user.role}</span>
            </div>
            <div className="meta-row">
              <span>{user.email || "No email"}</span>
              <span>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never logged in"}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}

