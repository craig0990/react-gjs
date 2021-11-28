import Gdk from 'gi://Gdk'
import Gtk from 'gi://Gtk?version=4.0'
import React, { useState } from 'react'
import { StyleSheet } from '@react-gjs/core'

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

const styles = StyleSheet.create({
  label: {
    color: 'red'
  }
})

export default class App extends React.Component<Record<string, never>, { count: number, visible: boolean, stack: Gtk.Stack | null }> {

    stackRef = React.createRef<Gtk.Stack>()

    stackPage1Ref = React.createRef<Gtk.Box>()

    stackPage2Ref = React.createRef<Gtk.Box>()

    countRef = React.createRef<Gtk.Label>()

    constructor(props: any) {
        super(props)
        this.state = { count: 0, visible: true, stack: null }
    }

    componentDidMount() {
        print('mounted')
        if (!this.stackRef.current) {
            return
        }

        print('set mount state')
        this.setState({
            stack: this.stackRef.current
        })

        if (this.stackPage1Ref.current) {
            this.stackRef.current.get_page(this.stackPage1Ref.current).title = 'Page 1';
        }

        if (this.stackPage2Ref.current) {
            this.stackRef.current.get_page(this.stackPage2Ref.current).title = 'Page 2';
        }

        if (this.countRef.current) {
            //
            const gesture = new Gtk.GestureSingle({
                button: 0
            })
            gesture.connect('end', this.cellClick.bind(this))

            this.countRef.current.add_controller(gesture)
        }
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
        const { count, visible, stack } = this.state
        return <box orientation={Gtk.Orientation.VERTICAL}>
            <stackSwitcher stack={stack} />
            <stack ref={this.stackRef}>
                <box orientation={Gtk.Orientation.VERTICAL} ref={this.stackPage1Ref}>
		  <label
		    label={`Clicked: ${count} times`}
		    halign={Gtk.Align.CENTER}
		    ref={this.countRef}
		    css-classes={visible ? [styles.label] : []}
		  />
                    <button label="Click me" gtk:connect-clicked={this.onClick.bind(this)} />
                    {visible && (
                        <box>
                            <grid hexpand={true} column-homogeneous={true}>
                                <label label="0,0" gtk:layout={{
                                    column: 0,
                                    row: 0
                                    }}
                                />
                                <label label="1,0" gtk:layout={{
                                    column: 1,
                                    row: 0
                                    }}
                                />
                                <label label="0,1" gtk:layout={{
                                    column: 0,
                                    row: 1
                                    }}
                                />
                                <label label="1,1" gtk:layout={{
                                    column: 1,
                                    row: 1
                                    }}
                                />
                            </grid>
                        </box>)}
                </box>
                <box ref={this.stackPage2Ref}>
                    <label label="Page 2" />
                </box>
            </stack>
        </box>
    }
}
