import Gtk from 'gi://Gtk?version=4.0'

/**
 * Provides the core React render function and provides several implementations
 * of a reconciler
 *
 * @module
 */

import Reconciler from 'react-reconciler'

import CoreReconciler from './reconciler/core'
import GtkPropsReconciler from './reconciler/gtk-props'
import StyleSheet from './stylesheet'

/**
 * Render function using BasicReconciler by default
 */
const render = (
  element: JSX.Element,
  container: Gtk.Window,
  // @TODO I think we might want a "higher-kinded type", but I'm not sure if that's the right term
  // @see possibly https://github.com/microsoft/TypeScript/issues/1213
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: { reconciler: any } = {
    reconciler: CoreReconciler,
  },
): void => {
  const renderer = Reconciler(options.reconciler)
  const root = renderer.createContainer(container, 0, false, null)

  renderer.updateContainer(element, root)
}

export { render, CoreReconciler, GtkPropsReconciler, StyleSheet }
