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
          <h1>Global Map Dashboard</h1>
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
        <div className="github-banner">
          <a href="https://github.com/SebaDelGitHub" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" style={{ verticalAlign: 'middle', marginRight: 8 }}>
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            <span>Created by SebaDelGitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}