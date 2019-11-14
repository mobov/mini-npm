#!/usr/bin/env node
import * as chalk from 'chalk'
import * as program from 'commander'
import * as packageJson from '../package.json'
import downloadPacks from './download-packs'


downloadPacks(packageJson.dependencies as any)

// console.log(packageJson)
// program
// .version('0.0.1')
// .commnad()

