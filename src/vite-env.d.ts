/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_DEV_MODE: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_COLLECT_PII: string
  readonly VITE_TRACK_LOCATION: string
  readonly VITE_AGGREGATE_DATA_ONLY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
