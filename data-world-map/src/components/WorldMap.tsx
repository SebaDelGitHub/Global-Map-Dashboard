import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useState, useRef, useEffect } from 'react';
import { feature } from "topojson-client";
import type { FeatureCollection } from "geojson";
import './worldMap.css';
import worldData from "world-atlas/countries-110m.json";
import type { CountryData, } from "../types/CountryData";
import { blueScale } from "../types/Colors";
import "./worldMap.css";

interface WorldMapProps {
  title: string;
  data: CountryData[];
  colors?: string[];
}

export default function WorldMap({ title, data, colors }: WorldMapProps) {
  const [tooltipText, setTooltipText] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Ensure tooltip is hidden initially
    if (tooltipRef.current) tooltipRef.current.style.display = 'none';
  }, []);
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

              // Gather possible ISO and name candidates from topojson properties
              const isoCandidates = [
                props.ISO_A3,
                props.iso_a3,
                props.ADM0_A3,
                props.adm0_a3,
                props.ISO_A2,
                props.iso_a2,
                props.id,
                props.iso,
              ]
                .filter(Boolean)
                .map((s: any) => String(s).toUpperCase());

              const geoNameCandidates = [props.name, props.NAME, props.ADMIN, props.formal_en]
                .filter(Boolean)
                .map((s: any) => String(s).toLowerCase());

              const displayName = props.name || props.NAME || props.ADMIN || props.formal_en || props.id;

              const country = data.find((c) => {
                const isoCode = c.isoCode ? String(c.isoCode).toUpperCase() : undefined;
                const countryName = c.name ? String(c.name).toLowerCase() : undefined;

                // Match by ISO codes (exact)
                if (isoCode && isoCandidates.includes(isoCode)) return true;

                // Match by name (case-insensitive, allow contains)
                if (countryName && geoNameCandidates.some((g: string) => g === countryName || g.includes(countryName) || countryName.includes(g))) return true;

                return false;
              });

              let fillColor = '#CCCCCC'; // gris por defecto (no data)
              let value = 0;
              if (country) {
                value = country.value ?? 0;
                fillColor = getColorByValue(value, maxValue, colors);
              }

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  className="country-shape"
                  onMouseEnter={(ev: any) => {
                    const text = `${displayName ?? 'Unknown'}: ${value}`;
                    setTooltipText(text);
                    if (tooltipRef.current) {
                      tooltipRef.current.style.left = `${ev.clientX + 12}px`;
                      tooltipRef.current.style.top = `${ev.clientY + 12}px`;
                      tooltipRef.current.style.display = 'block';
                    }
                  }}
                  onMouseMove={(ev: any) => {
                    // Update position directly on the DOM to avoid re-renders
                    if (tooltipRef.current) {
                      tooltipRef.current.style.left = `${ev.clientX + 12}px`;
                      tooltipRef.current.style.top = `${ev.clientY + 12}px`;
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipText(null);
                    if (tooltipRef.current) tooltipRef.current.style.display = 'none';
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div ref={tooltipRef} className="map-tooltip" aria-hidden style={{ position: 'fixed' }}>
        {tooltipText}
      </div>
    </div>
  );
}

// Función para obtener el color según el valor
function getColorByValue(value: number, max: number, palette?: string[]): string {
  if (value === 0) return '#CCCCCC'; // gris = No data
  const colors = palette && palette.length === 5 ? palette : blueScale;
  if (max === 0) return colors[0];
  const step = max / 5;
  if (value <= step) return colors[0];
  if (value <= step * 2) return colors[1];
  if (value <= step * 3) return colors[2];
  if (value <= step * 4) return colors[3];
  return colors[4];
}