import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import { terser } from 'rollup-plugin-terser';

const devMode = (process.env.NODE_ENV === 'development');
console.log(`${ devMode ? 'development' : 'production' } mode bundle`);

export default {
    input: 'script.js',
    output: {
        file: "script.bundle.js",
        format: 'cjs',
        sourcemap: true
    },
    plugins: [
        nodeResolve(),
        commonjs({
            include: /node_modules/,
            requireReturnsDefault: 'auto', // <---- this solves default issue
        }),
        terser({
            ecma: 2020,
            mangle: { toplevel: true },
            compress: {
                module: true,
                toplevel: true,
                unsafe_arrows: true,
                drop_console: !devMode,
                drop_debugger: !devMode
            },
            output: { quote_style: 1 }
        })
    ]
};