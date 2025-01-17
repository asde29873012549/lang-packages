const { spawn } = require('child_process')
const { MultiSelect } = require('enquirer')
const fs = require('fs/promises')
const path = require('path')

const main = async () => {
  const rootDir = path.resolve(__dirname, '..')
  const packagesDir = path.resolve(rootDir, 'packages')
  const packages = await fs.readdir(packagesDir)
  const options = packages.map((pkg) => {
    const { name } = require(path.resolve(packagesDir, `${pkg}/package.json`))
    return {
      name,
      value: path.resolve(packagesDir, pkg),
    }
  })

  const prompt = new MultiSelect({
    name: 'packages',
    message: 'Choose the package you wish to format',
    limit: 10,
    choices: options,
    result(names) {
      return this.map(names)
    },
  })

  const answers = await prompt.run()
  const filesToLint = Object.values(answers).map((pkg) => path.resolve(pkg, '**/*.{js,jsx,ts,tsx}'))

  if (filesToLint.length === 0) {
    console.log('No file chosen')
    process.exit(1)
  }

  const prettierArgs = ['--write', ...filesToLint]
  spawn('prettier', prettierArgs, { stdio: 'inherit' }).on('close', (code) => {
    if (code === 0) {
      console.log('prettier finished formatting')
    } else {
      console.log(`prettier process exited with code ${code}`)
    }
  })
}

main()
