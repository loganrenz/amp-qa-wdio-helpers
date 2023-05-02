import wdioLogger, { Logger } from '@wdio/logger'
import chalk from 'chalk'
import prefix from 'loglevel-plugin-prefix'

const colors = {
    TRACE: chalk.magenta,
    DEBUG: chalk.cyan,
    INFO: chalk.blue,
    WARN: chalk.yellow,
    ERROR: chalk.red
}

/** https://www.npmjs.com/package/loglevel-plugin-prefix
 *  %l - level of message
    %n - name of logger
    %t - timestamp of message
 */

export class WithLogging {
    _logger?: Logger = undefined

    timestampFormatters = {
        localeTimeString: (date: Date) => date.toLocaleTimeString(),
        isoString: (date: Date) => date.toISOString()
    }

    levelFormatters = {
        default: (level: string) => colors[level.toUpperCase() as keyof typeof colors](level)
    }

    nameFormatters = {
        default: (name: string | undefined) => colors['TRACE'](name || 'unknown')
    }


    get logger() {
        if (this._logger) {
            return this._logger
        } else {
            const newLogger = wdioLogger(this.constructor.name)
            prefix.apply(newLogger, {
                timestampFormatter: this.timestampFormatters.localeTimeString,
                levelFormatter: this.levelFormatters.default,
                nameFormatter: this.nameFormatters.default,
            })
            newLogger.setLevel('debug')
            return newLogger
        }
    }
}
