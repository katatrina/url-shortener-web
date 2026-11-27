/**
 * Favicon of a URL's site from Google's favicon service. Only the host name is sent.
 * Null for hosts that aren't public sites, so internal names stay private.
 */
export function faviconUrl(url: string): string | null {
  let host: string
  try {
    host = new URL(url).hostname
  } catch {
    return null
  }
  const isIp = /^[\d.]+$/.test(host) || host.startsWith('[')
  if (isIp || !host.includes('.') || /\.(local|localhost|internal|lan|home|test)\.?$/.test(host)) return null
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`
}
