const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const { createFsFromVolume, Volume } = require('memfs')
const { Union } = require('unionfs')

module.exports = (fixture, options = {}) => {
  // we use memfs to omit the need to output generated bundle file to real file system
  const memfs = createFsFromVolume(new Volume())
  const inputFileName = '_virtual-index.js'
  const testDir = path.resolve(__dirname, '..')

  const virtualFilePath = path.join(testDir, inputFileName)
  memfs.mkdirSync(testDir, { recursive: true })
  memfs.writeFileSync(virtualFilePath, fixture, 'utf-8')

  // get package entry from package.json
  const packageJsonPath = path.resolve(testDir, 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  const entry = packageJson.main

  // Create a Union filesystem combining memfs and the real fs
  const union = new Union()
  union.use(memfs).use(fs)

  const compiler = webpack({
    context: testDir,
    entry: `./${inputFileName}`,
    output: {
      path: testDir,
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                configFile: path.resolve(testDir, 'babel.config.js'),
              },
            },
            {
              loader: path.resolve(testDir, entry),
              options: {
                rootValue: 3.75,
                unitPrecision: 3,
                transformRuntime: true,
                transformJSX: false,
                ...options,
              },
            },
          ],
        },
      ],
    },
  })

  compiler.inputFileSystem = union
  compiler.outputFileSystem = memfs

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(stats.toJson().errors)
      resolve(stats)
    })
  })
}
