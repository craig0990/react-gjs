import type Gtk from 'gi://Gtk?version=4.0'

import Renderless from './base'

type Props = Record<string, unknown>

export default class LayoutChild extends Renderless {
  props: Props

  parent: Gtk.Widget | null

  constructor(props: { [key: string]: any }) {
    super()
    this.props = props
    this.parent = null
  }

  appendTo(parentInstance: Gtk.Widget): void {
    this.parent = parentInstance
  }

  removeFrom(parentInstance: Gtk.Widget): void {
    // @TODO
  }

  commitMount(): void {
    if (!this.parent) {
      return
    }
    const parent = this.parent.get_parent()
    print('append')
    print(this.parent.constructor.name)
    if (parent) {
      print('parent')
      const layoutChild = parent.layoutManager.get_layout_child(this.parent)
      Object.assign(layoutChild, this.props)
    }
  }
}
