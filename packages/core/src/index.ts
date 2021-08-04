/**
 * Provides the core React renderer logic and provides several implementations
 *
 * - {@link BaseReconciler} - the bare minimum
 *
 * @module
 */

import Reconciler from 'react-reconciler'

import BaseReconciler from './reconciler/base'

const Renderer = Reconciler(BaseReconciler)

/**
 * Render function using BasicReconciler by default
 */
const render = (
  element: JSX.Element,
  container: Gtk.Widget,
  options = {},
): void => {
  // @TODO
}

export { render, BaseReconciler }
