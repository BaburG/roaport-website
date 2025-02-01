import MapWrapper from './map-wrapper'

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Hazard Map',
  description: 'Interactive map of reported hazards',
}

export default function MapPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Hazard Map</h1>
      <div className="h-[600px] w-full">
        <MapWrapper />
      </div>
    </div>
  )
}
