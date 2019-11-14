import * as fs from 'fs'
import config from './config'
import compressing from 'compressing'
import chalk from 'chalk'
import path, { format } from 'path'
import shell from 'shelljs'

interface Dependencies {
  [pack: string]: string
}
interface PackInfo {
  name: string
  version: string
  dist: {
    tarball: string
  }
}

const resolveVersion = (version: string): string => {
  if (version.indexOf('^') !== -1) {
    version = version.substring(1, version.length)
  }
  return version
}

/**
 * 获取包信息
 * @param name 包名
 * @param version 包版本
 */
const getPackInfo = (name: string, version: string): Promise<PackInfo> => {
  const getTarball = (str: string): string => {
    const regex = new RegExp(/tarball: '(.*?)'/, 'g')
    const arr = str.match(regex)
    const result = arr[0].substring(10, arr[0].length - 1)
    console.log(result)
    return result
  }
  return new Promise((resolve, reject) => {
    let result: any = { name, version, dist: {} }
    shell.exec(`npm view ${name}@${resolveVersion(version)}`, { silent: true }, (code, data) => {
      result.dist.tarball = getTarball(data)
      if (code === 0) {
        resolve(result)
      } else {
        reject()
      }
    })
  })
}

/**
 * 解压包
 * @param name 包名
 * @param version 包版本
 */
const unzipPack = (name: string, version: string) => {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(`./${name}-${version}.tgz`)
    shell.rm('-rf', `${name}/*`)
    compressing.tgz
    .uncompress(filePath, name)
    .then(res => {
      // todo: 展开下载包
      shell.mv('-f', `${name}/package/*`, `${name}`)
      shell.rm('-rf', `${name}/package`)
      shell.rm('-rf', filePath)
      console.log(chalk.green(`install ${name} success!`))
      resolve()
    }).catch(err => {
      console.log(chalk.red(`install ${name} fail!`))
      reject()
    })
  })
}

/**
 * 下载包
 * @param name 包名
 * @param version 包版本
 */
const downloadPack = (name: string, version: string) => {
  return new Promise(async (resolve, reject) => {
    const packageJsonPath = `./${name}/package.json`

    const handleDowload = () => {
      shell.exec(`npm pack ${name}@${resolveVersion(version)}`, { silent: true }, (code, data) => {
        if (code === 0) {
          resolve('downloaded')
        } else {
          reject()
        }
      })
    }
    if (fs.existsSync(name)) {
      shell.mkdir('-p', name)
    }
    // 判断是否存在
    if (fs.existsSync(packageJsonPath)) {
      let sourcePackage: any  = fs.readFileSync(packageJsonPath)
      sourcePackage = JSON.parse(sourcePackage)
      // 判断是否需要更新
      if (resolveVersion(sourcePackage.version) === version) {
        console.log(`module ${name} exist!`)
        resolve('exist')
      } else {
        handleDowload ()
      }    
    } else {
      handleDowload ()
    }
  })
}

/**
 * 任务管道
 * @param name 包名
 * @param version 包版本
 */
const handleTask = (name: string, version: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      let status = await downloadPack(name, version)
      if (status === 'downloaded') {
        status = await unzipPack(name, version)
      }
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

export default function (list: Dependencies) {
  const listMap = Object.keys(list)
  if (listMap.length > 0) {
    shell.mkdir('-p', path.resolve(config.output))
    shell.cd(path.resolve(config.output))
  }
  return Promise.all(listMap.map(x => handleTask(x, resolveVersion(list[x])))).then(res => {
    console.log(chalk.green(`mini-npm success!`))
    return res
  })
}