import { homedir } from 'os';
import { join, isAbsolute } from 'path';
import fs from 'fs';
import { Cog, CogLoaderOptions, InstantiatedOptions } from './types';
import { overrideObject } from './util';

function cogLoader(options?: CogLoaderOptions): Cog {
  const finalOptions: InstantiatedOptions = Object.assign({
    cwd: process.cwd(),
    cogPath: 'cog.json',
    override: true,
    overridePath: 'cog.override.json',
    checkHomeDirectory: true,
  }, options);

  if (!isAbsolute(finalOptions.cogPath)) {
    finalOptions.cogPath = join(finalOptions.cwd, finalOptions.cogPath);
  }

  if (!isAbsolute(finalOptions.overridePath)) {
    finalOptions.overridePath = join(finalOptions.cwd, finalOptions.overridePath);
  }

  if (!fs.existsSync(finalOptions.cogPath)) {
    throw new Error(`Could not load cog file at ${finalOptions.cogPath}`);
  }

  const cog: Cog = JSON.parse(fs.readFileSync(finalOptions.cogPath, {encoding: 'utf8'}));

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

export = cogLoader;
