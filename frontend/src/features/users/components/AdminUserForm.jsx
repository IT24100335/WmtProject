import { USER_ROLES } from "../../../constants/roles";
import { formatRole } from "../../../utils/formatters";

export function AdminUserForm({ form, onChange, errors = {} }) {
  return (
    <>
      <label>
        Username
        <input value={form.username} onChange={(event) => onChange({ ...form, username: event.target.value })} />
        {errors.username ? <span className="field-error">{errors.username}</span> : null}
      </label>
      <label>
        Email
        <input type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} />
        {errors.email ? <span className="field-error">{errors.email}</span> : null}
      </label>
      <label>
        Password
        <input
          type="password"
          value={form.password}
          onChange={(event) => onChange({ ...form, password: event.target.value })}
          placeholder={form._id ? "Leave blank to keep current password" : ""}
        />
        {errors.password ? <span className="field-error">{errors.password}</span> : null}
      </label>
      <label>
        Role
        <select value={form.role} onChange={(event) => onChange({ ...form, role: event.target.value })}>
          {USER_ROLES.map((role) => (
            <option key={role} value={role}>
              {formatRole(role)}
            </option>
          ))}
        </select>
        {errors.role ? <span className="field-error">{errors.role}</span> : null}
      </label>
    </>
  );
}
