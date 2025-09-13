import WorldMap from "../components/WorldMap";
import { mockData } from "../data/mockData";

export default function Home() {
  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Interactive data world map</h1>
      <WorldMap title="Titulo de Prueba" data={mockData} />
    </div>
  );
}