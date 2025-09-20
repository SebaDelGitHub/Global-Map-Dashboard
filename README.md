# Data-World-Map
Interactive world map builder, upload numeric data and visualize it on a world map.

This app is a React + TypeScript web application that lets users download a CSV template, fill the numeric `value` column, re-upload the file, and export a rendered map as a PNG image. It is currently a beta/demo release.

**Link:** https://global-map-dashboard.vercel.app/

## Technology used
- Map rendering: [`react-simple-maps`](https://github.com/zcreativelabs/react-simple-maps) + [`topojson-client`](https://github.com/topojson/topojson-client)
- Country metadata: [`world-countries` on npm](https://www.npmjs.com/package/world-countries)

## Quick usage
1. Click **Download CSV Template** to get a template with all countries (columns: `isoCode,name,value`).
2. Open the CSV file and fill the `value` column with numeric values for the countries you want to map.
3. Back in the app, click **Upload CSV** and choose your file.
4. You can edit the map title directly by clicking it, typing a new title and pressing Enter (or clicking outside).
5. Click **Download PNG** to export the current map view as an image.

## CSV format
- Header: `isoCode,name,value`
- `isoCode`: ISO3 country code (e.g. `ESP`, `USA`)
- `name`: country name (quoted if it contains commas)
- `value`: numeric value (used for colorization). Leave empty for countries without data.
