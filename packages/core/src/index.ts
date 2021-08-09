import Gtk from 'gi://Gtk?version=4.0'

/**
 * Provides the core React renderer logic and provides several implementations
 *
 * - {@link BaseReconciler} - the bare minimum
 *
 * @module
 */

import Reconciler from 'react-reconciler'

import CoreReconciler from './reconciler/core'
import RenderlessChildrenReconciler from './reconciler/renderless-children'

/**
 * Render function using BasicReconciler by default
 */
const render = (
  element: JSX.Element,
  container: Gtk.Window,
  options = {
    reconciler: CoreReconciler,
  },
): void => {
  const renderer = Reconciler(options.reconciler)
  const root = renderer.createContainer(container, 0, false, null)

  renderer.updateContainer(element, root)
}

export { render, CoreReconciler, RenderlessChildrenReconciler }
