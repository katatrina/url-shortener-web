import type { FieldErrorCode } from '@/api/types'

// Same regex as the backend; keep them in sync. ASCII-only, domain must contain a dot.
export const EMAIL_PATTERN =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/

export const EMAIL_MAX_LENGTH = 254

/** Pass the trimmed value. */
export function isValidEmail(email: string): boolean {
  return email.length <= EMAIL_MAX_LENGTH && EMAIL_PATTERN.test(email)
}

// Link rules, same as the backend's CreateLinkRequest. Lengths count characters (code points), like Go runes.
export const URL_MAX_LENGTH = 2048
export const TITLE_MAX_LENGTH = 255
export const SLUG_MIN_LENGTH = 3
export const SLUG_MAX_LENGTH = 30

const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/

const charCount = (s: string) => [...s].length

export function checkDestinationUrl(url: string): FieldErrorCode | null {
  if (!url) return 'REQUIRED'
  if (!isHttpUrl(url)) return 'INVALID_FORMAT'
  if (charCount(url) > URL_MAX_LENGTH) return 'TOO_LONG'
  return null
}

export function checkTitle(title: string): FieldErrorCode | null {
  return charCount(title) > TITLE_MAX_LENGTH ? 'TOO_LONG' : null
}

/** An empty slug is valid: the backend generates one. */
export function checkSlug(slug: string): FieldErrorCode | null {
  if (!slug) return null
  if (charCount(slug) < SLUG_MIN_LENGTH) return 'TOO_SHORT'
  if (charCount(slug) > SLUG_MAX_LENGTH) return 'TOO_LONG'
  if (!SLUG_PATTERN.test(slug)) return 'INVALID_FORMAT'
  return null
}

// isHttpUrl matches the backend's `http_url` exactly: Go 1.26's url.Parse succeeds on the
// lowercased URL, the scheme is http or https, and the host is not empty.

const HOST_CHAR = /^[!"$&'()*+,\-.0-9:;<=>A-Z[\]_a-z~]$/
const USERINFO = /^[A-Za-z0-9\-._:~!$&'()*+,;=%@]*$/
const HEX = /^[0-9a-fA-F]$/
const SCHEME = /^([a-z][a-z0-9+.-]*):/

type UnescapeMode = 'host' | 'zone' | 'other'

/** Go's unescape: returns the decoded string, or null where Go returns an error. */
function unescape(s: string, mode: UnescapeMode): string | null {
  let out = ''
  for (let i = 0; i < s.length; ) {
    const c = s[i]!
    if (c === '%') {
      if (i + 2 >= s.length || !HEX.test(s[i + 1]!) || !HEX.test(s[i + 2]!)) return null
      const v = parseInt(s.slice(i + 1, i + 3), 16)
      const isPercent = s.slice(i, i + 3) === '%25'
      if (mode === 'host' && v >> 4 < 8 && !isPercent) return null
      if (mode === 'zone' && !isPercent && v !== 0x20 && !(v < 0x80 && HOST_CHAR.test(String.fromCharCode(v)))) return null
      out += String.fromCharCode(v)
      i += 3
    } else {
      if (mode !== 'other' && c.charCodeAt(0) < 0x80 && !HOST_CHAR.test(c)) return null
      out += c
      i++
    }
  }
  return out
}

function validOptionalPort(port: string): boolean {
  return port === '' || /^:[0-9]*$/.test(port)
}

/** Go's netip.ParseAddr, for an address that must be IPv6 (IPv4 is rejected inside brackets). */
function isIPv6(addr: string): boolean {
  let s = addr
  const zoneAt = s.indexOf('%')
  if (zoneAt !== -1) {
    if (zoneAt === s.length - 1) return false
    s = s.slice(0, zoneAt)
  }
  if (!s.includes(':')) return false

  let groups = 0 // 16-bit groups read
  let ellipsis = -1
  if (s.startsWith('::')) {
    ellipsis = 0
    s = s.slice(2)
    if (s === '') return true
  }
  while (groups < 8) {
    const field = /^[0-9a-fA-F]*/.exec(s)![0]
    if (field.length === 0 || field.length > 4) return false
    if (s[field.length] === '.') {
      if ((ellipsis < 0 && groups !== 6) || groups + 2 > 8 || !isIPv4(s)) return false
      groups += 2
      s = ''
      break
    }
    groups++
    s = s.slice(field.length)
    if (s === '') break
    if (s[0] !== ':' || s.length === 1) return false
    s = s.slice(1)
    if (s[0] === ':') {
      if (ellipsis >= 0) return false
      ellipsis = groups
      s = s.slice(1)
      if (s === '') break
    }
  }
  if (s !== '') return false
  return groups < 8 ? ellipsis >= 0 : ellipsis < 0
}

function isIPv4(s: string): boolean {
  const parts = s.split('.')
  return parts.length === 4 && parts.every((p) => /^(0|[1-9][0-9]{0,2})$/.test(p) && Number(p) <= 255)
}

/** Go's parseHost for http/https (strict colons). Returns the decoded host, or null on error. */
function parseHost(host: string): string | null {
  const open = host.lastIndexOf('[')
  if (open > 0) return null
  if (open === 0) {
    const close = host.lastIndexOf(']')
    if (close < 0) return null
    const colonPort = host.slice(close + 1)
    if (!validOptionalPort(colonPort) || unescape(colonPort, 'host') === null) return null
    const hostname = host.slice(1, close)
    const zoneAt = hostname.indexOf('%25')
    const addr =
      zoneAt >= 0
        ? join(unescape(hostname.slice(0, zoneAt), 'host'), unescape(hostname.slice(zoneAt), 'zone'))
        : unescape(hostname, 'host')
    return addr !== null && isIPv6(addr) ? `[${addr}]` : null
  }
  const colon = host.indexOf(':')
  if (colon !== -1 && !validOptionalPort(host.slice(colon))) return null
  return unescape(host, 'host')
}

function join(a: string | null, b: string | null): string | null {
  return a === null || b === null ? null : a + b
}

export function isHttpUrl(raw: string): boolean {
  const lower = raw.toLowerCase()
  const hashAt = lower.indexOf('#')
  const beforeHash = hashAt === -1 ? lower : lower.slice(0, hashAt)
  // Go only rejects control characters before the fragment.
  if (/[\x00-\x1f\x7f]/.test(beforeHash)) return false
  if (hashAt !== -1 && unescape(lower.slice(hashAt + 1), 'other') === null) return false

  const scheme = SCHEME.exec(beforeHash)
  if (!scheme || (scheme[1] !== 'http' && scheme[1] !== 'https')) return false

  let rest = beforeHash.slice(scheme[0].length)
  const queryAt = rest.indexOf('?')
  if (queryAt !== -1) rest = rest.slice(0, queryAt)
  if (!rest.startsWith('//')) return false

  let authority = rest.slice(2)
  let path = ''
  const slashAt = authority.indexOf('/')
  if (slashAt !== -1) {
    path = authority.slice(slashAt)
    authority = authority.slice(0, slashAt)
  }

  const atAt = authority.lastIndexOf('@')
  const host = parseHost(atAt === -1 ? authority : authority.slice(atAt + 1))
  if (host === null) return false
  if (atAt !== -1) {
    const userinfo = authority.slice(0, atAt)
    if (!USERINFO.test(userinfo) || unescape(userinfo, 'other') === null) return false
  }
  if (unescape(path, 'other') === null) return false
  return host !== ''
}
