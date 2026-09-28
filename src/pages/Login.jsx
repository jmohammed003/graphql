import { useState } from "react";

export default function Login({ onSignIn, initialMessage = "" }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialMessage);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSignIn(identifier.trim(), password);
    } catch (reason) {
      setError(reason.message || "Sign in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="login-wrap">
      <section className="login-card" aria-labelledby="login-title">
        <div className="brand-mark" aria-hidden="true">01</div>
        <p className="eyebrow">LEARNING PROFILE</p>
        <h1 id="login-title">Your progress,<br />in one place.</h1>
        <p className="intro">Sign in with your school username or email to view your profile.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="identifier">Username or email</label>
          <input id="identifier" autoComplete="username" required value={identifier} onChange={event => setIdentifier(event.target.value)} />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} />
          {error && <p className="error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}<span aria-hidden="true">↗</span>
          </button>
        </form>
        <p className="login-foot">Credentials are sent directly to the school authentication service.</p>
      </section>
    </main>
  );
}
