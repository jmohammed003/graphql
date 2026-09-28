const format = value => new Intl.NumberFormat().format(value);

export default function BarChart({ skills }) {
  const entries = Object.entries(skills).sort(([a], [b]) => a.localeCompare(b));
  if (!entries.length) return <div className="empty-chart">No skill transactions available yet.</div>;

  const width = 760;
  const rowHeight = 42;
  const height = Math.max(150, entries.length * rowHeight + 24);
  const max = Math.max(...entries.map(([, value]) => value), 1);
  const labelWidth = 130;
  const valueWidth = 56;
  const barWidth = width - labelWidth - valueWidth - 20;
  return (
    <svg className="skills-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Highest value for each skill">
      {entries.map(([skill, value], index) => {
        const y = 12 + index * rowHeight;
        const length = (value / max) * barWidth;
        return (
          <g key={skill}>
            <text x="0" y={y + 19} className="skill-label">{skill.replace(/^skill_/, "")}</text>
            <rect x={labelWidth} y={y + 3} width={barWidth} height="22" rx="3" className="bar-track" />
            <rect x={labelWidth} y={y + 3} width={length} height="22" rx="3" className="skill-bar" />
            <text x={width} y={y + 19} textAnchor="end" className="skill-value">{format(value)}</text>
          </g>
        );
      })}
    </svg>
  );
}
