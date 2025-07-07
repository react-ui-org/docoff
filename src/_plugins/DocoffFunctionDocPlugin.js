const { processDocoffFunctionDoc } = require('../../scripts/processDocoffFunctionDoc');

/**
 * Webpack plugin that processes docoff-function-doc elements during build
 */
class DocoffFunctionDocPlugin {
  constructor(options = {}) {
    this.options = {
      htmlPattern: options.htmlPattern || '**/*.html',
      outputDir: options.outputDir || 'public',
      sourceDir: options.sourceDir || 'public',
      ...options,
    };
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('DocoffFunctionDocPlugin', async (compilation, callback) => {
      try {
        await processDocoffFunctionDoc(this.options);
        callback();
      } catch (error) {
        callback(error);
      }
    });
  }
}

module.exports = DocoffFunctionDocPlugin;
