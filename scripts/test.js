const { spawn } = require('child_process');
const fs = require('fs/promises');
const path = require('path');

const { MultiSelect } = require('enquirer');

const main = async () => {
  const rootDir = path.resolve(__dirname, '..');
  const packagesDir = path.resolve(rootDir, 'packages');
  const packages = await fs.readdir(packagesDir);
  const options = packages.map((pkg) => {
    const { name } = require(path.resolve(packagesDir, `${pkg}/package.json`));
    return {
      name,
      value: path.resolve(packagesDir, pkg),
    };
  });

  const prompt = new MultiSelect({
    name: 'packages',
    message: 'Choose the package you wish to format',
    limit: 10,
    choices: options,
    result(names) {
      return this.map(names);
    },
  });

  const answers = await prompt.run();
  const filesToTest = Object.keys(answers).map((pkg) => `--scope=${pkg}`);

  if (filesToTest.length === 0) {
    console.log('No file chosen');
    process.exit(1);
  }

  const lernaArgs = ['run', 'test', ...filesToTest];
  spawn('lerna', lernaArgs, { stdio: 'inherit' });
};

main();
