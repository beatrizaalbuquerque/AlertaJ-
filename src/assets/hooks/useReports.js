import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from '../services/api'

export function useReports(status = '') {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const requestId = useRef(0)

  const loadReports = useCallback(async () => {
    const currentRequestId = ++requestId.current
    try {
      setLoading(true)
      setError('')
      const query = status ? `?status=${encodeURIComponent(status)}` : ''
      const data = await api.get(`/reports${query}`)
      if (currentRequestId === requestId.current) {
        setReports(data.reports)
      }
    } catch (err) {
      if (currentRequestId === requestId.current) {
        setError(err.message || 'Não foi possível carregar os relatos.')
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setLoading(false)
      }
    }
  }, [status])

  async function createReport(report) {
    return performMutation(async () => {
      const { report: created } = await api.post('/reports', report)
      await loadReports()
      return created
    }, 'Relato registrado com sucesso.')
  }

  async function updateReport(id, changes) {
    return performMutation(async () => {
      const { report: updated } = await api.put(`/reports/${id}`, changes)
      await loadReports()
      return updated
    }, 'Relato atualizado com sucesso.')
  }

  async function deleteReport(id) {
    return performMutation(async () => {
      await api.delete(`/reports/${id}`)
      setReports(current => current.filter(item => item.id !== id))
    }, 'Relato excluído com sucesso.')
  }

  async function voteReport(id, type) {
    return performMutation(async () => {
      const { report: updated } = await api.post(`/reports/${id}/votes`, { type })
      setReports(current => current.map(item => item.id === id ? updated : item))
      return updated
    }, type === 'confirm' ? 'Confirmação registrada.' : 'Contestação registrada.')
  }

  async function performMutation(action, successMessage) {
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      const result = await action()
      setSuccess(successMessage)
      return result
    } catch (err) {
      setError(err.message || 'Não foi possível concluir a operação.')
      throw err
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    Promise.resolve().then(loadReports)
  }, [loadReports])

  return {
    reports,
    loading,
    error,
    success,
    saving,
    loadReports,
    createReport,
    updateReport,
    deleteReport,
    voteReport
  }
}