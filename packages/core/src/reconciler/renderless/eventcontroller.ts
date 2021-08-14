import type Gtk from 'gi://Gtk?version=4.0'

import Renderless from './base'

type Props = Record<string, unknown>

export default class EventController extends Renderless {
  props: Props

  constructor(props: { [key: string]: any }) {
    super()
    this.props = props
  }

  appendTo(parentInstance: Gtk.Widget): void {
    parentInstance.add_controller(
      this.props['controller'] as Gtk.EventController,
    )
  }

  removeFrom(parentInstance: Gtk.Widget): void {
    parentInstance.remove_controller(
      this.props['controller'] as Gtk.EventController,
    )
  }
}
