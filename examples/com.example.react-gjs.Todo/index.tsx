import polyfill from '@react-gjs/polyfill'
import Gtk from 'gi://Gtk?version=4.0'
import Gio from 'gi://Gio'
import Gdk from 'gi://Gdk'
import React from 'react'
import { render, GtkPropsReconciler } from '@react-gjs/core'

import App from './App'

polyfill(globalThis)

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

  render(<App />, activeWindow, {
      reconciler: GtkPropsReconciler
  })
})


application.run(null)
