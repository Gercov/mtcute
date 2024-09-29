import { MtArgumentError } from '@mtcute/core'
import { dataViewFromBuffer } from '@mtcute/core/utils.js'
import { base64, utf8 } from '@fuman/utils'

import type { TelethonSession } from '../telethon/types.js'

export function parseGramjsSession(session: string): TelethonSession {
    if (session[0] !== '1') {
        // version
        throw new MtArgumentError(`Invalid session string (version = ${session[0]})`)
    }

    session = session.slice(1)

    const data = base64.decode(session)
    const dv = dataViewFromBuffer(data)

    const dcId = dv.getUint8(0)

    const ipSize = dv.getUint16(1)
    let pos = 3 + ipSize

    const ip = utf8.decoder.decode(data.subarray(3, pos))
    const port = dv.getUint16(pos)
    pos += 2
    const authKey = data.subarray(pos, pos + 256)

    return {
        dcId,
        ipAddress: ip,
        ipv6: ip.includes(':'), // dumb check but gramjs does this
        port,
        authKey,
    }
}
