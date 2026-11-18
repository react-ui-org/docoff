/** @typedef {import('webpack').Configuration['module']} WebpackModuleConfig */

/**
 * @returns {WebpackModuleConfig}
 */
export const moduleConfig = () => ({
  rules: [
    {
      exclude: /node_modules/,
      test: /\.(js|jsx)$/,
      use: [{ loader: 'babel-loader' }],
    },
    {
      test: /\.css$/i,
      use: [
        { loader: 'style-loader' },
        { loader: 'css-loader' },
      ],
    },
  ],
});
