'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('./map-component'), { ssr: false })

export default function MapWrapper() {
  return <MapComponent />
}

