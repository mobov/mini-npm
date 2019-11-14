import * as packageJson from '../package.json'

interface Config {
  output: string
}

const config: Config = {
  output: "mini_node_modules/"
}

if (packageJson["mini-npm-config"]) {
  Object.assign(config, packageJson["mini-npm-config"])
}

export default config as Config