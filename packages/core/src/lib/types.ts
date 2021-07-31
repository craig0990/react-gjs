import type Gtk from 'gi://Gtk?version=4.0';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Instantiable = {new(...args: any[]): any};

type KeysWithValueOfType<T,V> = keyof { [ P in keyof T as T[P] extends V ? P : never ] : P } & keyof T;

type WidgetKeys = KeysWithValueOfType<typeof Gtk, typeof Gtk.Widget & Instantiable>

export type LowerWidgetKeys = Uncapitalize<WidgetKeys>
