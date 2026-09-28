import { useEffect, useState } from "react";
import StatCard from "../components/StatCard.jsx";
import PieChart from "../components/PieChart.jsx";
import BarChart from "../components/BarChart.jsx";
import { fetchProfile } from "../api/graphql.js";
import { formatBytes } from "../utils/formatBytes.js";

const pretty = value => new Intl.NumberFormat().format(Math.round(value));

function welcomeName(user) {
  let attrs = user.attrs;
  if (typeof attrs === "string") {
    try { attrs = JSON.parse(attrs); } catch { attrs = {}; }
  }
  attrs = attrs && typeof attrs === "object" ? attrs : {};
  const first = attrs.firstName ?? attrs.first_name ?? attrs.givenName ?? attrs.given_name;
  const last = attrs.lastName ?? attrs.last_name ?? attrs.familyName ?? attrs.family_name;
  return [first, last].filter(value => typeof value === "string" && value.trim()).join(" ") || user.login || "student";
}

function summarize(transactions) {
  const summary = { xp: 0, xpCount: 0, level: 0, up: 0, down: 0, skills: {} };
  for (const transaction of transactions) {
    const amount = Number(transaction.amount) || 0;
    if (transaction.type === "xp") {
      summary.xp += amount;
      summary.xpCount += 1;
    }
    else if (transaction.type === "level") summary.level = Math.max(summary.level, amount);
    else if (transaction.type === "up") summary.up += amount;
    else if (transaction.type === "down") summary.down += amount;
    else if (transaction.type?.startsWith("skill_")) {
      summary.skills[transaction.type] = Math.max(summary.skills[transaction.type] || 0, amount);
    }
  }
  return summary;
}

export default function Profile({ token, onLogout, onSessionExpired }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchProfile(token)
      .then(data => { if (active) setProfile({ ...data, summary: summarize(data.transactions) }); })
      .catch(reason => {
        if (!active) return;
        if (reason.sessionExpired) onSessionExpired(reason.message);
        else setError(reason.message || "Could not load your profile.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, onSessionExpired, attempt]);

  return (
    <div className="profile-page">
      <header className="topbar">
        <a className="wordmark" href="#profile" onClick={event => event.preventDefault()}><span className="brand-mark small">01</span> PROFILE</a>
        <button className="quiet-button" onClick={onLogout} type="button">Log out <span aria-hidden="true">↗</span></button>
      </header>
      <main className="content">
        <section className="welcome-row">
          <div><p className="eyebrow">YOUR LEARNING OVERVIEW</p><h1>Welcome, {profile?.user ? welcomeName(profile.user) : "student"}</h1><p className="muted">A snapshot of your learning progress.</p></div>
          <span className="live-tag"><i /> LIVE DATA</span>
        </section>
        {loading && <div className="loading-state"><span className="spinner" /> Loading your profile…</div>}
        {error && <div className="error banner" role="alert">{error} <button className="inline-retry" type="button" onClick={() => setAttempt(value => value + 1)}>Try again</button></div>}
        {!loading && !error && profile && <>
          <section className="stat-grid" aria-label="Profile statistics">
            <StatCard label="USER" value={profile.user.login || "—"} note={`ID ${profile.user.id}`} />
            <StatCard label="CURRENT LEVEL" value={pretty(profile.summary.level)} note="Highest level transaction" />
            <StatCard label="TOTAL XP" value={formatBytes(profile.summary.xp)} note={`bh-module · ${profile.summary.xpCount} transactions`} />
          </section>
          <section className="chart-grid">
            <article className="panel chart-panel">
              <div className="panel-heading"><div><p className="eyebrow">AUDIT ACTIVITY</p><h2>Audit ratio</h2></div><span className="chart-unit">Done up / received down</span></div>
              <PieChart up={profile.summary.up} down={profile.summary.down} />
              <p className="ratio-note">Audit ratio: {profile.summary.down === 0 ? "— (no audits received)" : (profile.summary.up / profile.summary.down).toFixed(1)}</p>
            </article>
            <article className="panel chart-panel skills-panel">
              <div className="panel-heading"><div><p className="eyebrow">SKILL RECORDS</p><h2>Skills</h2></div><span className="chart-unit">Highest value per skill</span></div>
              <div className="bar-area"><BarChart skills={profile.summary.skills} /></div>
            </article>
          </section>
          <p className="data-foot">Profile data is fetched from the school GraphQL API for the signed-in account.</p>
        </>}
      </main>
    </div>
  );
}
