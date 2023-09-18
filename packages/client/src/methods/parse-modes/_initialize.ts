import { TelegramClient } from '../../client'
import { IMessageEntityParser } from '../../types'

// @extension
interface ParseModesExtension {
    _parseModes: Map<string, IMessageEntityParser>
    _defaultParseMode: string | null
}

// @initialize
function _initializeParseModes(this: TelegramClient) {
    this._parseModes = new Map()
    this._defaultParseMode = null
}

// since IMessageEntityParser is copied here, we don't need to
// worry about marking it with @copy anywhere else.
