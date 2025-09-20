import worldCountries from 'world-countries';

export function downloadEmptyCountriesCsv(fileName = 'countries-template.csv') {
  try {
    const rows: string[] = [];
    rows.push('isoCode,name,value');

    // Build rows from world-countries
    const seen = new Set<string>();
    const list = (worldCountries as any[])
      .map((c: any) => ({ iso: String(c.cca3 || '').toUpperCase(), name: String(c?.name?.common || c?.name || '').trim() }))
      .filter((c) => Boolean(c.iso) && Boolean(c.name));

    for (const c of list) {
      if (seen.has(c.iso)) continue;
      seen.add(c.iso);
      const escName = c.name.replace(/"/g, '""');
      rows.push(`${c.iso},"${escName}",`);
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error('Failed to build countries CSV', e);
  }
}

export default downloadEmptyCountriesCsv;
