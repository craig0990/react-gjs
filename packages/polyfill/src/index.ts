/**
 * Intended to polyfill the features defined by the [React Native - JavaScript
 * Environment](https://reactnative.dev/docs/javascript-environment) for
 * interoperability with the React packages.
 *
 * @module
 */

const setTimeout = (): void => {
  // @TODO
}

const polyfill = (target): void => {
  target.setTimeout = setTimeout
}

export default polyfill

export { setTimeout }
