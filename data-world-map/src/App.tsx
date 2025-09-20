import MapPage from "./pages/MapPage";
import { Analytics } from '@vercel/analytics/react';


function App() {
  return (
    <>
      <MapPage />
      <Analytics />
    </>
  );
}

export default App;
