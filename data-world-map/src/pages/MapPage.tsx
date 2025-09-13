import { useState } from "react";
import WorldMap from "../components/WorldMap";
import { mockData } from "../data/mockData";
import { ValueBar } from "../components/ValueBar";
import { blueScale, warmScale, greenScale } from "../types/Colors";

export default function Home() {
  const max = Math.max(0, ...(mockData.map((d) => d.value ?? 0)));
  const [palette, setPalette] = useState<string[]>(blueScale);

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
        </div>

        <div className="app-card">
          <div style={{ marginTop: 8 }}>
            <WorldMap title="Example map" data={mockData} colors={palette} />
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