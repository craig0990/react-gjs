import Gtk from 'gi://Gtk?version=4.0'

import type { LowerWidgetKeys } from '../lib/types'

import Core from './core'

import type { Props, ReactGJSHostConfig } from './core'

import { capitalize } from '../lib/helpers'

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

const config: ReactGJSHostConfig = Object.assign({}, Core, {
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
} as Partial<ReactGJSHostConfig>)

export default config
