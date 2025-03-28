import type { Message } from '../types/messages/index.js'

import type { BusinessMessage, ParsedUpdate } from '../types/updates/index.js'
import type { RawUpdateInfo } from './types.js'
import { timers } from '@fuman/utils'

import { _parseUpdate } from '../types/updates/parse-update.js'

export interface ParsedUpdateHandlerParams {
    /**
     * When non-zero, allows the library to automatically handle Telegram
     * media groups (e.g. albums) in {@link MessageGroup} updates
     * in a given time interval (in ms).
     *
     * > **Note**: this does not catch messages that happen to be consecutive,
     * > only messages belonging to the same "media group".
     *
     * This will cause up to `messageGroupingInterval` delay
     * in handling media group messages.
     *
     * This option only applies to `new_message` updates,
     * and the updates being grouped **will not** be dispatched on their own.
     *
     * Recommended value is 250 ms.
     *
     * @default  0 (disabled)
     */
    messageGroupingInterval?: number

    /** Handler for parsed updates */
    onUpdate: (update: ParsedUpdate) => void
}

export function makeParsedUpdateHandler(params: ParsedUpdateHandlerParams): (update: RawUpdateInfo) => void {
    const { messageGroupingInterval, onUpdate } = params

    if (!messageGroupingInterval) {
        return (info) => {
            const parsed = _parseUpdate(info)

            if (parsed) onUpdate(parsed)
        }
    }

    const pending = new Map<string, [Message[], timers.Timer]>()

    return (info) => {
        const parsed = _parseUpdate(info)

        if (parsed) {
            if (parsed.name === 'new_message' || parsed.name === 'new_business_message') {
                const group = parsed.data.groupedIdUnique

                if (group) {
                    const isBusiness = parsed.name === 'new_business_message'
                    const pendingGroup = pending.get(group)

                    if (pendingGroup) {
                        pendingGroup[0].push(parsed.data)
                    } else {
                        const messages = [parsed.data]
                        const timeout = timers.setTimeout(() => {
                            pending.delete(group)

                            if (isBusiness) {
                                onUpdate({ name: 'business_message_group', data: messages as BusinessMessage[] })
                            } else {
                                onUpdate({ name: 'message_group', data: messages })
                            }
                        }, messageGroupingInterval)

                        pending.set(group, [messages, timeout])
                    }

                    return
                }
            }

            onUpdate(parsed)
        }
    }
}
