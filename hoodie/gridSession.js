'use strict'

module.exports = init

const uuid = require('uuid').v4

function init (server) {
  server.method([
    {
      name: 'generateSession',
      method: generate,
      options: {}
    },
    {
      name: 'checkSession',
      method: check,
      options: {}
    },
    {
      name: 'changeSessionState',
      method: change,
      options: {}
    }
  ])
}

/**
 * Stores the active session ids and their state.
 * The state can be:
 * - {number} Date.now() of when the last activity.
 * - 'active' when there is an open WebSocket connection.
 *
 * When the user logs in the session will be generated and the date will be stored.
 * If the user then connects, before the timeout, then the state will be switched to 'active'.
 * When a WebSocket disconnects, then the time of disconnect will be stored.
 * And after a timeout the session will be deleted.
 */
const sessions = new Map()

/**
 * Generates a new session UUID.
 * @param {function} next callback
 */
function generate (next) {
  const id = uuid()
  sessions.set(id, Date.now())
  return next(null, id)
}

/**
 * Check if the session is active.
 * @param {string}   id   UUID of the session
 * @param {function} next callback
 */
function check (id, next) {
  if (sessions.has(id)) {
    return next(null, sessions.get(id))
  } else {
    return next(new Error('not found'))
  }
}

/**
 * Change the session state
 * @param {string}                id     UUID of the session
 * @param {'active'|'end'|number} state  Session is active (has a connection) or time of inactive
 * @param {function}              next   callback
 */
function change (id, state, next) {}
