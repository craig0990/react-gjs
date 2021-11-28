import Gtk from 'gi://Gtk?version=4.0'

import type { LowerWidgetKeys } from '../lib/types'

import Core from './core'
import { providers as cssProviders } from '../stylesheet'

import type { Props as CoreProps, ReactGJSHostConfig } from './core'

type Props = CoreProps & {
  'css-classes'?: string[]
}

import { capitalize } from '../lib/helpers'

const { STYLE_PROVIDER_PRIORITY_APPLICATION } = Gtk

const GTK_NAMESPACE = 'gtk:'
const GTK_NAMESPACE_LAYOUT = `${GTK_NAMESPACE}layout`
const GTK_NAMESPACE_CONNECT_PREFIX = `${GTK_NAMESPACE}connect-`

const getFilteredProps = (
  { children, ...props }: Props,
  filter: (key: keyof Props) => boolean,
) =>
  Object.keys(props)
    .filter(filter)
    .reduce((acc, key) => ({ ...acc, [key]: props[key] }), {})

const getWidgetProps = ({ children, ...props }: Props): Props =>
  getFilteredProps(props, key => !key.startsWith(GTK_NAMESPACE))

/**
 * @todo We're currently always adding providers
 *
 *   I'm guessing duplicate instances are "handled", but we never remove them,
 *   even if we can reasonably guess they're useless.
 */
const setStyles = (widget: Gtk.Widget, classes: string[]) => {
  for (const className of classes) {
    widget
      .get_style_context()
      .add_provider(
        cssProviders.get(className),
        STYLE_PROVIDER_PRIORITY_APPLICATION,
      )
  }
}

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

    if (props['css-classes']) {
      setStyles(widget, props['css-classes'])
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

  commitUpdate(...args) {
    const [instance, updatePayload] = args

    if (Core.commitUpdate) {
      Core.commitUpdate(...args)
    }

    if (updatePayload['css-classes']) {
      setStyles(instance, updatePayload['css-classes'])
    }
  },
} as Partial<ReactGJSHostConfig>)

export default config
