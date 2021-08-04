import { objectWithoutProperties as _objectWithoutProperties } from '../../../../../_virtual/_rollupPluginBabelHelpers.js';
import Gtk from 'gi://Gtk?version=4.0';

var _excluded = ["children"];
/**
 * Capitalizes the first letter of a string
 *
 * @param   {string} value The value to capitalize
 *
 * @returns {string}       The capitalized value
 */

var capitalize = function capitalize(value) {
  return "".concat(value[0]).concat(value.slice(1));
};

var builder = new Gtk.Builder();
var reconciler = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  isPrimaryRenderer: true,

  /**
   * Creates an element
   *
   * @param type A `camelCased` widget name
   */
  createInstance: function createInstance(type) {
    var allProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var widgetName = capitalize(type);

    allProps.children;
        var props = _objectWithoutProperties(allProps, _excluded);

    if (!Gtk[widgetName]) {
      throw new TypeError("Invalid widget: ".concat(widgetName));
    }

    var WidgetClass = Gtk[widgetName];
    return new WidgetClass(props);
  },
  createTextInstance: function createTextInstance() {
    throw new Error('Text nodes are not supported - use a Gtk.Label instead, and check for whitespace / booleans in your JSX');
  },

  /**
   * Adds a child to a parent instance
   */
  appendInitialChild: function appendInitialChild(parentInstance, child) {
    parentInstance.vfunc_add_child(builder, child, null);
  },

  /**
   * Mutates an instance after the children are added, but before it is mounted
   * in the tree. Also if the return statement is `true`, a `commitMount` call
   * will be made later.
   *
   * We use this to determine if we need to perform layout modifications.
   */
  finalizeInitialChildren: function finalizeInitialChildren(instance, type, props, rootContainer, hostContext) {
    return false;
  },
  prepareUpdate: function prepareUpdate(instance, type, oldProps, newProps, rootContainer, hostContext) {
    return null;
  },
  shouldSetTextContent: function shouldSetTextContent(type, props) {
    return false;
  },
  getRootHostContext: function getRootHostContext(rootContainer) {
    return null;
  },
  getChildHostContext: function getChildHostContext(parentHostContext, type, rootContainer) {
    return null;
  },
  getPublicInstance: function getPublicInstance(instance) {
    return instance;
  },
  prepareForCommit: function prepareForCommit(containerInfo) {
    return null;
  },
  resetAfterCommit: function resetAfterCommit(containerInfo) {
    return null;
  },
  preparePortalMount: function preparePortalMount(containerInfo) {// no-op
  },
  now: function now() {
    // @TODO
    return 0;
  },
  scheduleTimeout: function scheduleTimeout(fn, delay) {
    // @TODO
    return -1;
  },
  cancelTimeout: function cancelTimeout(id) {// no-op
  },
  noTimeout: -1,

  /* Mutation methods */

  /**
   * Appends a child to the parent instance
   *
   * @todo I am having trouble being type safe on the `remove()` call, but also
   *   unsure how to "enforce" the idea that only a `Gtk.Box` etc. should have
   *   children. A `Gtk.Label` should not have children (even though it does
   *   actually seem to execute)
   */
  appendChild: function appendChild(parentInstance, child) {
    var parent = child.get_parent(); // Check if child is already attached - presumably React is re-ordering the children

    if (parent != null) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof parent.remove !== 'function') {
        throw new TypeError('Cannot remove child from parent');
      } // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parent.remove(child);
    }

    parentInstance.vfunc_add_child(builder, child, null);
  }
}; // reconciler.createInstance('label')

export { reconciler as default };
