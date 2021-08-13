# React GJS

> A React reconciler implementation for GTK-in-GJS

## What is it?

An experimental implementation of a React reconciler / renderer for GJS.

Instead of this:

```javascript
const box = new Gtk.Box()
const label = new Gtk.Label({ label: 'Hello, world!' })

box.append(label)
```

You can write:

```jsx
<box>
  <label label="Hello, world!" />
</box>
```

Most of the hard-work is powered a combination of GJS support for ES modules,
and the `react-reconciler` package. This repository is essentially a collection
of glue code to connect the reconciler internals to the GTK bindings exposed by
GJS.

### Again?

I know this has been tried before. The motivator here is:

(It's a fun challenge, obviously, but mainly...)

The recent ES module support in GJS has greatly simplified the need for arcane
Webpack configuration rules compared to last time I tried this. A Rollup ES6 in
<-> ES6 out build works so well that it feels fairly intuitive coming from web
dev land (all we need now is import maps or an opt-in resolver system so I don't
have to find plugins that emulate the node resolver algorithm 😁)

My longer-term hope is that this will work on Linux-powered phones with the
Phosh shell, but I'm still waiting for my hardware.

## Is it production-ready?

Currently? Absolutely not.

## How does it work?

There are two packages, managed as NPM workspaces in `packages/`.

- `@react-gjs/core` contains the reconciler implementation(s)
- `@react-gjs/polyfill` will eventually polyfill missing implementations of
  those functions defined by the
  [React Native JavaScript Environment](https://reactnative.dev/docs/javascript-environment),
  unless they get up-streamed

The `core` package contains a `reconciler/core.ts` implementation, which is
concerned _only_ with instantiating `<someElement>` (see the
[React docs](https://reactjs.org/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized))
into a `Gtk.SomeElement` and attaching it to the screen. The root container for
the reconciler is expected to be a `Gtk.ApplicationWindow`.

It (ab)uses the `Gtk.Buildable` interface to be able to consistently call
`vfunc_add_child`, similar to the web DOM approach of `appendChild`.

I am trying to avoid a wrapper class for every possible GTK widget. The biggest
stumbling block at the moment is that `Gtk.StackPage` doesn't seem to implement
`Buildable` - there are probably others. It can be made to work with refs, but
it's not the nicest syntax to look at.

Since it uses `react-reconciler`, all the hard work for user-defined class
components, refs, hooks, state, etc. is managed by the `react-reconciler`
package itself. We get it for free.

Some experimental approaches to mapping the JSX syntax to GTK are also present
in `reconciler/` as overrides that extend the Core reconciler.

A very basic `reconciler/renderless.ts` provides some overrides for more
GTK-like behaviour of supplying child elements that modify their parent (similar
to the GTK Builder XML approach). This seems to work fairly well for
`Gtk.LayoutChild` and signal handlers at present, should work for
`Gtk.CssProvider`, but might fall over with more complex GTK objects.

(Renderless might not be the best name for it)

A previous proof-of-concept had the concept of `x-` props, such as `x-style`,
`x-layout-child`, and so on. It may be revisited in a reconciler override, or it
may not - the logic got quite convoluted. It did result in "cleaner" JSX though.

### Sample App

There is an example app in `examples/com.example.react-gjs.Todo`. It uses
`rollup` to compile the typescript, and `babel` in combination with the
[`bare-import-rewrite`](https://github.com/cfware/babel-plugin-bare-import-rewrite/issues)
plugin to produce a build that is close to the original source code and can be
run with GJS (`gjs -m dist/(long-path)/index.js`).

## Getting Started

See also: the "What's Missing" section.

- `npm install`
- `npx tsc --build` build the core packages (add `--watch` for convenience)
- `cd examples/com.example.react-gjs.Todo && npx rollup -c rollup.config.js` to
  build the example app

The example app reproduces the source directory inside `dist/`, so it's:

```
$ cd examples/com.example.react-gjs.Todo
$ gjs -m dist/examples/com.example.react-gjs.Todo/index.js
```

## What's Missing?

So. Much. Stuff. 😅

- Sensible build tooling scripts
- `EventController`
- `CssProvider`
- `<lots-more>`
- Actual polyfills, the polyfill package just stops it crashing on
  `setTimeout is not defined`
- Guarantees about signals being disconnected properly on re-renders (seems to
  be OK at the moment, although I actually expected the handlers to double up on
  re-render :shrug:)
- Full type safety - I am new to TypeScript, but I have a feeling typing JS-to-C
  bindings would be difficult even if I wasn't
- Sensible memory usage guarantees
- Meson packaging
- Tested GResource support when packaged
- Script for running in broadway with livereload (I have this working elsewhere,
  need to bring it in)

## Can I help?

Absolutely yes please. File an issue with a suggestion on what I've done wrong
or how I could improve it. Or send me an email (`github` [at]
`craig.<the-website-tld-in-my-profile>`) Send a Pull Request. Maybe don't report
a bug though - I already know 90% of GTK doesn't work ;)

There is no CLA - there's no prospect of re-licensing this under
GPL/proprietary, what would be the use? All the dependent libraries are
MIT-compatible anyway, as far as I can tell.

There's no style guide, or issue template, or any kind of hard rule since it's
not functional yet.

## License

If I've missed (or left at default) a license field in any of the `package.json`
files, for clarity: this is all MIT licensed.

## Notes / Credits

This needs to be expanded:

- https://github.com/facebook/react/blob/master/packages/react-reconciler/README.md
- https://blog.atulr.com/react-custom-renderer-1/ - awesome help
