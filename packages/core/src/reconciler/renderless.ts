import Gtk from 'gi://Gtk?version=4.0'
import type { HostConfig, OpaqueHandle } from 'react-reconciler'

import Core from './core'

import Renderless from './renderless/base'
import Signal from './renderless/signal'
import LayoutChild from './renderless/layoutchild'
import EventController from './renderless/eventcontroller'

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

/**
 * Generated list - see the `@react-gjs/generator` package
 */
const eventControllers = [
  'DropControllerMotion',
  'DropTarget',
  'DropTargetAsync',
  'EventControllerFocus',
  'EventControllerKey',
  'EventControllerLegacy',
  'EventControllerMotion',
  'EventControllerScroll',
  'GestureRotate',
  'DragSource',
  'GestureClick',
  'GesturePan',
  'GestureDrag',
  'GestureLongPress',
  'GestureStylus',
  'GestureSwipe',
  'GestureSingle',
  'GestureZoom',
  'Gesture',
  'PadController',
  'ShortcutController',
]

const factory = (type: string, props: Props) => {
  switch (type) {
    case 'signal':
      return new Signal(props)
      break
    case 'layout':
      return new LayoutChild(props)
      break
    default:
      if (eventControllers.includes(type)) {
        const widgetName = capitalize(type as LowerWidgetKeys)
        const controller = new Gtk[widgetName]()
        return new EventController({
          controller,
        })
      }

      throw new Error(`Unhandled child type ${type}`)
      break
  }
}

/**
 * @todo This feels unnecessarily verbose
 */
const isNormalType = (type: string): type is LowerWidgetKeys => {
  // @TODO hard-coded whitelist
  return !['signal', 'layout'].includes(type)
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

    return factory(type, allProps)
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
