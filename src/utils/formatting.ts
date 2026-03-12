export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function formatTotalTime(prepMinutes: number, cookMinutes: number): string {
  return formatTime(prepMinutes + cookMinutes);
}
