const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const path = require('path')

module.exports = webpackConfig => {
  const svgSpriteDirs = [
    require.resolve('antd').replace(/warn\.js$/, ''), // antd 内置svg，
    // 业务代码本地私有 svg 存放目录path.resolve(__dirname, 'src/my-project-svg-foler'),
    path.resolve(__dirname, 'src/public/svg'),
  ]

  webpackConfig.module.rules.forEach(item => {
    if (String(item.loader).indexOf('url-loader') > -1) {
      item.exclude.push(/\.svg$/)
    }
  })

  webpackConfig.module.rules.unshift({
    test: /\.svg$/,
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
        },
      },
    ],
    include: svgSpriteDirs,
  })

  webpackConfig.plugins = webpackConfig.plugins.concat([
    new SpriteLoaderPlugin(),
  ])

  return webpackConfig
}