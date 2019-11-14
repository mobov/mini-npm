declare module '*.json' {
  const data: {
    version: string
    dependencies: {
      [package: string]: string
    }
  }
  export default data
}
