#!/usr/bin/env node
import chalk from 'chalk'
import program from 'commander'
import * as packageJson from '../package.json'
import downloadPacks from './download-packs'

program
.version(packageJson["version"])
.command('install').action(() => {
  downloadPacks(packageJson.dependencies as any)
})
// todo://添加新增包命令和操作
program.on('--help', function () {
  console.log('')
  console.log('    install    install packages')
  console.log('    add        add package')
  console.log('')
})

program.parse(process.argv)

