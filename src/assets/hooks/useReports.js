import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'

export function useReports(status = '') {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadReports = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const query = status ? `?status=${encodeURIComponent(status)}` : ''
      const data = await api.get(`/reports${query}`)
      setReports(data.reports)
    } catch (err) {
      setError(err.message || 'Não foi possível carregar os relatos.')
    } finally {
      setLoading(false)
    }
  }, [status])

  async function createReport(report) {
    return performMutation(async () => {
      const { report: created } = await api.post('/reports', report)
      await loadReports()
      return created
    }, false)
  }

  async function updateReport(id, changes) {
    return performMutation(async () => {
      const { report: updated } = await api.put(`/reports/${id}`, changes)
      await loadReports()
      return updated
    }, false)
  }

  async function deleteReport(id) {
    return performMutation(async () => {
      await api.delete(`/reports/${id}`)
      setReports(current => current.filter(item => item.id !== id))
    })
  }

  async function voteReport(id, type) {
    return performMutation(async () => {
      const { report: updated } = await api.post(`/reports/${id}/votes`, { type })
      setReports(current => current.map(item => item.id === id ? updated : item))
      return updated
    })
  }

  async function performMutation(action, showError = true) {
    try {
      setSaving(true)
      setError('')
      return await action()
    } catch (err) {
      if (showError) {
        setError(err.message || 'Não foi possível concluir a operação.')
      }
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
    saving,
    loadReports,
    createReport,
    updateReport,
    deleteReport,
    voteReport
  }
}