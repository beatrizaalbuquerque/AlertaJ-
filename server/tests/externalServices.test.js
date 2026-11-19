import { test } from 'node:test'
import assert from 'node:assert/strict'
import { withTimeout } from '../../src/assets/services/fetchWithTimeout.js'
import { fetchCurrentWeather } from '../../src/assets/services/weatherService.js'
import { fetchAlternativeRoutes } from '../../src/assets/services/routeService.js'

test('external integrations validate responses and fail explicitly on timeouts', async () => {
  const originalFetch = globalThis.fetch

  try {
    let weatherUrl
    globalThis.fetch = async url => {
      weatherUrl = String(url)
      return new Response(JSON.stringify({
        current: {
          temperature_2m: 21,
          precipitation: 0,
          rain: 0,
          time: '2026-11-19T12:00'
        },
        current_units: {
          temperature_2m: '°C',
          precipitation: 'mm',
          rain: 'mm'
        },
        timezone: 'America/Sao_Paulo'
      }), { status: 200 })
    }

    const weather = await fetchCurrentWeather(-23.46, -46.33)
    assert.equal(weather.current.temperature_2m, 21)
    assert.match(weatherUrl, /latitude=-23\.46/)
    assert.match(weatherUrl, /longitude=-46\.33/)

    globalThis.fetch = async () => new Response('unavailable', { status: 503 })
    await assert.rejects(
      fetchCurrentWeather(-23.46, -46.33),
      /Open-Meteo respondeu com erro \(503\)/
    )

    globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener(
        'abort',
        () => reject(new DOMException('Aborted', 'AbortError')),
        { once: true }
      )
    })
    await assert.rejects(
      withTimeout(
        signal => new Promise((_resolve, reject) => {
          signal.addEventListener(
            'abort',
            () => reject(new DOMException('Aborted', 'AbortError')),
            { once: true }
          )
        }),
        undefined,
        'Consulta expirada.',
        5
      ),
      { message: 'Consulta expirada.' }
    )

    globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener(
        'abort',
        () => reject(new DOMException('Aborted', 'AbortError')),
        { once: true }
      )
    })
    await assert.rejects(
      fetchCurrentWeather(-23.46, -46.33),
      /consulta à Open-Meteo excedeu o tempo limite/
    )

    let routeUrl
    globalThis.fetch = async url => {
      routeUrl = String(url)
      return new Response(JSON.stringify({
        code: 'Ok',
        routes: [{
          distance: 1250,
          duration: 300,
          geometry: { coordinates: [[-46.33, -23.46], [-46.32, -23.45]] }
        }]
      }), { status: 200 })
    }

    const routes = await fetchAlternativeRoutes([-23.46, -46.33], [-23.45, -46.32])
    assert.match(routeUrl, /-46\.33,-23\.46/)
    assert.deepEqual(routes[0].coordinates, [[-23.46, -46.33], [-23.45, -46.32]])
    assert.equal(routes[0].distance, 1250)

    globalThis.fetch = async () => new Response('unavailable', { status: 503 })
    await assert.rejects(
      fetchAlternativeRoutes([-23.46, -46.33], [-23.45, -46.32]),
      /serviço de rotas respondeu com erro \(503\)/
    )
  } finally {
    globalThis.fetch = originalFetch
  }
})
