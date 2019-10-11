# random-normal

> Return a normally-distributed random variate.


[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/mock-end/random-normal/blob/master/LICENSE)

[![build:?](https://img.shields.io/travis/mock-end/random-normal/master.svg?style=flat-square)](https://travis-ci.org/mock-end/random-normal)
[![coverage:?](https://img.shields.io/coveralls/mock-end/random-normal/master.svg?style=flat-square)](https://coveralls.io/github/mock-end/random-normal)


## Install

```
$ npm install --save random-normal 
```

## Usage

```js
var randomNormal = require('random-normal');

// API
// - randomNormal([options]);
```

By default this starts with a mean of `0` and a standard deviation of `1` which is the standard normal distribution.

```js
randomNormal()
// => 0.4244767651300604
```
Optionally specify a mean and/or deviation.

```js
// Notice, since no deviation was specified, using the default of `1`
randomNormal({mean: 100})
// => 99.68352269988522

// For example, to get a random IQ (which by definition has a mean of 100
// and a standard deviation of 15)
randomNormal({mean: 100, dev: 15})
// => 85.11040121833615
```

Used in combination with the above generators, this can be an extremely powerful way to get more realistic results as often “pure random” results fail to approximate the real world.


## Related

- [random-uuid](https://github.com/mock-end/random-uuid) - Return a random uuid.
- [random-identity](https://github.com/mock-end/random-identity) - Return a random ID.
- [random-dx](https://github.com/mock-end/random-dx) - Return a value equal to the roll of a die.
- [random-hexhash](https://github.com/mock-end/random-hexhash) - Return a random hex hash.
- [random-rpg](https://github.com/mock-end/random-rpg) - Return an array of dice values.
- [random-file](https://github.com/mock-end/random-file) - Return a random file name with random extension.
- [random-semver](https://github.com/mock-end/random-semver) - Return a random version.

## Contributing

Pull requests and stars are highly welcome.

For bugs and feature requests, please [create an issue](https://github.com/mock-end/random-normal/issues/new).
