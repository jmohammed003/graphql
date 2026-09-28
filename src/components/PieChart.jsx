import { formatBytes } from "../utils/formatBytes.js";

const COLORS = ["#9be66b", "#b89aff"];

export default function PieChart({ up, down }) {
  const total = up + down;
  if (!total) return <div className="empty-chart">No audit transactions available yet.</div>;

  const circumference = 2 * Math.PI * 58;
  const upLength = (up / total) * circumference;
  const ratio = down === 0 ? "—" : `${(up / down).toFixed(1)}:1`;
  return (
    <div className="pie-layout">
      <svg viewBox="0 0 180 180" role="img" aria-label={`Audits done up ${up}, received down ${down}`}>
        <circle cx="90" cy="90" r="58" fill="none" stroke={COLORS[1]} strokeWidth="22" />
        <circle
          cx="90" cy="90" r="58" fill="none" stroke={COLORS[0]} strokeWidth="22"
          strokeDasharray={`${upLength} ${circumference - upLength}`}
          transform="rotate(-90 90 90)" strokeLinecap="butt"
        />
        <text x="90" y="87" textAnchor="middle" className="pie-total">{ratio}</text>
        <text x="90" y="105" textAnchor="middle" className="pie-caption">UP / DOWN</text>
      </svg>
      <div className="chart-legend">
        <p><span className="legend-dot green" /> Done up <strong>{formatBytes(up)}</strong></p>
        <p><span className="legend-dot purple" /> Received down <strong>{formatBytes(down)}</strong></p>
      </div>
    </div>
  );
}
