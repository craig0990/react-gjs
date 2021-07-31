import Gtk from 'gi://Gtk?version=4.0';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Instantiable = {new(...args: any[]): any};

type KeysWithValueOfType<T,V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P } & keyof T;

type WidgetKeys = KeysWithValueOfType<typeof Gtk, typeof Gtk.Widget & Instantiable>

export type LowerWidgetKeys = Uncapitalize<WidgetKeys>

/**
 * Capitalizes the first letter of a string
 * 
 * @param {string} value The value to capitalize
 *
 * @return {string} The capitalized value
 */
function capitalize<T extends string>(value: T): Capitalize<T> {
    return value.charAt(0) + value.slice(1) as Capitalize<T>
}

const reconciler = {
    /**
     * Creates an element
     *
     * @param type A `camelCased` widget name
     */
    createElement(type: LowerWidgetKeys, props: Record<string, unknown> = {}) : Gtk.Widget {
        const widgetName = capitalize(type)

        if (!Gtk[widgetName]) {
            throw new TypeError(`Invalid widget: ${widgetName}`)
        }

        const widget = Gtk[widgetName]

        return new widget(props)
    }
}

reconciler.createElement("label")

export default reconciler
