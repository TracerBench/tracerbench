export interface ITBConfig {
  archive?: string;
  file?: string;
  methods?: string;
  control?: string;
  cpu?: string;
  experiment?: string;
  fidelity?: string;
  report?: string;
  event?: string;
  marker?: string;
  network?: string;
  output?: string;
  url?: string;
  archiveOutput?: string;
  locations?: string;
  har?: string;
  filter?: string;
  marks?: string;
  urlOrFrame?: string;
}

export type ITBConfigKeys = keyof ITBConfig;
