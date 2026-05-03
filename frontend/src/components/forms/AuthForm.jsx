import { useState } from "react";

const initialValues = {
  username: "",
  email: "",
  password: ""
};

export function AuthForm({ mode, onSubmit, busy, error }) {
  const [values, setValues] = useState(initialValues);

  return (
    <form
      className="auth-form"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <label>
        Username or Email
        <input
          value={values.username}
          onChange={(event) => setValues((prev) => ({ ...prev, username: event.target.value }))}
          required
        />
      </label>
      {mode === "register" ? (
        <label>
          Email
          <input
            type="email"
            value={values.email}
            onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
          />
        </label>
      ) : null}
      <label>
        Password
        <input
          type="password"
          value={values.password}
          onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
          required
        />
      </label>
      {error ? <p className="error-text">{error}</p> : null}
      <button className="primary-button" type="submit" disabled={busy}>
        {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
      </button>
    </form>
  );
}

