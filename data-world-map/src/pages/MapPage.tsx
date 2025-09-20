import { useState } from "react";
import WorldMap from "../components/WorldMap";
import { mockData } from "../data/mockData";
import { ValueBar } from "../components/ValueBar";
import { blueScale, warmScale, greenScale } from "../types/Colors";
import ButtonCSV from '../components/ButtonCSV';
import { mergeCsvRowsIntoMapData } from '../utils/mapMerge';
import exportCardAsPng from '../utils/exportImage';

export default function Home() {
  const [palette, setPalette] = useState<string[]>(blueScale);
  const [mapData, setMapData] = useState(mockData);
  const max = Math.max(0, ...(mapData.map((d) => d.value ?? 0)));

  const handleCsvUpload = (rows: any[]) => {
    setMapData(prev => mergeCsvRowsIntoMapData(prev, rows));
  };

  const downloadPng = async (fileName = 'map-card.png') => {
    const node = document.getElementById('app-card');
    if (!node) return;
    await exportCardAsPng(node, fileName, 3);
  };

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <header className="clean-header">
          <h1>Interactive world map data</h1>
        </header>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div className="palette-group">
            {[blueScale, warmScale, greenScale].map((group, gi) => {
              const mid = group[Math.floor(group.length / 2)];
              const name = gi === 0 ? 'Blue' : gi === 1 ? 'Warm' : 'Green';
              return (
                <button key={gi} className="palette-swatch" aria-label={name} onClick={() => setPalette(group)} style={{ border: palette === group ? '2px solid rgba(2,6,23,0.12)' : '2px solid transparent' }}>
                  <span className="swatch-dot" style={{ background: mid }} />
                </button>
              );
            })}
          </div>
          <div style={{ marginLeft: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
            <ButtonCSV onUpload={handleCsvUpload} />
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm" onClick={() => downloadPng('map-card.png')}>Download PNG</button>
          </div>
        </div>

        <div id="app-card" className="app-card">
          <div style={{ marginTop: 8 }}>
            <WorldMap title="Example map" data={mapData} colors={palette} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{ width: '60%' }}>
              <ValueBar max={max} colors={palette} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}