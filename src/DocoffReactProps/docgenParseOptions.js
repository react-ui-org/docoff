// This was taken from https://github.com/reactjs/react-docgen/blob/main/website/src/components/App.js
export const docgenParseOptions = {
    babelrc: false,
    babelrcRoots: false,
    filename: 'playground.js',
    configFile: false,
    parserOptions: {
        plugins: [
            'jsx',
            'asyncGenerators',
            'bigInt',
            'classProperties',
            'classPrivateProperties',
            'classPrivateMethods',
            ['decorators', { decoratorsBeforeExport: false }],
            'doExpressions',
            'dynamicImport',
            'exportDefaultFrom',
            'exportNamespaceFrom',
            'functionBind',
            'functionSent',
            'importMeta',
            'logicalAssignment',
            'nullishCoalescingOperator',
            'numericSeparator',
            'objectRestSpread',
            'optionalCatchBinding',
            'optionalChaining',
            ['pipelineOperator', { proposal: 'minimal' }],
            'throwExpressions',
            'topLevelAwait',
        ]
    }
};
