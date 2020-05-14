import { join } from 'path';
import os from 'os';

import cogLoadFunction, { overrideObject } from '../src/index';

describe('test overrideObject', () => {
  test('should override target object', () => {
    const cog = {
      foo: true,
      bar: false,
    };
    overrideObject(cog, {foo: 'override', bar: true});
    expect(cog).toStrictEqual({foo: 'override', bar: false});
  });

  test('should override true booleans', () => {
    const cog = {
      foo: true,
      bar: false,
      baz: 'test',
      taz: null,
      kaz: {},
    };
    const override = {
      foo: 'override',
      bar: 'not override',
      baz: 'not me',
      taz: 'definitely not',
      kaz: {foo: false},
    };
    const expected = {
      foo: 'override',
      bar: false,
      baz: 'test',
      taz: null,
      kaz: {},
    };
    expect(overrideObject(cog, override)).toStrictEqual(expected);
  });

  test('should not override with non-object', () => {
    const cog = {
      test: true,
      '0': true,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(overrideObject(Object.assign({}, cog), ['test'])).toStrictEqual(cog);
  });
});

describe('test cogLoadFunction', () => {
  test('regular cog load, no override, no homedir cog', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'no_override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoadFunction()).toStrictEqual({foo: true, bar: false});
  });

  test('cog load with cog.override.json', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoadFunction()).toStrictEqual({foo: "override", bar: false, baz: "true", bat: true});
  });

  test('cog load with relative override path', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoadFunction({overridePath: 'cog.custom.json'})).toStrictEqual({foo: "custom override", bar: false, baz: "true", bat: true});
  });

  test('cog load with override turned off', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'override', 'homedir'));

    expect(cogLoadFunction({override: false})).toStrictEqual({foo: true, bar: false, baz: "true", bat: true});
  });

  test('cog load with homedir and regular override', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'override', 'homedir'));

    expect(cogLoadFunction()).toStrictEqual({foo: "override", bar: false, baz: "true", bat: "homedir override"});
  });

  test('cog load with override absolute path', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    cwdSpy.mockReturnValue(join(__dirname, 'data', 'override'));
    const homedirSpy = jest.spyOn(os, 'homedir');
    homedirSpy.mockReturnValue(join(__dirname, 'data', 'invalid_homedir'));

    expect(cogLoadFunction({overridePath: join(__dirname, "data", "cog.override.json")})).toStrictEqual({
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

    expect(cogLoadFunction({cwd: join(__dirname, 'data', 'no_override')})).toStrictEqual({foo: true, bar: false});
  });

  test('non-existent directory', () => {
    const cwdSpy = jest.spyOn(process, 'cwd');
    const fakeDir = join(__dirname, 'data', 'not_a_real_folder');
    cwdSpy.mockReturnValue(fakeDir);
    expect(() => cogLoadFunction()).toThrowError(`Could not load cog file at ${join(fakeDir, 'cog.json')}`);
  });
});
