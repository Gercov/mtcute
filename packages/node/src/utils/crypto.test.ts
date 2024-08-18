import { describe } from 'vitest'
import { testCryptoProvider } from '@mtcute/test'

if (import.meta.env.TEST_ENV === 'node') {
    describe('NodeCryptoProvider', async () => {
        const { NodeCryptoProvider } = await import('./crypto.js')

        testCryptoProvider(new NodeCryptoProvider())
    })
} else {
    describe.skip('NodeCryptoProvider', () => {})
}
