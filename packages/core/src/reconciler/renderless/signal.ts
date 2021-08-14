import type Gtk from 'gi://Gtk?version=4.0'

import Renderless from './base'

type Props = Record<string, unknown>

export default class Signal extends Renderless {
  props: Props

  handlerId: number | null

  constructor(props: { [key: string]: any }) {
    super()
    this.props = props
    this.handlerId = null
  }

  appendTo(parentInstance: Gtk.Widget): void {
    if (!this.handlerId) {
      this.handlerId = parentInstance.connect(
        this.props['name'] as string,
        this.props['handler'] as (...args: any[]) => any,
      )
    }

    // Already connected?
  }

  removeFrom(parentInstance: Gtk.Widget): void {
    if (this.handlerId) {
      parentInstance.disconnect(this.handlerId)
    }

    // Not yet connected?
  }
}
