module.exports = {
  presets: [
    '@babel/preset-env',
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'classic',
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-polyfill-corejs3',
      {
        method: 'usage-global',
        version: require('core-js/package.json').version,
      },
    ],
    ['prismjs', {
      languages: ['javascript', 'jsx'],
      theme: 'twilight',
      css: false
    }]
  ]
};
