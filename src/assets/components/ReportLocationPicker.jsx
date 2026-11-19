import { useEffect } from 'react'
import {
  GeoJSON,
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet'

function MapInteraction({ position, onPick }) {
  const map = useMap()

  useEffect(() => {
    if (position) map.setView(position, Math.max(map.getZoom(), 15))
  }, [map, position])

  useMapEvents({
    click(event) {
      onPick(event.latlng.lat, event.latlng.lng)
    }
  })

  return position ? <Marker position={position} /> : null
}

export default function ReportLocationPicker({
  center,
  boundary,
  position,
  onPick
}) {
  if (!center) {
    return (
      <p className="rounded-lg border border-white/10 bg-[#101014] p-4 text-sm leading-6 text-gray-400">
        O mapa não está disponível agora. Tente usar a localização do dispositivo ou tente novamente mais tarde.
      </p>
    )
  }

  return (
    <div>
      <p id="report-map-help" className="mb-3 text-sm leading-6 text-gray-300">
        Toque ou clique no ponto do endereço ou bairro informado. O limite municipal está destacado no mapa.
      </p>
      <div className="h-64 overflow-hidden rounded-xl border border-white/10 sm:h-80">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
          aria-label="Selecione o ponto do alagamento no mapa"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {boundary && (
            <GeoJSON
              data={boundary}
              style={{
                color: '#ec4899',
                weight: 2,
                fillColor: '#ec4899',
                fillOpacity: 0.06
              }}
            />
          )}
          <MapInteraction position={position} onPick={onPick} />
        </MapContainer>
      </div>
    </div>
  )
}
