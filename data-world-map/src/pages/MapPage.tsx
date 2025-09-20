import { useState } from "react";
import WorldMap from "../components/WorldMap";
import { mockData } from "../data/mockData";
import { ValueBar } from "../components/ValueBar";
import { blueScale, warmScale, greenScale } from "../types/Colors";
import ButtonCSV from '../components/ButtonCSV';
import { mergeCsvRowsIntoMapData } from '../utils/mapMerge';
import exportCardAsPng from '../utils/exportImage';
import downloadEmptyCountriesCsv from '../utils/csvExport';
import HelpModal from '../components/HelpModal';

export default function Home() {
  const [palette, setPalette] = useState<string[]>(blueScale);
  const [mapData, setMapData] = useState(mockData);
  const [title, setTitle] = useState('Example map');
  const max = Math.max(0, ...(mapData.map((d) => d.value ?? 0)));

  const handleCsvUpload = (rows: any[]) => {
    setMapData(prev => mergeCsvRowsIntoMapData(prev, rows));
  };

  const downloadPng = async (fileName = 'map-card.png') => {
    const node = document.getElementById('app-card');
    if (!node) return;
    await exportCardAsPng(node, fileName, 3);
  };

  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <header className="clean-header">
          <h1>Interactive world map data</h1>
        </header>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
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
          <div style={{ marginLeft: 12, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <ButtonCSV onUpload={handleCsvUpload} />
            <button className="btn btn-primary" onClick={() => downloadEmptyCountriesCsv('countries-template.csv')}>Download CSV Template</button>
            <button className="btn btn-primary" onClick={() => downloadPng('map-card.png')}>Download PNG</button>
            <button className="btn btn-primary" onClick={() => setShowHelp(true)}>How to use?</button>
          </div>
        </div>

        <div id="app-card" className="app-card">
            <div style={{ marginTop: 8 }}>
            <WorldMap title={title} data={mapData} colors={palette} onTitleChange={setTitle} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{ width: '70%' }}>
              <ValueBar max={max} colors={palette} />
            </div>
          </div>
        </div>
        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          onDownloadCsv={() => downloadEmptyCountriesCsv('countries-template.csv')}
        />
      </div>
    </div>
  );
}