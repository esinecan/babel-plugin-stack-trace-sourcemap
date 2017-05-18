/**
 * add `import { install as _sourceMapSupport } from 'source-map-support';`
 * then call `_sourceMapSupport();`
 *
 * it equivalents to call `require('source-map-support/register');`,
 * but babel 6 `addImport` doesn't support it.
 *
 * @param t
 * @returns {{visitor: {Program: (function(*, *))}}}
 */

const defaultImports = [
    'source-map-support',
    'install',
    '_sourceMapSupport'
];
export default ({ types: t }) => {
    if (process.env.__BABEL_RUN_ENV__ !== 'register') {
        return {
            visitor: {
                Program(path, state) {
                    let importArgs = state.opts.importOverride || defaultImports;
                    let id = state.addImport(...importArgs);

                    if (!('execute' in state.opts) || state.opts.execute) {  // Default is true to execute
                        path.traverse({
                            ImportDeclaration(path) {
                                if (path.node.source.value === 'source-map-support') {
                                    path.insertAfter(t.ExpressionStatement(t.CallExpression(t.identifier(importArgs[importArgs.length - 1]), [])));
                                }
                            }
                        });
                    }
                }
            }
        };
    } else {
        return {};
    }
};
