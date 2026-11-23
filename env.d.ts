/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the backend API, e.g. http://localhost:8080. */
  readonly VITE_API_URL?: string
  /** Base of short links, e.g. http://short.localhost:8080. */
  readonly VITE_SHORT_URL_BASE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
