import Cookies from 'js-cookie'
export const localSave = (key, value) => {
  localStorage.setItem(`${key}`, value)
}

export const localRead = (key) => {
  return localStorage.getItem(`${key}`) || ''
}

export const localClose = (key) => {
  return localStorage.removeItem(`${key}`)
}

export const cookieRead = (key) => {
  return Cookies.get(`${key}`)
}

export const cookieSave = (key, value) => {
  return Cookies.set(`${key}`, value)
}
export const sessionRead = (key) => {
  sessionStorage.getItem(`${key}`) || ''
}
export const sessionSave = (key, value) => {
  sessionStorage.setItem(`${key}`, value)
}