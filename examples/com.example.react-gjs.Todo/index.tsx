import polyfill from '@react-gjs/polyfill'
import Gtk from 'gi://Gtk?version=4.0'
import Gio from 'gi://Gio'
import Gdk from 'gi://Gdk'
import { render, RenderlessChildrenReconciler } from '@react-gjs/core'
import React, { useState } from 'react'

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

const { BUTTON_PRIMARY, BUTTON_MIDDLE, BUTTON_SECONDARY } = Gdk

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

class App extends React.Component<Record<string, never>, { count: number, visible: boolean }> {

    constructor(props: any) {
        super(props)
        this.state = { count: 0, visible: true }
        // this.onClick = this.onClick.bind(this)
    }

    onClick() {
        print('Clicked')
        const { count, visible } = this.state
        this.setState({ count: count + 1, visible: !visible })
    }

    cellClick(event: Gtk.GestureSingle) {
        print('CELL CLICKED: ' + event.constructor.name)
        const button = event.get_current_button()

        switch (button) {
            case BUTTON_PRIMARY:
                print('Primary click')
            break;
            case BUTTON_MIDDLE:
                print('Middle click')
            break;
            case BUTTON_SECONDARY:
                print('Secondary click')
            break;
            default:
                print('Unknown button: ' + (button).toString())
            break;
        }

    }

    render() {
        const { count, visible } = this.state
        return <box orientation={Gtk.Orientation.VERTICAL}>
            <label label={`Clicked: ${count} times`} halign={Gtk.Align.CENTER}>
                <gestureSingle button={0}>
                    <signal name="end" handler={this.cellClick.bind(this)} />
                </gestureSingle>
            </label>
            <button label="Click me">
                <signal name="clicked" handler={this.onClick.bind(this)} />
            </button>
            {visible && (
            <box>
                <grid hexpand={true} column-homogeneous={true}>
                    <label label="0,0">
                        <layout column="0" row="0" />
                    </label>
                    <label label="1,0">
                        <layout column="1" row="0" />
                    </label>
                    <label label="0,1">
                        <layout column="0" row="1" />
                    </label>
                    <label label="1,1">
                        <layout column="1" row="1" />
                    </label>
                </grid>
            </box>)}
        </box>
    }
}

application.run(null)
