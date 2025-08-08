import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
    return {
        base: `https://cdn.nav.no/arbeidsforhold/aareg-innsyn-arbeidsgiver/build/${mode}`,
        plugins: [
            tsconfigPaths(),
            react(),
            legacy({
                modernPolyfills: ['es.string.replace', 'esnext.string.replace-all'],
                polyfills: ['es.string.replace', 'esnext.string.replace-all'],
            }),
        ],
        optimizeDeps: {
            exclude: ['js-big-decimal'],
        },
        define: {
            __BUILD_TIMESTAMP__: new Date(),
            __BASE_PATH__: JSON.stringify('/arbeidsforhold'),
        },
        build: {
            outDir: `build/${mode}`,
            sourcemap: true,
        },
        server: {
            port: 3000,
            proxy: {
                // config map for proxy reqs during local development
            },
        },
    };
});
