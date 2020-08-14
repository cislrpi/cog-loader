export interface Cog {
  watcher?: string;
  [key: string]: unknown;
}

export interface CogLoaderOptions {
  cwd?: string;
  cogPath?: string;
  override?: boolean;
  overridePath?: string;
  checkHomeDirectory?: boolean;
}

export interface InstantiatedOptions {
  cwd: string;
  cogPath: string;
  override: boolean;
  overridePath: string;
  checkHomeDirectory: boolean;
}
