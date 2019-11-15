#!/usr/bin/env node
import chalk from 'chalk'
import path from 'path'
import program from 'commander'
import * as packageJson from '../package.json'
import { install, add, remove } from './core'

program
.version(packageJson["version"])

program
.command('install')
.description('安装依赖(install packages)')
.action(() => {
  const targetPackage = require(path.resolve('package.json'))
  install(targetPackage.dependencies)
})

program
.command('add <pack...>')
.description('添加依赖(add packages)')
.action((pack) => {
  add(pack)
})

program
.command('remove <pack...>')
.description('移除依赖(remove packages)')
.action((pack) => {
  remove(pack)
})

// todo://添加新增包命令和操作
// .on('--help', function () {
//   console.log('')
//   console.log('    install    install packages')
//   console.log('    add        add package')
//   console.log('')
// })

program.parse(process.argv)

