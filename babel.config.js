module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    ['prismjs', {
      languages: ['javascript', 'jsx'],
      theme: 'twilight',
      css: false
    }]
  ]
};
