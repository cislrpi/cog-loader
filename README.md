# cog-loader

[![NPM Version](https://img.shields.io/npm/v/@bishopcais/cog-loader)](https://npmjs.com/package/@bishopcais/cog-loader)
[![Test](https://github.com/bishopcais/cog-loader/workflows/Test/badge.svg?branch=master&event=push)](https://github.com/bishopcais/cog-loader/actions?query=event%3Apush+branch%3Amaster+workflow%3ATest)
[![codecov](https://codecov.io/gh/bishopcais/cog-loader/branch/master/graph/badge.svg)](https://codecov.io/gh/bishopcais/cog-loader)

Utility library for loading cog.json files. When the `cogLoader` function is 
called, this module will look for and combine cog files in a number of 
locations. By default, this module will look for a cog file at
`$(pwd)/cog.json`, `$(pwd)/cog.override.json` and `~/.cog.json`. Only
`${pwd}/cog.json` (or whatever specified as `cogPath`, see below) need
exist, and further options exist to configure behavior.

The override algorithm for loading subsequent files is based on overwriting
any key who's value is `true` from the previous file. For example, given
the following object in `${pwd}/cog.json`:

```json
{
    "foo": true,
    "bar": false,
    "baz": "hello"
}
```

and then the object in `${pwd}/cog.override.json`:

```json
{
    "foo": "world",
    "bar": {
        "test": true,
    },
}
```

The resulting object will be:

```json
{
    "foo": "world",
    "bar": false,
    "baz": "hello"
}
```

Note, the override algorithm only considers key/value pairs at the top-level
of the object, and is __not__ recursive.

## Installation

```bash
npm install @bishopcais/cog-loader
```

## Usage

```typescript
import cogLoader from '@cisl/cog-loader';

const cogJson = cogLoader({
    // specified options, see below
});
```

The `cogLoader` function takes an object of settings to configure options
to use when loading cog.json file. The function also accepts passing in
nothing if you wish to use all default settings, which is equiavelent to
passing in any empty object. The options object supports the following
key/value pairs:

#### cwd: string

Default: `process.cwd()`

Key `cwd` takes a string that poinst to location to treat as the current
working directory for cog look-up. By default, this will be set to
`process.cwd()`.

#### cogPath: string

Default: `"cog.json"`

Takes a string to point to the primary `cog.json` file to load. If the
string is not an absolute location (e.g. `/path/to/cog.json`), then it
will prepend the value of the `cwd` option to the string value.

#### override: boolean

Default: `true`

Toggles whether or not any overrides will happen onto the primary cog.json
file. If `false`, no overrides will happen, `true` will enable it.

#### overridePath: string

Default `"cog.override.json"`

String value to set the name of the cog.json file to use as an override to the
primary cog.json file. Similar to that key/value, if the path specified is not
absolute, it will prepend the value of the `cwd` option to the string value.

#### checkHomeDirectory: boolean

Default `true`

Toggles whether or not to use the override file in the home directory
(`~/.cog.json`). If `false`, then the home directory file will not be used,
and if `true`, it will be.
