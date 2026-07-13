const { transformSync } = require('esbuild');

module.exports = {
    process(sourceText, sourcePath) {
        const { code, map } = transformSync(sourceText, {
            loader: 'js',
            format: 'cjs',
            target: 'node16',
            sourcefile: sourcePath,
            sourcemap: true
        });
        return { code, map };
    }
};
