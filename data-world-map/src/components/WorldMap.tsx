import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { feature } from "topojson-client";
import type { FeatureCollection } from "geojson";
import worldData from "world-atlas/countries-110m.json";
import type { CountryData, } from "../types/CountryData";
import { blueScale } from "../types/Colors";
import "./worldMap.css";

interface WorldMapProps {
  title: string;
  data: CountryData[];
}

export default function WorldMap({ title, data }: WorldMapProps) {
  // TopoJSON -> GeoJSON (forzar tipo)
  const geoFeatures = feature(
    worldData as any,
    (worldData as any).objects.countries
  ) as unknown as FeatureCollection;

  const maxValue = data.reduce((max, c) => c.value && c.value > max ? c.value : max, 0);

  return (
    <div className="world-map-container">
  <h2 className="world-map-title">{title}</h2>
      <ComposableMap
        projectionConfig={{ scale: 225, center: [0, 0] }}
        width={1200}
        height={600}
      >
        <Geographies geography={geoFeatures}>
          {({ geographies }) =>
            geographies.map((geo: any) => {
              const props: any = geo.properties || {};
              const iso = (props.ISO_A3 || props.iso_a3 || props.id || props.iso) as string | undefined;
              const geoName = (props.name || props.NAME || props.ADMIN) as string | undefined;

              const country = data.find(
                (c) =>
                  (iso && c.isoCode && c.isoCode.toUpperCase() === String(iso).toUpperCase()) ||
                  (geoName && c.name === geoName)
              );

              let fillColor = '#CCCCCC'; // gris por defecto (no data)
              let value = 0;
              if (country) {
                value = country.value ?? 0;
                fillColor = getColorByValue(value, maxValue);
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  onClick={() => alert(`${geoName ?? props.name ?? "Unknown"}: ${value}`)}
                  className="country-shape"
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#999", outline: "none" },
                    pressed: { fill: "#222", outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}

// Función para obtener el color según el valor
function getColorByValue(value: number, max: number): string {
  if (value === 0) return '#CCCCCC'; // gris = No data
  if (max === 0) return blueScale[0];
  const step = max / 5;
  if (value <= step) return blueScale[0];
  if (value <= step * 2) return blueScale[1];
  if (value <= step * 3) return blueScale[2];
  if (value <= step * 4) return blueScale[3];
  return blueScale[4];
}