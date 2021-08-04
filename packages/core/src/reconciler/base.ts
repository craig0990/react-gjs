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
const capitalize = <T extends string>(value: T): Capitalize<T> =>
  `${value[0]}${value.slice(1)}` as Capitalize<T>

const builder = new Gtk.Builder()

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
  createInstance(type: LowerWidgetKeys, allProps: Props = {}): Gtk.Widget {
    const widgetName = capitalize(type)

    const { children, ...props } = allProps

    if (!Gtk[widgetName]) {
      throw new TypeError(`Invalid widget: ${widgetName}`)
    }

    const WidgetClass = Gtk[widgetName]

    return new WidgetClass(props)
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
    parentInstance.vfunc_add_child(builder, child, null)
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

  /* Mutation methods */

  /**
   * Appends a child to the parent instance
   *
   * @todo I am having trouble being type safe on the `remove()` call, but also
   *   unsure how to "enforce" the idea that only a `Gtk.Box` etc. should have
   *   children. A `Gtk.Label` should not have children (even though it does
   *   actually seem to execute)
   */
  appendChild(parentInstance, child) {
    const parent = child.get_parent()

    // Check if child is already attached - presumably React is re-ordering the children
    if (parent != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof (parent as any).remove !== 'function') {
        throw new TypeError('Cannot remove child from parent')
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(parent as any).remove(child)
    }

    parentInstance.vfunc_add_child(builder, child, null)
  },
}

// reconciler.createInstance('label')

export default reconciler
