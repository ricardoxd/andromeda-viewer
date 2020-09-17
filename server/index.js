'use strict'

const path = require('path')
const express = require('express')
const webSocketBridge = require('./bridge')
const gridSession = require('./gridSession')

const app = express()

module.exports = app

const port = process.env.PORT || 3001
const publicDir = process.env.NODE_ENV === 'production' ? 'build' : 'public'
app.set('host', process.env.HOST || `http://localhost:${port}`)

gridSession(app)

app.use(express.static(publicDir))

app.use('/api/session', require('./account'))
app.use('/api/login', require('./login'))
app.use('/api/proxy', require('./httpProxy'))
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    next()
  } else {
    res.sendFile(path.join(process.cwd(), publicDir, 'index.html'))
  }
})

if (!module.parent) {
  const server = app.listen(port, () => console.log(`listening at http://localhost:${port}`))

  webSocketBridge.createWebSocketServer(app, server, '/api/bridge')
}
