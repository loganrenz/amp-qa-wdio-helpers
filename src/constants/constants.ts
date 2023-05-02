import path from 'path'
import fs from 'fs'
import appRoot from 'app-root-path'
import {glob, globSync} from 'glob'

export const pause = async (timeout: number = 1000 * 30) => {
  return await new Promise(resolve => setTimeout(() => resolve(true), timeout))
}

export const Seconds = (num: number) => num * 1000
export const Minutes = (num: number) => num * 1000 * 60
export const Hours = (num: number) => num * 1000 * 60 * 60

export const ROOT_DIR = appRoot.path  
export const dirExists = (dir: string) => fs.existsSync(dir)
export const resultsDir = path.join(ROOT_DIR, 'results')

export const rnd = (max: number) => Math.floor(Math.random() * max)

export const shuffleArray = (array: unknown[]) =>
  array.sort(() => Math.random() - 0.5)

export const PLAYER_STATE = {
  PLAYING: 'PLAYING',
  IDLE: 'IDLE',
  BUFFERING: 'BUFFERING',
  PAUSED: 'PAUSED',
}

export const CMAEvents = {
  PLAYER_STATE_CHANGED: 'PLAYER_STATE_CHANGED',
  ITEM_CHANGED: 'ITEM_CHANGED',
  CURRENT_TIME_CHANGED: 'CURRENT_TIME_CHANGED',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
}

export type CMAPlayerStateChangedEvent = {
  old_state: string
  new_state: string
}

export class SpecFileEnumCreator {
  files: string[] = []
  globber: string = 'test/specs/**/*.spec.ts'
  splitter: string | undefined

  constructor(globber: string, splitter?: string) {
    this.globber = globber
    this.files = globSync(this.globber)
    this.splitter = splitter
  }

  get longestStringLength() { return this.files.map(f => this.propName(f,0)).reduce((a, b) => a.length > b.length ? a : b, ).length }

  propName(file: string, padEnd: number) {
    const splitFileName = this.splitter ? file.split(this.splitter)[1] : file
    const p = splitFileName
        .replace(/\//g, '_SLASH_')
        .replace(/\-/g, '_')
        .replace(/\.spec\.ts/g, '')
        .toUpperCase()
        .padEnd(padEnd, ' ')
    return p
  }

  toString() {
    const padding = this.longestStringLength
    const output = 'export enum SpecFiles { \n' + this.files.map(file => `\t${this.propName(file, padding)} = "${file}"`).join(',\n') + '\n' + '}'
    return output
  }

  writeToFile(outputPath: string) {
    fs.writeFileSync(outputPath, this.toString(), 'utf8')
  }
}
