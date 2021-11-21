/**
 * Capitalizes the first letter of a string
 *
 * @param   {string} value The value to capitalize
 *
 * @returns {string}       The capitalized value
 */
export const capitalize = <T extends string>(value: T): Capitalize<T> =>
  `${value[0].toUpperCase()}${value.slice(1)}` as Capitalize<T>
