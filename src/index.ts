import { homedir } from 'os';
import { join, isAbsolute } from 'path';
import fs from 'fs';

export interface Cog {
  watcher?: string;
  [key: string]: unknown;
}

export interface CogLoaderOptions {
  cwd?: string;
  override?: boolean;
  overridePath?: string;
  checkHomeDirectory?: boolean;
}

interface InstantiatedOptions {
  cwd: string;
  override: boolean;
  overridePath: string;
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
    overridePath: 'cog.override.json',
    checkHomeDirectory: true,
  }, options);

  if (!isAbsolute(finalOptions.overridePath)) {
    finalOptions.overridePath = join(finalOptions.cwd, finalOptions.overridePath);
  }
  const cogPath = join(finalOptions.cwd, 'cog.json');
  if (!fs.existsSync(cogPath)) {
    throw new Error(`Could not load cog file at ${cogPath}`);
  }

  const cog: Cog = JSON.parse(fs.readFileSync(cogPath, {encoding: 'utf8'}));

  // overrides that sit next to final take precendence over global home overrides
  if (finalOptions.override && fs.existsSync(finalOptions.overridePath)) {
    overrideObject(cog, JSON.parse(fs.readFileSync(finalOptions.overridePath, {encoding: 'utf8'})));
  }

  const homeCogPath = join(homedir(), '.cog.json');
  if (finalOptions.override && finalOptions.checkHomeDirectory && fs.existsSync(homeCogPath)) {
    overrideObject(cog, JSON.parse(fs.readFileSync(homeCogPath, {encoding: 'utf8'})));
  }
  return cog;
}
