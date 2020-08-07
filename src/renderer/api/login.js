import { uInstance as uRequest } from '../utils/_request.js'

export function login_cellphone (data) {
  return uRequest.get('/login/cellphone', {
    params: data
  })
}
export function login_email (data) {
  return uRequest.get('/login/email', {
    params: data
  })
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
