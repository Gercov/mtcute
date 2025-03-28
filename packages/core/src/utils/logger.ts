import type { ICorePlatform } from '../types/platform.js'
import { hex } from '@fuman/utils'

import { tl } from '@mtcute/tl'

import { isTlRpcError } from './type-assertions.js'

const DEFAULT_LOG_LEVEL = 2
const FORMATTER_RE = /%[a-z]/gi

// <deno-insert>
// declare const Buffer: typeof import('node:buffer').Buffer
// </deno-insert>

/**
 * Logger created by {@link LogManager}
 */
export class Logger {
    private color: number

    prefix = ''

    constructor(
        readonly mgr: LogManager,
        readonly tag: string,
        readonly parent: Logger = mgr,
    ) {
        let hash = 0

        for (let i = 0; i < tag.length; i++) {
            hash = (hash << 5) - hash + tag.charCodeAt(i)
            hash |= 0 // convert to 32bit int
        }

        this.color = Math.abs(hash) % 6
    }

    getPrefix(): string {
        let s = ''

        // eslint-disable-next-line ts/no-this-alias
        let obj: Logger | undefined = this

        while (obj) {
            if (obj.prefix) s = obj.prefix + s
            obj = obj.parent
        }

        return s
    }

    log(level: number, fmt: string, ...args: unknown[]): void {
        if (level > this.mgr.level) return
        if (!this.mgr['_filter'](this.tag)) return

        // custom formatters
        if (
            fmt.includes('%h')
            || fmt.includes('%b')
            || fmt.includes('%j')
            || fmt.includes('%J')
            || fmt.includes('%l')
            || fmt.includes('%L')
            || fmt.includes('%e')
        ) {
            let idx = 0
            fmt = fmt.replace(FORMATTER_RE, (m) => {
                if (m === '%h' || m === '%b' || m === '%j' || m === '%J' || m === '%l' || m === '%L' || m === '%e') {
                    let val = args[idx]

                    args.splice(idx, 1)

                    if (m === '%h') {
                        if (ArrayBuffer.isView(val)) return hex.encode(val as Uint8Array)
                        if (typeof val === 'number' || typeof val === 'bigint') return val.toString(16)

                        return String(val)
                    }
                    if (m === '%b') return String(Boolean(val))

                    if (m === '%j' || m === '%J') {
                        if (m === '%J') {
                            val = [...(val as IterableIterator<unknown>)]
                        }

                        return JSON.stringify(val, (k, v) => {
                            if (
                                ArrayBuffer.isView(v)
                                || (typeof v === 'object' && v.type === 'Buffer' && Array.isArray(v.data)) // todo: how can we do this better?
                            ) {
                                // eslint-disable-next-line
                                let str = v.data ? Buffer.from(v.data as number[]).toString('hex') : hex.encode(v)

                                if (str.length > 300) {
                                    str = `${str.slice(0, 300)}...`
                                }

                                return str
                            }

                            // eslint-disable-next-line ts/no-unsafe-return
                            return v
                        })
                    }
                    if (m === '%l') return String(val)

                    if (m === '%L') {
                        if (!Array.isArray(val)) return 'n/a'

                        return `[${(val as unknown[]).map(String).join(', ')}]`
                    }

                    if (m === '%e') {
                        if (isTlRpcError(val)) {
                            return `${val.errorCode} ${val.errorMessage}`
                        }

                        if (tl.RpcError.is(val)) {
                            return `${val.code} ${val.text}`
                        }

                        return val && typeof val === 'object' ? (val as Error).stack || (val as Error).message : String(val)
                    }
                }

                idx++

                return m
            })
        }

        this.mgr.handler(this.color, level, this.tag, this.getPrefix() + fmt, args)
    }

    readonly error: (fmt: string, ...args: unknown[]) => void = this.log.bind(this, LogManager.ERROR)
    readonly warn: (fmt: string, ...args: unknown[]) => void = this.log.bind(this, LogManager.WARN)
    readonly info: (fmt: string, ...args: unknown[]) => void = this.log.bind(this, LogManager.INFO)
    readonly debug: (fmt: string, ...args: unknown[]) => void = this.log.bind(this, LogManager.DEBUG)
    readonly verbose: (fmt: string, ...args: unknown[]) => void = this.log.bind(this, LogManager.VERBOSE)

    /**
     * Create a {@link Logger} with the given tag
     * from the same {@link LogManager} as the current
     * Logger.
     *
     * @param tag  Logger tag
     */
    create(tag: string): Logger {
        return new Logger(this.mgr, tag, this)
    }
}

const defaultFilter = () => true

/**
 * Log manager. A logger that allows managing child loggers
 */
export class LogManager extends Logger {
    static OFF = 0
    static ERROR = 1
    static WARN = 2
    static INFO = 3
    static DEBUG = 4
    static VERBOSE = 5

    level: number
    handler: (color: number, level: number, tag: string, fmt: string, args: unknown[]) => void

    constructor(tag = 'base', platform: ICorePlatform) {
        // workaround because we cant pass this to super
        // eslint-disable-next-line ts/no-unsafe-argument
        super(null as any, tag)
        ;(this as any).mgr = this

        this.level = platform.getDefaultLogLevel() ?? DEFAULT_LOG_LEVEL
        this.handler = platform.log.bind(platform)
    }

    private _filter: (tag: string) => boolean = defaultFilter

    /**
     * Create a {@link Logger} with the given tag
     *
     * @param tag  Logger tag
     */
    override create(tag: string): Logger {
        return new Logger(this, tag)
    }

    /**
     * Filter logging by tags.
     *
     * @param cb
     */
    filter(cb: ((tag: string) => boolean) | null): void {
        this._filter = cb ?? defaultFilter
    }
}
