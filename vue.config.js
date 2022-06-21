const path = require('path');
const { defineConfig } = require('@vue/cli-service');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '',
  lintOnSave: false,
  outputDir: 'lib',
  filenameHashing: false,
  assetsDir: 'static',
  productionSourceMap: false
  // chainWebpack: config => {
  //   // 移除 prefetch 插件
  //   config.plugins.delete('prefetch-index');
  //   // 移除 preload 插件
  //   config.plugins.delete('preload-index');
  // },
  // configureWebpack: {
  //   externals: {
  //     vue: 'Vue'
  //   },
  //   resolve: {
  //     alias: {
  //       '@': resolve('src')
  //     }
  //   },
  //   entry: {
  //     main: resolve('src/index.ts')
  //   },
  //   output: {
  //     filename: `gantt-vue2.min.js`,
  //     library: 'gantt-vue2',
  //     libraryTarget: 'umd',
  //     umdNamedDefine: true
  //   }
  // }
});
