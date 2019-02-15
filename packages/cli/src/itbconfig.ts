export interface ITBConfig {
  archive?: string;
  file?: string;
  methods?: string;
}

export type ITBConfigKeys = keyof ITBConfig;
