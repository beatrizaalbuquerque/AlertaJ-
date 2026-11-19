import { useState } from 'react'
import { LocateFixed, MapPinned } from 'lucide-react'
import { useRegion } from '../hooks/useRegion'
import { isPointInsideBoundary } from '../utils/geo'
import FeedbackMessage from './FeedbackMessage'
import ReportLocationPicker from './ReportLocationPicker'

export default function ReportForm({
  onSubmit,
  initialReport = null,
  onCancel,
  saving = false
}) {
  const { region, error: regionError } = useRegion()
  const [location, setLocation] = useState(initialReport?.location || '')
  const [position, setPosition] = useState(
    initialReport?.latitude == null || initialReport?.longitude == null
      ? null
      : [initialReport.latitude, initialReport.longitude]
  )
  const [waterLevel, setWaterLevel] = useState(initialReport?.waterLevel || '')
  const [formError, setFormError] = useState('')
  const [locationError, setLocationError] = useState('')
  const [locationNotice, setLocationNotice] = useState('')
  const [locating, setLocating] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)

  function choosePosition(latitudeValue, longitudeValue, source) {
    if (region?.boundary && !isPointInsideBoundary(
      latitudeValue,
      longitudeValue,
      region.boundary
    )) {
      setLocationError('Esse ponto fica fora de Itaquaquecetuba. Escolha um local dentro do limite destacado no mapa.')
      setLocationNotice('')
      return
    }

    setPosition([latitudeValue, longitudeValue])
    setLocationError('')
    setLocationNotice(source === 'map'
      ? 'Ponto selecionado no mapa.'
      : 'Localização do dispositivo definida.')
  }

  function locateDevice() {
    setLocationError('')
    setLocationNotice('')
    if (!navigator.geolocation) {
      setLocationError('Este navegador não oferece geolocalização. Informe o endereço ou bairro e escolha o ponto no mapa.')
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        choosePosition(coords.latitude, coords.longitude, 'device')
        setLocating(false)
      },
      error => {
        const messages = {
          1: 'A permissão de localização foi recusada. Você ainda pode informar o endereço ou bairro e escolher o ponto no mapa.',
          2: 'Não foi possível determinar sua localização. Tente novamente ou escolha o ponto no mapa.',
          3: 'A localização demorou demais para responder. Tente novamente ou escolha o ponto no mapa.'
        }
        setLocationError(messages[error.code] || 'Não foi possível acessar a localização. Escolha o ponto no mapa.')
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    if (!position) {
      setFormError('Defina o ponto do alagamento usando sua localização ou o mapa.')
      return
    }
    if (region?.boundary && !isPointInsideBoundary(position[0], position[1], region.boundary)) {
      setFormError('O ponto informado fica fora da região piloto de Itaquaquecetuba.')
      return
    }

    try {
      await onSubmit({
        location,
        latitude: position[0],
        longitude: position[1],
        waterLevel
      })
      if (!initialReport) {
        setLocation('')
        setPosition(null)
        setWaterLevel('')
        setLocationNotice('')
      }
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-white/10 bg-[#1b1b22] p-5 sm:p-6"
    >
      <h2 className="border-b border-white/10 pb-3 text-lg font-semibold">
        {initialReport ? 'Editar relato' : 'Registrar alagamento'}
      </h2>

      <div>
        <label htmlFor="report-location" className="text-sm font-medium text-gray-200">
          Endereço ou bairro
        </label>

        <input
          id="report-location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Ex.: rua, avenida ou bairro"
          className="mt-3 min-h-12 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          required
        />
        <p className="mt-2 text-xs leading-5 text-gray-400">
          Descreva o local. Depois, marque o ponto no mapa ou use sua localização.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={locateDevice}
            disabled={locating || saving}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-3 font-semibold transition hover:bg-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 disabled:cursor-wait disabled:opacity-60"
          >
            <LocateFixed size={18} aria-hidden="true" />
            {locating ? 'Localizando...' : 'Usar minha localização'}
          </button>
          <button
            type="button"
            onClick={() => setMapOpen(open => !open)}
            aria-expanded={mapOpen}
            aria-controls="report-location-map"
            disabled={saving}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-gray-200 transition hover:bg-white/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 disabled:opacity-60"
          >
            <MapPinned size={18} aria-hidden="true" />
            {mapOpen ? 'Fechar mapa' : 'Escolher no mapa'}
          </button>
        </div>

        {position ? (
          <p className="rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2 text-sm text-green-200" role="status">
            Ponto definido: {position[0].toFixed(5)}, {position[1].toFixed(5)}
          </p>
        ) : (
          <p className="text-sm text-amber-200/90" role="status">
            Selecione um ponto para habilitar o envio do relato.
          </p>
        )}

        {locationError && <FeedbackMessage variant="error">{locationError}</FeedbackMessage>}
        {locationNotice && <FeedbackMessage variant="success">{locationNotice}</FeedbackMessage>}
        {regionError && (
          <FeedbackMessage variant="info">
            Não foi possível carregar o limite para validar o ponto neste momento. A API continuará fazendo a validação antes de aceitar o relato.
          </FeedbackMessage>
        )}

        {mapOpen && (
          <div id="report-location-map">
            <ReportLocationPicker
              center={region?.center}
              boundary={region?.boundary}
              position={position}
              onPick={(latitudeValue, longitudeValue) => choosePosition(latitudeValue, longitudeValue, 'map')}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="report-water-level" className="text-sm text-gray-300">
          Nível da água
        </label>

        <select
          id="report-water-level"
          value={waterLevel}
          onChange={e => setWaterLevel(e.target.value)}
          className="mt-3 min-h-12 w-full rounded-lg border border-white/10 bg-[#101014] p-3 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
          required
        >
          <option value="">Selecione</option>
          <option value="baixo">Baixo</option>
          <option value="medio">Médio</option>
          <option value="alto">Alto</option>
        </select>
      </div>

      {formError && <FeedbackMessage variant="error">{formError}</FeedbackMessage>}

      <button
        type="submit"
        disabled={saving || !position}
        className="min-h-11 w-full rounded-lg bg-pink-600 p-3 font-semibold transition hover:bg-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? 'Salvando...' : initialReport ? 'Salvar alterações' : 'Enviar relato'}
      </button>
      {initialReport && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="min-h-11 w-full rounded-lg border border-white/10 p-3 text-gray-300 transition hover:bg-white/5 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar edição
        </button>
      )}
    </form>
  )
}