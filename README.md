# React GJS

> A React reconciler implementation for GTK-in-GJS

## What is it?

An implementation of the React reconciler for GJS, which means you can write
React components for your GTK UI, all in pure GJS (some transpilation
necessary).

Instead of this:

```
const box = new Gtk.Box();
const label = new Gtk.Label({ label: 'Hello, world!' });

box.append(label);
```

You can write:

```jsx
<box>
  <label label="Hello, world!" />
</box>
```

Obviously React is more than just its JSX syntax - since we re-use the
`react-reconciler` package, all of the behaviour you expect in custom
components - like `componentDidMount` etc. - also works.

## Is it production-ready?

Sadly, absolutely not.

## How does it work?

(This section needs cleaning up)

