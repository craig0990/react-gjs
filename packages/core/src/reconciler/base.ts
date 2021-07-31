import Gtk from 'gi://Gtk?version=4.0'

import type { HostConfig } from 'react-reconciler'

import type { LowerWidgetKeys } from '../lib/types'

type Props = Record<string, unknown>

/**
 * Capitalizes the first letter of a string
 *
 * @param   {string} value The value to capitalize
 *
 * @returns {string}       The capitalized value
 */
function capitalize<T extends string>(value: T): Capitalize<T> {
  return (value.charAt(0) + value.slice(1)) as Capitalize<T>
}

const reconciler: HostConfig<
  LowerWidgetKeys,
  Props,
  Gtk.Buildable,
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
> = {
  supportsMutation: true,

  supportsPersistence: false,

  supportsHydration: false,

  isPrimaryRenderer: true,

  /**
   * Creates an element
   *
   * @param type A `camelCased` widget name
   */
  createInstance(type: LowerWidgetKeys, props: Props = {}): Gtk.Widget {
    const widgetName = capitalize(type)

    if (!Gtk[widgetName]) {
      throw new TypeError(`Invalid widget: ${widgetName}`)
    }

    const widget = Gtk[widgetName]

    return new widget(props)
  },

  createTextInstance() {
    throw new Error(
      'Text nodes are not supported - use a Gtk.Label instead, and check for whitespace / booleans in your JSX',
    )
  },

  /**
   * Adds a child to a parent instance
   */
  appendInitialChild(parentInstance, child) {
    // @TODO
  },

  /**
   * Mutates an instance after the children are added, but before it is mounted
   * in the tree. Also if the return statement is `true`, a `commitMount` call
   * will be made later.
   *
   * We use this to determine if we need to perform layout modifications.
   */
  finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    return false
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext,
  ) {
    return null
  },

  shouldSetTextContent(type, props) {
    return false
  },

  getRootHostContext(rootContainer) {
    return null
  },

  getChildHostContext(parentHostContext, type, rootContainer) {
    return null
  },

  getPublicInstance(instance) {
    return instance
  },

  prepareForCommit(containerInfo) {
    return null
  },

  resetAfterCommit(containerInfo) {
    return null
  },

  preparePortalMount(containerInfo) {
    // no-op
  },

  now() {
    // @TODO
    return 0
  },

  scheduleTimeout(fn, delay) {
    // @TODO
    return -1
  },

  cancelTimeout(id) {
    // no-op
  },

  noTimeout: -1,
}

// reconciler.createInstance('label')

export default reconciler
