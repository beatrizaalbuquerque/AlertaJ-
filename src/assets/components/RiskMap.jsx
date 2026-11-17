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
      <div className="bg-[#1b1b22] rounded-2xl p-6">
        Não foi possível carregar o centro da região piloto.
      </div>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '420px', width: '100%' }}
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
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </section>
  )
}