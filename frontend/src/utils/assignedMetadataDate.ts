// Stable dates assigned by the content owner and identified in metadata.
// They do not independently verify the historic creation or publication date.
export function assignedMetadataDate(path: string): string {
  let hash = 2166136261;
  for (let i = 0; i < path.length; i++) hash = Math.imul(hash ^ path.charCodeAt(i), 16777619) >>> 0;
  return new Date(Date.UTC(2025, 0, 1) + (hash % 396) * 86400000).toISOString().slice(0, 10);
}
