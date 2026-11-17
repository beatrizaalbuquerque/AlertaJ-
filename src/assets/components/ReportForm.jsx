import { useState } from 'react'

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
      className="bg-[#1b1b22] rounded-2xl p-5 space-y-4"
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
          className="w-full mt-2 p-3 rounded-lg bg-[#101014] border border-white/10 outline-none focus:border-pink-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-sm text-gray-300">
          Latitude
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            value={latitude}
            onChange={event => setLatitude(event.target.value)}
            placeholder="-23.5505"
            className="w-full mt-2 p-3 rounded-lg bg-[#101014] border border-white/10 outline-none focus:border-pink-500"
            required
          />
        </label>
        <label className="text-sm text-gray-300">
          Longitude
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            value={longitude}
            onChange={event => setLongitude(event.target.value)}
            placeholder="-46.6333"
            className="w-full mt-2 p-3 rounded-lg bg-[#101014] border border-white/10 outline-none focus:border-pink-500"
            required
          />
        </label>
      </div>

      <div>
        <label htmlFor="report-water-level" className="text-sm text-gray-300">
          Nível da água
        </label>

        <select
          id="report-water-level"
          value={waterLevel}
          onChange={e => setWaterLevel(e.target.value)}
          className="w-full mt-2 p-3 rounded-lg bg-[#101014] border border-white/10"
          required
        >
          <option value="">Selecione</option>
          <option value="baixo">Baixo</option>
          <option value="medio">Médio</option>
          <option value="alto">Alto</option>
        </select>
      </div>

      {formError && <p role="alert" className="text-sm text-red-400">{formError}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 rounded-lg p-3 font-semibold"
      >
        {saving ? 'Salvando...' : initialReport ? 'Salvar alterações' : 'Enviar relato'}
      </button>
      {initialReport && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="w-full rounded-lg border border-white/10 p-3 text-gray-300 hover:bg-white/5"
        >
          Cancelar edição
        </button>
      )}
    </form>
  )
}