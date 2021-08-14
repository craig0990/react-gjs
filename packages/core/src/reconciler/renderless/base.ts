import type Gtk from 'gi://Gtk?version=4.0'

export default class Renderless {
  appendTo(parentInstance: Gtk.Widget) {
    throw new Error('Not implemented')
  }

  commitMount() {
    // no-op
  }
}
