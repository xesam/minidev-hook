const { defineConfig } = require('tsup');

// src/index.js 是标准 ES6 (import/export)。两个目标都 bundle: true 并把
// object-hook 强制内联（noExternal），保证 ESM 和 CJS 产物都是零外部依赖的
// 单文件，Node/npm 与小程序 npm 构建可以直接共用。
module.exports = defineConfig([
    {
        entry: ['src/index.js'],
        format: ['esm'],
        outDir: 'dist/esm',
        splitting: false,
        sourcemap: true,
        clean: false,
        bundle: true,
        noExternal: ['object-hook'],
        outExtension() {
            return { js: '.js' };
        },
        esbuildOptions(options) {
            options.outbase = 'src';
            options.platform = 'neutral';
        }
    },
    {
        entry: ['src/index.js'],
        format: ['cjs'],
        outDir: 'dist',
        splitting: false,
        sourcemap: true,
        clean: false,
        bundle: true,
        noExternal: ['object-hook'],
        shims: true,
        outExtension() {
            return { js: '.js' };
        },
        esbuildOptions(options) {
            options.outbase = 'src';
            options.platform = 'neutral';
        }
    }
]);
