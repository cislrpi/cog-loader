import { homedir } from 'os';
import { join } from 'path';
import fs from 'fs';

export interface Cog {
  watcher?: string;
  [key: string]: unknown;
}

export interface CogLoaderOptions {
  cwd?: string;
  override?: boolean;
  overrideName?: string;
  checkHomeDirectory?: boolean;
}

interface InstantiatedOptions {
  cwd: string;
  override: boolean;
  overrideName: string;
  checkHomeDirectory: boolean;
}

export function overrideObject(target: Cog, override: {[key: string]: unknown}): Cog {
  // because we interop with JS libraries, and do not trust them to understand type signatures
  if (typeof override !== 'object' || Array.isArray(override)) {
    return target;
  }
  const newObject = Object.assign({}, target);
  for (const key in override) {
    if (newObject[key] && newObject[key] === true) {
      newObject[key] = override[key];
    }
  }
  return newObject;
}

export default function loadCogFile(options?: CogLoaderOptions): Cog {
  const finalOptions: InstantiatedOptions = Object.assign({
    cwd: process.cwd(),
    override: true,
    overrideName: 'cog.override.json',
    checkHomeDirectory: true,
  }, options);

  const cogPath = join(finalOptions.cwd, 'cog.json');
  if (!fs.existsSync(cogPath)) {
    throw new Error(`Could not load cog file at ${cogPath}`);
  }

  let cog: Cog = JSON.parse(fs.readFileSync(cogPath, {encoding: 'utf8'}));
  if (finalOptions.checkHomeDirectory && fs.existsSync(join(homedir(), 'cog.json'))) {
    cog = overrideObject(cog, JSON.parse(fs.readFileSync(join(homedir(), 'cog.json'), {encoding: 'utf8'})));
  }
  if (finalOptions.override && fs.existsSync(join(finalOptions.cwd, finalOptions.overrideName))) {
    cog = overrideObject(cog, JSON.parse(fs.readFileSync(join(finalOptions.cwd, finalOptions.overrideName), {encoding: 'utf8'})));
  }
  return cog;
}
