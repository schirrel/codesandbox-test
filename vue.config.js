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
        name: 'pluginFlow',
        filename: 'remoteEntry.js',
        exposes: {
          './FlowTree': './src/components/shared/FlowTree.vue',
          './FlowVuetifyConfig': './src/plugins/shared/vuetify.js'
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
    ],
    module: {
      rules: [
        {
          test: /\.coffee$/,
          use: [
            {
              loader: 'coffee-loader',
              options: { sourceMap: true }
            }
          ]
        }
      ]
      // rules: [
      //   {
      //     test: /\.coffee$/,
      //     loader: 'coffee-loader',
      //     options: {
      //       bare: false,
      //       transpile: {
      //         presets: ['@babel/env']
      //       }
      //     }
      //   }
      // ]
    }
  },
  devServer: {
    port: process.env.PORT
  }
})
