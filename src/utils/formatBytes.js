export function formatBytes(bytes) {
  const value = Number(bytes) || 0;
  const absolute = Math.abs(value);
  const [scaled, unit] = absolute >= 1_000_000
    ? [value / 1_000_000, "MB"]
    : absolute >= 1_000
      ? [value / 1_000, "KB"]
      : [value, "B"];
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(scaled)} ${unit}`;
}
