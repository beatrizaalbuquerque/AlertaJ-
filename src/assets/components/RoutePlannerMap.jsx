import { useEffect } from 'react'
import {
  GeoJSON,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  useMapEvents
} from 'react-leaflet'

const routeColors = ['#38bdf8', '#fbbf24', '#a78bfa']

function MapClickSelector({ activePoint, onSelect }) {
  const map = useMap()

  useMapEvents({
    click(event) {
      if (activePoint) {
        onSelect([event.latlng.lat, event.latlng.lng])
      }
    }
  })

  useEffect(() => {
    const container = map.getContainer()
    function selectMapCenter(event) {
      if (event.key === 'Enter' && activePoint) {
        event.preventDefault()
        const center = map.getCenter()
        onSelect([center.lat, center.lng])
      }
    }

    container.addEventListener('keydown', selectMapCenter)
    return () => container.removeEventListener('keydown', selectMapCenter)
  }, [activePoint, map, onSelect])

  return null
}

export default function RoutePlannerMap({
  center,
  boundary,
  origin,
  destination,
  confirmedReports = [],
  activePoint,
  onSelect,
  routes,
  selectedRoute,
  onSelectRoute
}) {
  return (
    <section
      aria-label="Mapa para selecionar origem e destino e consultar relatos confirmados"
      className="relative h-80 overflow-hidden border-y border-white/10 sm:h-[420px]"
    >
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom
        className={`h-full w-full focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-sky-300 ${activePoint ? 'cursor-crosshair' : ''}`}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {boundary && (
          <GeoJSON
            data={boundary}
            style={{
              color: '#38bdf8',
              weight: 2,
              fillColor: '#38bdf8',
              fillOpacity: 0.035
            }}
          />
        )}
        <MapClickSelector activePoint={activePoint} onSelect={onSelect} />
        {routes.map((route, index) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            pathOptions={{
              color: routeColors[index % routeColors.length],
              weight: index === selectedRoute ? 6 : 4,
              opacity: index === selectedRoute ? 0.95 : 0.58
            }}
            eventHandlers={{
              click: () => onSelectRoute(index)
            }}
          />
        ))}
        {confirmedReports.map(report => {
          if (
            typeof report.latitude !== 'number' ||
            typeof report.longitude !== 'number'
          ) return null

          return (
            <Marker
              key={`confirmed-${report.id}`}
              position={[report.latitude, report.longitude]}
              alt={`Relato confirmado: ${report.location}`}
              title={`Relato confirmado: ${report.location}`}
            >
              <Popup>
                <strong>{report.location}</strong>
                <br />
                Relato confirmado — o serviço de rotas não consegue avaliar este ponto.
              </Popup>
            </Marker>
          )
        })}
        {origin && (
          <Marker position={origin} alt="Origem selecionada" title="Origem selecionada">
            <Popup>Origem selecionada</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination} alt="Destino selecionado" title="Destino selecionado">
            <Popup>Destino selecionado</Popup>
          </Marker>
        )}
      </MapContainer>
    </section>
  )
}
