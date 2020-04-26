import { overrideObject } from '../src/index';

describe('test overrideObject', () => {
  test('should override true booleans', () => {
    const cog = {
      foo: true,
      bar: false,
      baz: 'test',
      taz: null,
      kaz: {}
    };
    const override = {
      foo: 'override',
      bar: 'not override',
      baz: 'not me',
      taz: 'definitely not',
      kaz: {foo: false}
    };
    const expected = {
      foo: 'override',
      bar: false,
      baz: 'test',
      taz: null,
      kaz: {}
    };
    expect(overrideObject(cog, override)).toStrictEqual(expected);
  });

  test('should not override with non-object', () => {
    const cog = {
      test: true,
      '0': true
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(overrideObject(cog, ['test'])).toStrictEqual(cog);
  });
});
