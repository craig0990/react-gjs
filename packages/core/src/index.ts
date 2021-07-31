/**
 * Provides the core React renderer logic and provides several implementations
 *
 * - {@link Reconciler} - the bare minimum
 *
 * @module
 */

import Gtk from 'gi://Gtk?version=4.0'
import Gio from 'gi://Gio'

import Reconciler from 'react-reconciler'

import type from 'react'

import BaseReconciler from './reconciler/base'

Gtk.init()

/**
 * Main application
 */
const application = new Gtk.Application({
  application_id: 'com.example.react-gjs.TODO',
  flags: Gio.ApplicationFlags.FLAGS_NONE,
})

application.connect('activate', (app: Gtk.Application) => {
  let activeWindow = app.activeWindow
  if (!activeWindow) {
    activeWindow = new Gtk.ApplicationWindow({
      application: app,
    })
  }

  activeWindow.present()
})

application.run(null)

const Renderer = Reconciler(BaseReconciler)

/**
 * Render function using BasicReconciler by default
 */
export default (
  element: JSX.Element,
  container: Gtk.Widget,
  options = {},
): void => {
  // @TODO
}

export { BaseReconciler }
