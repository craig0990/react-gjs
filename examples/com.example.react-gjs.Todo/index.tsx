import polyfill from '@react-gjs/polyfill'
import Gtk from 'gi://Gtk?version=4.0'
import Gio from 'gi://Gio'
import { render, RenderlessChildrenReconciler } from '@react-gjs/core'
import React from 'react'

polyfill(globalThis)

Gtk.init()

/* @TODO how to make this part of the core lib? */
declare module 'react' {
  namespace JSX {
    interface ElementChildrenAttribute {
      children: {}
    }

    interface IntrinsicElements {
      /* @TODO nope, my Type-fu is maxed out - no idea how to remap the ConstructorProperties to types here */
      [key: string]: any
    }
  }
}

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
    reconciler: RenderlessChildrenReconciler,
  })
})

const onClick = () => print('I was clicked')

function App() {
  return (
    <box orientation={Gtk.Orientation.VERTICAL}>
      <label label="Hello, world!" halign={Gtk.Align.CENTER} />
      <button label="Click me">
        <signal name="clicked" handler={onClick} />
      </button>
    </box>
  )
}

application.run(null)
