import Gtk from 'gi://Gtk?version=4.0'

import Core from './core'

import * as Symbols from './symbols'

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
}

class Signal extends Renderless {
  props: Props

  constructor(props: { [key: string]: any }) {
    super(Symbols.SIGNAL)
    this.props = props
  }

  appendTo(parentInstance: Gtk.Widget) {
    parentInstance.connect(
      this.props['name'] as string,
      this.props['handler'] as (...args: any[]) => any,
    )
  }
}

const override = {
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
    if (type !== 'signal') {
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

    child.appendTo(parentInstance)
  },
}

/**
 * @todo Not convinced this is type-safe (or even possible to be type-safe)
 */
const config: HostConfig<
  LowerWidgetKeys,
  Props,
  Gtk.Window,
  Gtk.Widget,
  never,
  never,
  never,
  Gtk.Widget,
  null,
  never,
  never,
  number,
  number
> = Object.setPrototypeOf(override, Core)

export default config
