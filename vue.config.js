/* eslint-disable @typescript-eslint/no-var-requires */

const StyleLintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  devServer: {
    port: 8080,
    proxy: {
      '/api/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/csharp/': {
        target: 'http://ppt-loader.aside.fun',
        changeOrigin: true,
        pathRewrite: {
          '^/csharp': '/api'
        }
      },
    },
  },
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '~@/assets/styles/variable.scss';
          @import '~@/assets/styles/mixin.scss';
        `,
      },
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#469D8F',
            'text-color': '#41464b',
            'font-size-base': '14px',
            'border-radius-base': '6px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new StyleLintPlugin({
        files: ['src/**/*.{vue,html,css,scss,sass,less}'],
        failOnError: false,
        cache: false,
        fix: false,
      }),

    ],
  },
  chainWebpack(config) {
    // set worker-loader
    config.module
      .rule('worker')
      .test(/\.workers\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end()

    // 解决：worker 热更新问题
    config.module.rule('js').exclude.add(/\.workers\.js$/)
    // config.module.rule('js').use('remove-hashbag-loader').loader('remove-hashbag-loader')
  },
  parallel: false,
  pwa: {
    name: 'PPTist',
    themeColor: '#469D8F',
    iconPaths: {
      faviconSVG: null,
      favicon32: 'https://static.aside.fun/upload/favicon-32x32.png',
      favicon16: 'https://static.aside.fun/upload/favicon-16x16.png',
      appleTouchIcon: 'https://static.aside.fun/upload/apple-touch-icon-152x152.png',
      maskIcon: null,
      msTileImage: null
    },
    manifestOptions: {
      name: 'PPTist',
      short_name: 'PPTist',
      theme_color: '#469D8F',
      icons: [
        {
          src: 'icons/favicon.png',
          sizes: '64x64',
          type: 'image/png',
        },
      ],
      start_url: '.',
      display: 'standalone',
      background_color: '#000000',
    },
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: /.*/,
          handler: 'networkFirst',
          options: {
            cacheName: 'PPTist',
            expiration: {
              maxAgeSeconds: 60 * 60 * 10,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
      include: [/\.ttf$/],
      skipWaiting: true,
    },
  },
}
