import { uInstance as uRequest } from '../utils/_request.js'

export function login_cellphone (data) {
  return uRequest.post('/login/cellphone', data)
}
export function login_email (data) {
  return uRequest.post('/login/email', data)
}
export function login_refresh () {
  return uRequest.get('/login/refresh')
}
export function login_status () {
  return uRequest.get('/login/status')
}
export function logout () {
  return uRequest.get('/logout')
}
