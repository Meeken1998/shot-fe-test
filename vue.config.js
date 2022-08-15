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
            'primary-color': '#4f9346',
            'text-color': '#41464b',
            'font-size-base': '13px',
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
  pwa: {
    name: 'PPTist',
    themeColor: '#4f9346',
    iconPaths: {
      faviconSVG: null,
      favicon32: 'icons/favicon-32x32.png',
      favicon16: 'icons/favicon-16x16.png',
      appleTouchIcon: 'icons/apple-touch-icon-152x152.png',
      maskIcon: null,
      msTileImage: null,
    },
    manifestOptions: {
      name: 'PPTist',
      short_name: 'PPTist',
      theme_color: '#4f9346',
      icons: [{
        src: 'icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      }, {
        src: 'icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }, {
        src: 'icons/android-chrome-maskable-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      }, {
        src: 'icons/android-chrome-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }],
      start_url: '.',
      display: 'standalone',
      background_color: '#000000',
    },
    workboxOptions: {
      runtimeCaching: [{
        urlPattern: /.*/,
        handler: 'networkFirst',
        options: {
          cacheName: 'PPTist',
          expiration: {
            maxAgeSeconds: 60 * 60 * 10,
          },
          cacheableResponse: {
            statuses: [0, 200]
          }
        }
      }],
      include: [
        /\.ttf$/,
      ],
      skipWaiting: true,
    }
  },
}