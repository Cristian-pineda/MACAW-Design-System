/** "WithIcons" → "With icons"; "KpiRow" → "Kpi row". */
export function humanize(name: string): string {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}

export function formatBytes(bytes: number): string {
  return `${new Intl.NumberFormat('en-US').format(bytes)} bytes`;
}

export const STATUS_TONE = {
  planned: 'neutral',
  alpha: 'warning',
  beta: 'info',
  stable: 'success',
  deprecated: 'critical',
} as const;
