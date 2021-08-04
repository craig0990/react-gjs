import Reconciler from '../../../../node_modules/react-reconciler/index.js';
import reconciler from './reconciler/base.js';
export { default as BaseReconciler } from './reconciler/base.js';

/**
 * Provides the core React renderer logic and provides several implementations
 *
 * - {@link BaseReconciler} - the bare minimum
 *
 * @module
 */
Reconciler(reconciler);
/**
 * Render function using BasicReconciler by default
 */

var render = function render(element, container) {// @TODO
};

export { render };
