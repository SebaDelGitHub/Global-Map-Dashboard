import type { CountryData } from '../types/CountryData';

export function mergeCsvRowsIntoMapData(prev: CountryData[], rows: CountryData[]): CountryData[] {
  const map = new Map<string, CountryData>();
  for (const p of prev) {
    const key = (p.isoCode || p.name || '').toUpperCase();
    map.set(key, { ...p });
  }

  for (const r of rows) {
    const iso = (r.isoCode || '').toUpperCase();
    const name = (r.name || '').toUpperCase();
    if (iso && map.has(iso)) {
      map.set(iso, { ...map.get(iso)!, value: r.value });
    } else if (iso) {
      map.set(iso, { isoCode: iso, name: r.name || iso, value: r.value });
    } else if (name) {
      const existingKey = Array.from(map.keys()).find(k => k === name);
      if (existingKey) {
        map.set(existingKey, { ...map.get(existingKey)!, value: r.value });
      } else {
        map.set(name, { isoCode: '', name: r.name || '', value: r.value });
      }
    }
  }

  return Array.from(map.values());
}
