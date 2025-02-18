/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ST_CONNECTION_URI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
