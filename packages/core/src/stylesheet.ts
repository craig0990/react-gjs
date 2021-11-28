import Gtk from 'gi://Gtk?version=4.0'

// @TODO sort this out - this doesn't seem like the best way of doing things,
// there's probably something in GLib we can use
// @see https://stackoverflow.com/a/21963136
const uuid = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

/**
 * "Global" list of providers, that lets us retrieve a `Gtk.CssProvider` from
 * it's class name
 */
export const providers = new Map()

export default {
  create(sheets: { [k: string]: Record<string, string> }): {
    [k: keyof typeof sheets]: Gtk.CssProvider
  } {
    return Object.entries(sheets).reduce((sheets, [selector, styles]) => {
      const styleString = Object.entries(styles)
        .map(([key, value]) => {
          const cssProp = key.replace(
            /[A-Z]/g,
            match => `-${match.toLowerCase()}`,
          )
          return `${cssProp}:${value};`
        })
        .join('')

      // Class name shoudl start with an alpha character
      const className = `class-${uuid()}`

      print(selector)
      print(`.${className} { ${styleString} }`)

      const provider = new Gtk.CssProvider()
      provider.load_from_data(`.${className} { ${styleString} }`)

      providers.set(className, provider)

      return {
        ...sheets,
        [selector]: className,
      }
    }, {})
  },
}
