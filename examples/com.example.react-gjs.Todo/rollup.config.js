import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

// const NODE_ENV = 'production';
const NODE_ENV = 'dev'

export default {
  input: 'index.tsx',
  external: id => /^gi:\/\//.test(id),
  output: {
    dir: 'dist',
    format: 'es',
    // exports: 'none',
    preserveModules: true,
  },
  // manualChunks(id) {
  //   if (id.includes('node_modules') || id.includes('packages')) {
  //     return 'vendor'
  //   }
  // },
  plugins: [
    replace({
      values: { 'process.env.NODE_ENV': JSON.stringify(NODE_ENV) },
      preventAssignment: true,
    }),
    nodePolyfills(),
    nodeResolve(),
    typescript(),
    commonjs({
      include: /node_modules/,
    }),
    babel({
      babelHelpers: 'bundled',
      // plugins: ['bare-import-rewrite'],
      presets: [
        '@babel/preset-env',
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
          },
        ],
      ],
    }),
  ],
}
