/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GRAPHQL_ENDPOINT: string;
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
