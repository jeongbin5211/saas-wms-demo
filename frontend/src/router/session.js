export const authTokenKey = 'wmsAuthToken'
export const authUserKey = 'wmsAuthUser'
export const savedEmailKey = 'savedEmail'

export function saveAuthSession(auth) {
  const user = {
    userId: auth.userId,
    accountId: auth.accountId,
    topAccountId: auth.topAccountId,
    name: auth.name,
    email: auth.email,
    roleSubCode: auth.roleSubCode,
  }

  window.localStorage.setItem(authTokenKey, auth.token)
  window.localStorage.setItem(authUserKey, JSON.stringify(user))

  return user
}

export function loadAuthUser() {
  const rawUser = window.localStorage.getItem(authUserKey)

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser)
  } catch {
    window.localStorage.removeItem(authUserKey)
    return null
  }
}

export function clearAuthSession() {
  window.localStorage.removeItem(authTokenKey)
  window.localStorage.removeItem(authUserKey)
}

export function fetchWithAuth(input, options = {}) {
  const token = window.localStorage.getItem(authTokenKey)
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return fetch(input, {
    ...options,
    headers,
  })
}
