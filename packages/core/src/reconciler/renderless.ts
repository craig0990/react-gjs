import Gtk from 'gi://Gtk?version=4.0'

import Core from './core'

import Symbols from './symbols'

import type { HostConfig, OpaqueHandle } from 'react-reconciler'

import type { LowerWidgetKeys } from '../lib/types'

type Props = Record<string, unknown>

/**
 * Capitalizes the first letter of a string
 *
 * @param   {string} value The value to capitalize
 *
 * @returns {string}       The capitalized value
 */
const capitalize = <T extends string>(value: T): Capitalize<T> =>
  `${value[0].toUpperCase()}${value.slice(1)}` as Capitalize<T>

const builder = new Gtk.Builder()

class Renderless {
  static factory = (type: string, props: Props) => {
    switch (type) {
      case 'signal':
        return new Signal(props)
        break
      case 'layout':
        return new LayoutChild(props)
        break
      default:
        throw new Error(`Unhandled child type ${type}`)
        break
    }
  }

  type: symbol

  constructor(type: symbol) {
    this.type = type
  }

  appendTo(parentInstance: Gtk.Widget) {
    throw new Error('Not implemented')
  }

  commitMount() {
    // no-op
  }
}

class Signal extends Renderless {
  props: Props

  handlerId: number | null

  constructor(props: { [key: string]: any }) {
    super(Symbols.SIGNAL)
    this.props = props
    this.handlerId = null
  }

  appendTo(parentInstance: Gtk.Widget) {
    if (!this.handlerId) {
      this.handlerId = parentInstance.connect(
        this.props['name'] as string,
        this.props['handler'] as (...args: any[]) => any,
      )
    }

    // Already connected?
  }

  removeFrom(parentInstance: Gtk.Widget) {
    if (this.handlerId) {
      parentInstance.disconnect(this.handlerId)
    }

    // Not yet connected?
  }
}

class LayoutChild extends Renderless {
  props: Props

  parent: Gtk.Widget | null

  constructor(props: { [key: string]: any }) {
    super(Symbols.LAYOUT)
    this.props = props
    this.parent = null
  }

  appendTo(parentInstance: Gtk.Widget) {
    this.parent = parentInstance
  }

  removeFrom(parentInstance: Gtk.Widget) {
    // @TODO
  }

  commitMount() {
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

/**
 * @todo This feels unnecessarily verbose
 */
const isNormalType = (type: string): type is LowerWidgetKeys => {
  return !Symbols[type.toUpperCase() as keyof typeof Symbols & string]
}

/**
 * Experimental approach to use children that don't render, but attach
 * themselves to their parent in other ways - e.g. signal handlers.
 *
 * This looks and feels a bit closer to the `Gtk.Builder` XML, but is not a 1-1 mapping.
 *
 * @todo Not convinced this is type-safe (or even possible to be type-safe)
 */
const config: HostConfig<
  LowerWidgetKeys,
  Props,
  Gtk.Window,
  Gtk.Widget | Renderless,
  never,
  never,
  never,
  Gtk.Widget,
  null,
  Record<string, unknown>,
  never,
  number,
  number
> = {
  ...Core,

  /**
   * Creates an element
   *
   * @param type A `camelCased` widget name
   */
  createInstance(
    type: LowerWidgetKeys | 'signal',
    allProps: Props = {},
    container: Gtk.Window,
    hostContext: null,
    internalHandle: OpaqueHandle,
  ): Gtk.Widget | Renderless {
    if (isNormalType(type)) {
      return Core.createInstance(
        type,
        allProps,
        container,
        hostContext,
        internalHandle,
      )
    }

    return Renderless.factory(type, allProps)
  },

  appendInitialChild(
    parentInstance: Gtk.Widget,
    child: Gtk.Widget | Renderless,
  ) {
    if (!(child instanceof Renderless)) {
      return Core.appendInitialChild(parentInstance, child)
    }

    print('Applying ' + child.constructor.name)
    child.appendTo(parentInstance)
  },

  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    if (isNormalType(type)) {
      return Core.finalizeInitialChildren(
        instance as Gtk.Widget,
        type,
        props,
        rootContainer,
        hostContext,
      )
    }

    // Layout nodes need finalizing in `commitMount`
    return type === 'layout'
  },

  commitMount(
    instance: Gtk.Widget | Renderless,
    type: string,
    props: Props,
    internalHandle: any,
  ) {
    if (!(instance instanceof Renderless)) {
      return
      // return Core.commitMount(instance, type, props, internalHandle)
    }

    instance.commitMount()
  },
}

export default config
