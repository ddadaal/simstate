//import typescript from 'typescript';
import typescript from 'rollup-plugin-typescript2';
//import serve from 'rollup-plugin-serve';
//import livereload from 'rollup-plugin-livereload';
import minify from 'rollup-plugin-babel-minify';

import pkg from "./package.json";

const dev = 'development';
const prod = 'production';
const env = (process.env.NODE_ENV === prod || process.env.NODE_ENV === dev) ? process.env.NODE_ENV : dev;

const plugins = [
  typescript()
];

if (env === prod) {
  plugins.push(minify({
    comments: false,
  }));
}

export default {
  plugins,
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  input: './src/index.ts',
  output: [{
    sourcemap: true,
    file: pkg.main,
    format: 'cjs'
  }, {
    sourcemap: true,
    file: pkg.module,
    format: "es",
  }
  ]
};
