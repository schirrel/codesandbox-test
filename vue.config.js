const { defineConfig } = require('@vue/cli-service')

const ModuleFederationEnhancedPlugin = require('@schirrel/module-federation-enhanced-plugin/ModuleFederationEnhancedPlugin.js')

const dependencies = require('./package.json').dependencies

module.exports = defineConfig({
  publicPath: process.env.VUE_APP_URL,
  transpileDependencies: ['vuetify', 'd3'],
  filenameHashing: false,
  configureWebpack: {
    plugins: [
      new ModuleFederationEnhancedPlugin({
        name: 'flow',
        filename: 'remoteEntry.js',
        exposes: {
          './FlowTree': './src/components/FlowTree.vue',
          './FlowVuetifyConfig': './src/plugins/vuetify.js'
        },
        shared: {
          vue: {
            eager: true,
            singleton: true,
            requiredVersion: dependencies.vue
          },
          d3: {
            requiredVersion: dependencies.d3
          }
        }
      })
    ]
  },
  devServer: {
    port: process.env.PORT
  }
})
