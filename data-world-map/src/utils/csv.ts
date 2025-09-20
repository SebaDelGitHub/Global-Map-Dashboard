import type { CountryData } from '../types/CountryData';

export function splitCsvLine(line: string) {
  const res: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (ch === ',' && !inQuotes) {
      res.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  res.push(cur);
  return res.map(s => s.trim());
}

export function parseCsv(text: string): CountryData[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const header = splitCsvLine(lines[0]).map(h => h.trim().toLowerCase());
  const findIdx = (...variants: string[]) => header.findIndex(h => variants.includes(h));
  const isoIdx = findIdx('isocode');
  const nameIdx = findIdx('name');
  const valueIdx = findIdx('value');

  const out: CountryData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length === 0) continue;
    const iso = isoIdx >= 0 ? (cols[isoIdx] || '').toUpperCase() : undefined;
    const name = nameIdx >= 0 ? (cols[nameIdx] || '') : (cols[0] || '');
    const raw = valueIdx >= 0 ? (cols[valueIdx] || '') : (cols[cols.length - 1] || '');
    const value = raw ? Number(raw.replace(/[^0-9.\-]/g, '')) : undefined;
    if ((iso && iso.length) || (name && name.length)) {
      out.push({ isoCode: (iso || '').trim(), name: (name || '').trim(), value: Number.isFinite(value as number) ? value : undefined });
    }
  }
  return out;
}
