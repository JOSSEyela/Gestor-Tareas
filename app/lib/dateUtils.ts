export function formatRelativeDate(isoString: string): string {
  const date   = new Date(isoString);
  const now    = new Date();
  const diffMs = now.getTime() - date.getTime();

  const mins  = Math.floor(diffMs / 60_000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);

  if (mins  <  1) return "ahora mismo";
  if (mins  < 60) return `hace ${mins}m`;
  if (hours < 24) return `hace ${hours}h`;
  if (days  ===1) return "ayer";
  if (days  <  7) return `hace ${days}d`;

  return date.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}
