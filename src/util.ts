import { Cog } from './types';

/**
 * Given a target object and an override object, we override any keys in target whose values
 * are the boolean true. This modifies the target in-place.
 */
export function overrideObject(target: Cog, override: {[key: string]: unknown}): Cog {
  // because we interop with JS libraries, and do not trust them to understand type signatures
  if (typeof override !== 'object' || Array.isArray(override)) {
    return target;
  }
  for (const key in override) {
    if (target[key] && target[key] === true) {
      target[key] = override[key];
    }
  }
  return target;
}
