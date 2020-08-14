import { join } from 'path';
import os from 'os';

import cogLoader from '../src/index';

describe('test cogLoader', () => {
  test('regular cog load, no override, no homedir cog', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'no_override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoader()).toStrictEqual({foo: true, bar: false});
  });

  test('cog load with cog.override.json', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoader()).toStrictEqual({foo: "override", bar: false, baz: "true", bat: true});
  });

  test('cog load with relative override path', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoader({overridePath: 'cog.custom.json'})).toStrictEqual({foo: "custom override", bar: false, baz: "true", bat: true});
  });

  test('cog load with override turned off', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'override', 'homedir'));

    expect(cogLoader({override: false})).toStrictEqual({foo: true, bar: false, baz: "true", bat: true});
  });

  test('cog load with homedir and regular override', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'override', 'homedir'));

    expect(cogLoader()).toStrictEqual({foo: "override", bar: false, baz: "true", bat: "homedir override"});
  });

  test('cog load with override absolute path', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoader({overridePath: join(__dirname, "data", "cog.override.json")})).toStrictEqual({
      foo: "different directory override",
      bar: false,
      baz: "true",
      bat: true,
    });
  });

  test('cog load with custom cwd', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoader({cwd: join(__dirname, 'data', 'no_override')})).toStrictEqual({foo: true, bar: false});
  });

  test('cog load with relative cogPath', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoader({cogPath: 'special.cog.json'})).toStrictEqual({foo: false, bar: true, baz: "true"});
  });

  test('cog load with absolute cogPath', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'no_override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoader({cogPath: join(__dirname, 'data', 'special.cog.json')})).toStrictEqual({foo: false, bar: true, baz: "true"});
  });

  test('non-existent directory', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    const fakeDir = join(__dirname, 'data', 'not_a_real_folder');
    cwdSpy.mockReturnValue(fakeDir);
    expect(() => cogLoader()).toThrowError(`Could not load cog file at ${join(fakeDir, 'cog.json')}`);
  });
});
