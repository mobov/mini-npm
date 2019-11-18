# mini-npm
> clean mini npm, 纯净版npm，只安装npm依赖包而没有多余的依赖

## 安装
```shell
npm i mini-npm -g
```
or
```shell
yarn global add mini-npm
```

## 使用
### 安装依赖包
```shell
 mpm install
```

### 新增依赖包
```shell
 mpm add <pkg>@<version>
```

### 移除依赖包
```shell
 mpm remove <pkg>@<version>
```

### 指定输出目录名
在package.json中加入以下配置
``` json
   "mini-npm-config": {
        "output": "mini_node_modules/"
    },
```
