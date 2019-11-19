#!/usr/bin/env node
import chalk from 'chalk'
import path from 'path'
import program from 'commander'
import { install, add, remove } from './core'

const packageJson = require('../package.json')

program.version(packageJson['version'])
  .command('install')
  .description('安装依赖(install packages)')
  .action(() => {
    const targetPackage = require(path.resolve(process.cwd(), './package.json'))
    install(targetPackage.dependencies)
  })

program.version(packageJson['version'])
  .command('add <pack...>')
  .description('添加依赖(add packages)')
  .action(pack => {
    add(pack)
  })

program.version(packageJson['version'])
  .command('remove <pack...>')
  .description('移除依赖(remove packages)')
  .action(pack => {
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
