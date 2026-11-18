import { useState } from 'react'
import FeedbackMessage from './FeedbackMessage'

export default function ReportForm({
  onSubmit,
  initialReport = null,
  onCancel,
  saving = false
}) {
  const [location, setLocation] = useState(initialReport?.location || '')
  const [latitude, setLatitude] = useState(
    initialReport?.latitude == null ? '' : String(initialReport.latitude)
  )
  const [longitude, setLongitude] = useState(
    initialReport?.longitude == null ? '' : String(initialReport.longitude)
  )
  const [waterLevel, setWaterLevel] = useState(initialReport?.waterLevel || '')
  const [formError, setFormError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    try {
      await onSubmit({
        location,
        latitude: Number(latitude),
        longitude: Number(longitude),
        waterLevel
      })
      if (!initialReport) {
        setLocation('')
        setLatitude('')
        setLongitude('')
        setWaterLevel('')
      }
    } catch (error) {
      setFormError(error.message)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-white/10 bg-[#1b1b22] p-4 sm:p-5"
    >
      <h2 className="text-lg font-semibold">
        {initialReport ? 'Editar relato' : 'Registrar alagamento'}
      </h2>

      <div>
        <label htmlFor="report-location" className="text-sm text-gray-300">
          Localização
        </label>

        <input
          id="report-location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Informe a localização"
          className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label htmlFor="report-latitude" className="text-sm text-gray-300">
          Latitude
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            value={latitude}
            onChange={event => setLatitude(event.target.value)}
            id="report-latitude"
            placeholder="Latitude decimal"
            className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
            required
            aria-describedby="report-coordinate-help"
          />
          </label>
          <label htmlFor="report-longitude" className="text-sm text-gray-300">
            Longitude
            <input
              id="report-longitude"
              type="number"
            step="any"
            min="-180"
            max="180"
            value={longitude}
            onChange={event => setLongitude(event.target.value)}
            placeholder="Longitude decimal"
            className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 outline-none focus:border-pink-500 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-400"
            required
            aria-describedby="report-coordinate-help"
          />
        </label>
      </div>
      <p id="report-coordinate-help" className="text-xs leading-5 text-gray-400">
        Informe as coordenadas do local dentro dos limites de Itaquaquecetuba.
      </p>

      <div>
        <label htmlFor="report-water-level" className="text-sm text-gray-300">
          Nível da água
        </label>

        <select
          id="report-water-level"
          value={waterLevel}
          onChange={e => setWaterLevel(e.target.value)}
          className="mt-2 min-h-11 w-full rounded-lg border border-white/10 bg-[#101014] p-3 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-pink-400"
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
        disabled={saving}
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