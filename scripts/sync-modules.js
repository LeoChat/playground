#!/usr/bin/env node
const arrToSentence = require('array-to-sentence');
const execa = require('execa');
const fs = require('fs');
const path = require('path');

const gitModulesDir = path.resolve(__dirname, '../git_modules');

const main = async () => {
  const gitModulesNames = await new Promise((resolve, reject) => fs.readdir(gitModulesDir, (error, result) => {
    if (error) {
      reject(error);
    }
    else {
      resolve(result);
    }
  }));

  const gitModules = gitModulesNames.map(name => path.resolve(gitModulesDir, name));
  const changedModules = [];
  const changedModulesNames = [];

  for (let i = 0; i < gitModules.length; i++) {
    const gm = gitModules[i];
    const name = gitModulesNames[i];

    await execa('git', ['pull', 'origin', 'master'], {
      cwd: gm,
      stdio: 'pipe',
    });

    await execa('git', ['add', gm]);

    try {
      await execa('git', ['diff', '--quiet', gm]);

      changedModules.push(gm);
      changedModulesNames.push(name);
    }
    catch (e) {
      // Unchanged
    }
  }

  if (!changedModules.length) return;

  await execa('git', ['commit', ...changedModules, '-m', `Sync ${arrToSentence(changedModulesNames)} git-modules`], {
    stdio: 'pipe',
  });
};

main();
