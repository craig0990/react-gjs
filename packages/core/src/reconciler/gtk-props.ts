import Gtk from 'gi://Gtk?version=4.0'

import type { HostConfig } from 'react-reconciler'

import type { LowerWidgetKeys } from '../lib/types'

type Props = Record<string, unknown>

type PossibleContainer = Gtk.Widget & {
  remove?: (widget: Gtk.Widget) => void
}

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

const GTK_NAMESPACE = 'gtk:'
const GTK_NAMESPACE_LAYOUT = 'gtk:layout'
const GTK_NAMESPACE_CONNECT_PREFIX = 'gtk:connect-'

const getFilteredProps = (
  { children, ...props }: Props,
  filter: (key: keyof Props) => boolean,
) =>
  Object.keys(props)
    .filter(filter)
    .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {})

const getWidgetProps = ({ children, ...props }: Props): Props =>
  getFilteredProps(props, key => !key.startsWith(GTK_NAMESPACE))

const getConnectProps = ({
  children,
  ...props
}: // It's typed as `any` in `@gi-types/gtk4/index.d.ts`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Props): Record<string, (...args: any[]) => any> =>
  getFilteredProps(props, key => key.startsWith(GTK_NAMESPACE_CONNECT_PREFIX))

const config: HostConfig<
  LowerWidgetKeys, // valid host element type
  Props, // props
  Gtk.Window, // container
  Gtk.Widget, // element instance
  never, // text instance
  never, // suspense instance
  never, // hydratable instance
  Gtk.Widget, // public instanct
  null, // host context
  Record<string, unknown>, // update payload
  never, // child set
  number, // timeout handle
  number // notimeout
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

    const widgetProps = getWidgetProps(props)

    if (!Gtk[widgetName]) {
      throw new TypeError(`Invalid widget: ${widgetName}`)
    }

    const widget = new Gtk[widgetName](widgetProps)

    const connectProps = getConnectProps(props)

    for (const key in connectProps) {
      widget.connect(
        key.substr(GTK_NAMESPACE_CONNECT_PREFIX.length),
        connectProps[key],
      )
    }

    return widget
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
    if (props[GTK_NAMESPACE_LAYOUT]) {
      return true
    }

    return false
  },

  commitMount(instance, type, props, internalHandle) {
    const parent = instance.get_parent()
    if (!parent) {
      return
    }

    const { [GTK_NAMESPACE_LAYOUT]: layout } = props

    Object.assign(parent.layout_manager.get_layout_child(instance), layout)
  },

  /**
   * @todo Credit
   *   https://github.com/RaynalHugo/react-cesium-fiber/blob/729f087ca19b35ced980c14cdfb1dae3e95661a6/src/reconciler/prepare-update.ts
   */
  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainer,
    hostContext,
  ) {
    const oldKeys = Object.keys(oldProps)
    const newKeys = Object.keys(newProps)

    /**
     * Nullify all the old keys first, so we can reset them later with null
     * values if they have become unset
     */
    const nulled = oldKeys
      .filter(key => key !== 'children')
      // Ignore props that have the same identity between updates
      .filter(key => oldProps[key] !== newProps[key])
      .reduce((out, key) => {
        return {
          ...out,
          [key]: null,
        }
      }, {})

    const diff = newKeys
      .filter(key => key !== 'children')
      // Ignore props that have the same identity between updates
      .filter(key => oldProps[key] !== newProps[key])
      .reduce((out, key) => {
        return {
          ...out,
          [key]: newProps[key],
        }
      }, {})

    if (Object.keys(diff).length === 0) {
      return null
    }

    // print('Calculated diff for ' + type)
    // print(JSON.stringify(diff))

    return { ...nulled, ...diff }
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
    const parent = child.get_parent() as PossibleContainer

    // Check if child is already attached - presumably React is re-ordering the children
    if (parent != null) {
      if (typeof parent.remove !== 'function') {
        throw new TypeError(
          `Cannot remove child from parent: ${parent.constructor.name}`,
        )
      }

      parent.remove(child)
    }

    parentInstance.vfunc_add_child(builder, child, null)
  },

  clearContainer(container) {
    container.set_child(null)
  },

  appendChildToContainer(container, child) {
    container.set_child(child)
  },

  removeChild(parentInstance: PossibleContainer, child) {
    if (typeof parentInstance.remove === 'function') {
      parentInstance.remove(child)
    } else {
      log(
        `${parentInstance.constructor.name} called remove, but is not a container`,
      )
    }
  },

  commitUpdate(instance, updatePayload) {
    Object.assign(instance, updatePayload)
  },
}

export default config
