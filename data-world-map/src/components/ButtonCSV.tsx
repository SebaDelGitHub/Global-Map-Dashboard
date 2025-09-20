import React from 'react';
import type { CountryData } from '../types/CountryData';
import { parseCsv } from '../utils/csv';

interface Props {
  onUpload: (rows: CountryData[]) => void;
}

export default function ButtonCSV({ onUpload }: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate extension and mime-type
    const name = (file.name || '').toLowerCase();
    const isCsvByName = name.endsWith('.csv');
    const isCsvByType = file.type === 'text/csv' || file.type === 'application/vnd.ms-excel' || file.type === 'application/csv';
    if (!isCsvByName && !isCsvByType) {
      setError('El archivo debe ser un .csv');
      if (inputRef.current) inputRef.current.value = '';
      setTimeout(() => setError(null), 4000);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '');
      if (!text.includes(',') || text.split(/\r?\n/).length < 2) {
        setError('El contenido no parece un CSV válido');
        if (inputRef.current) inputRef.current.value = '';
        setTimeout(() => setError(null), 4000);
        return;
      }
      const rows = parseCsv(text);
      onUpload(rows);
      if (inputRef.current) inputRef.current.value = '';
      setError(null);
    };
    reader.readAsText(file, 'utf-8');
  };

  // parser now imported from ../utils/csv

  return (
    <label style={{ display: 'inline-block' }}>
      <input ref={inputRef} type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: 'none' }} />
      <button type="button" onClick={() => inputRef.current?.click()}>Upload CSV</button>
      {error && (
        <p style={{ color: '#b00020', marginTop: 8, fontSize: 13 }}>{error}</p>
      )}
    </label>
  );
}