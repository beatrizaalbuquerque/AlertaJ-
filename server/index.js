import 'dotenv/config'
import process from 'node:process'
import { loadConfig } from './config.js'
import { createDatabase } from './db/database.js'
import { createApp } from './app.js'

const config = loadConfig()
const db = createDatabase(config.databasePath)
const app = createApp({
  db,
  sessionSecret: config.sessionSecret,
  frontendUrl: config.frontendUrl,
  pilotArea: config.pilotArea,
  production: process.env.NODE_ENV === 'production'
})

app.listen(config.port, () => {
  console.log(`AlertaJá API em http://localhost:${config.port}; região piloto Itaquaquecetuba (IBGE 3523107) configurada.`)
})
