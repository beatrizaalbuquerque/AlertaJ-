import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON
} from 'react-leaflet'

export default function RiskMap({
  center,
  boundary,
  reports = []
}) {
  if (!center) {
    return (
      <div className="rounded-2xl bg-[#1b1b22] p-5 text-sm leading-6 text-gray-300 sm:p-6">
        Não foi possível carregar o centro da região piloto.
      </div>
    )
  }

  return (
    <section className="h-72 overflow-hidden border-y border-white/10 sm:h-96 lg:h-[440px]" aria-label="Mapa de riscos e ocorrências">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
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

        {reports.map(report => {
          if (
            typeof report.latitude !== 'number' ||
            typeof report.longitude !== 'number'
          ) return null

          return (
            <Marker
              key={report.id}
              position={[
                report.latitude,
                report.longitude
              ]}
            >
              <Popup>
                <strong>{report.location}</strong>
                <br />
                Status: {report.status}
                <br />
                Nível da água: {report.waterLevel}
                <br />
                Registrado em: {new Date(report.createdAt).toLocaleString('pt-BR')}
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </section>
  )
}