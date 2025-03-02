import type { ViteUserConfig } from 'vitest/config'
import { defineConfig } from 'vitest/config'

// https://github.com/oven-sh/bun/issues/4145#issuecomment-2551246135
let runtime = 'node'
if ('bun' in process.versions) runtime = 'bun'
if ('deno' in process.versions) runtime = 'deno'

const poolOptions: ViteUserConfig['test'] = runtime === 'node'
    ? {
        pool: 'threads',
        poolOptions: {
            threads: {
                singleThread: true,
                minThreads: 2,
                maxThreads: 10,
            },
        },
    }
    : {
        pool: 'vitest-in-process-pool',
        coverage: {
            enabled: false,
        },
        reporters: [['default', { summary: false }]],
    }

export default defineConfig({
    test: {
        include: [
            'packages/**/*.test.ts',
        ],
        typecheck: {
            include: [
                'packages/**/*.test-d.ts',
            ],
        },
        coverage: {
            include: [
                'packages/**/*.ts',
            ],
            exclude: [
                'packages/**/index.ts',
            ],
        },
        setupFiles: [
            './.config/vite-utils/test-setup.ts',
        ],
        ...poolOptions,
    },
    esbuild: {
        target: 'esnext',
    },
    define: {
        'import.meta.env.TEST_ENV': JSON.stringify(runtime),
    },
})
