// Packages in `node_modules` that Babel must transform
const sourcePackages = [
  'min-indent',
  'react-docgen',
  'strip-indent',
];

/** @type {import('jest').Config} */
export default {
  transformIgnorePatterns: [
    `node_modules/(?!(${sourcePackages.join('|')})/)`,
  ],
};
