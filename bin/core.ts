import * as fs from 'fs'
import config from './config'
import compressing from 'compressing'
import chalk from 'chalk'
import path, { format } from 'path'
import shell from 'shelljs'
import listr from 'listr'

const packageJson = require(path.resolve('package.json'))

type PackItem = Array<string>

interface Dependencies {
  [pack: string]: string
}
interface PackInfo {
  name: string
  version: string
}

type PackLists = Array<PackInfo>

const resolveTgzName = (name: string, version: string): string => {
  name = name.replace(/@/g, '').replace(/\//, '-')
  return `${name}-${version}.tgz`
}

const resolveVersion = (version: string): string => {
  if (version.indexOf('^') !== -1) {
    version = version.substring(1, version.length)
  }
  return version
}

const getPackLists = (data: PackItem | Dependencies): PackLists => {
  let result:PackLists = []
  if (data instanceof Array) {
    result = data.map(x => {
      let name = x
      let version = ''
      const splitIndex = x.lastIndexOf('@')
      if (splitIndex > 0) {
        name = x.substr(0, splitIndex)
        version = x.substr(splitIndex + 1, x.length)
      }

      return {
        name,
        version
      }
    })
  } else {
    result = Object.keys(data).map((x) => ({
      name: x,
      version: resolveVersion(data[x])
    }))
  }
  return result
}

/**
 * 获取包最新版本
 * @param name 包名
 */
const getPackLastVersion = (name: string): Promise<string> => {
  // const getTarball = (str: string): string => {
  //   const regex = new RegExp(/tarball: '(.*?)'/, 'g')
  //   const arr = str.match(regex)
  //   const result = arr[0].substring(10, arr[0].length - 1)
  //   console.log(result)
  //   return result
  // }
  const getVersion = (str: string): string => {
    const regex = new RegExp(/version: '(.*?)'/, 'g')
    const arr = str.match(regex)
    const result = arr[0].substring(10, arr[0].length - 1)
    return result
  }
  return new Promise((resolve, reject) => {
    shell.exec(`npm view ${name}`, { silent: true }, (code, data) => {
    
      if (code === 0) {
        const version = getVersion(data)
        resolve(version)
      } else {
        reject()
      }
    })
  })
}

/**
 * 写入包依赖
 * @param name 包名
 * @param version 包版本
 */
const writeDependencie = (name: string, version: string) => {
  if (
      packageJson.dependencies[name] &&
      packageJson.dependencies[name] === `^${version}`
    ) {
    return
  } else {
    packageJson.dependencies[name] = `^${version}`
    fs.writeFileSync('../package.json', JSON.stringify(packageJson, null, 4))
  }
}

/**
 * 解压包
 * @param name 包名
 * @param version 包版本
 */
const unzipPack = (name: string, version: string) => {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(`./${resolveTgzName(name, version)}`)
    shell.rm('-rf', `${name}/*`)
    compressing.tgz
    .uncompress(filePath, name)
    .then(res => {
      shell.mv('-f', `${name}/package/*`, `${name}`)
      shell.rm('-rf', `${name}/package`)
      shell.rm('-rf', filePath)
      resolve('unziped')
    }).catch(err => {
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
      shell.exec(`npm pack ${name}@${version}`, { silent: true }, (code, data) => {
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
      let sourcePackage: any = fs.readFileSync(packageJsonPath)
      sourcePackage = JSON.parse(sourcePackage)
      // 判断是否需要更新
      if (resolveVersion(sourcePackage.version) === version) {
        resolve('exist')
      } else {
        handleDowload()
      }    
    } else {
      handleDowload()
    }
  })
}

/**
 * 添加任务管道
 * @param name 包名
 * @param version 包版本
 */
const handleAdd = (name: string, version: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!version) {
        version = await getPackLastVersion(name)
      }
    
      let status = await downloadPack(name, version)
 
      if (status === 'downloaded') {
        status = await unzipPack(name, version)
      }
      writeDependencie(name, version)
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}

const handleRemove = (name: string) => {
  return new Promise(async (resolve, reject) => {
    shell.rm('-rf', `${name}`)
    if (packageJson.dependencies[name]) {
      delete packageJson.dependencies[name]
    }
  
    fs.writeFileSync('../package.json', JSON.stringify(packageJson, null, 4))
    resolve()
  })
}

/**
 * 安装
 * @param list 依赖
 */
export function install (list: Dependencies): Promise<any> {
  const packLists = getPackLists(list)
  if (packLists.length > 0) {
    shell.mkdir('-p', path.resolve(config.output))
    shell.cd(path.resolve(config.output))
  } else {
    return
  }
  const tasks = new listr(
    packLists.map((x) => {
      return {
        title: `install ${x.name}`,
        task: () => handleAdd(x.name, x.version)
      }
    })
  )
  return tasks.run().then(() => {
    console.log(`  `)
    console.log(`   mini-npm run success!`)
  }).catch((err: any) => {
    console.error(err)
  })
  // return Promise.all(listMap.map(async (x) => await handleAdd(x, resolveVersion(list[x])))).then(res => {
  //   console.log(`mini-npm run success!`)
  //   return res
  // })
}

/**
 * 添加
 * @param name 
 */
export function add (list: PackItem): Promise<any> {
  const packLists = getPackLists(list)
  if (packLists.length > 0) {
    shell.mkdir('-p', path.resolve(config.output))
    shell.cd(path.resolve(config.output))
  } else {
    return
  }

  const tasks = new listr(
    packLists.map((x) => {
      return {
        title: `install ${x.name}`,
        task: () => handleAdd(x.name, x.version)
      }
    })
  )
  return tasks.run().then(() => {
    console.log(`  `)
    console.log(`   mini-npm run success!`)
  }).catch((err: any) => {
    console.error(err)
  })
}

export function remove (list: PackItem): Promise<any> {
  const packLists = getPackLists(list)
  if (packLists.length > 0) {
    shell.mkdir('-p', path.resolve(config.output))
    shell.cd(path.resolve(config.output))
  } else {
    return
  }

  const tasks = new listr(
    packLists.map((x) => {
      return {
        title: `remove ${x.name}`,
        task: () => handleRemove(x.name)
      }
    })
  )
  return tasks.run().then(() => {
    console.log(`  `)
    console.log(`   mini-npm run success!`)
  }).catch((err: any) => {
    console.error(err)
  })
}
