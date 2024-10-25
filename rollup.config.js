const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

module.exports = {
  input: 'dist/index.js',
  plugins: [
    peerDepsExternal(),
    nodeResolve(),
    commonjs(),
  ],
  external: ['react', 'react-dom']
};
