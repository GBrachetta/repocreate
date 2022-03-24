/* eslint-disable no-undef */
import { execa } from 'execa';

export async function initializeRepo() {
  await execa('git', ['init']);
}

export async function addToGit() {
  await execa(
    'git',
    ['add', '.'],
    { cwd: process.cwd() },
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    },
  );
}

export async function createFirstCommit() {
  await execa(
    'git',
    ['commit', '-m', '"🚀 Initial Setup"'],
    { cwd: process.cwd() },
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    },
  );
}

export async function createRepo(repoName, repoDescription, repoType) {
  await execa(
    'gh',
    [
      'repo',
      'create',
      `${repoName}`,
      '--description',
      `${repoDescription}`,
      `--${repoType}`,
      '--homepage',
      'https://www.gbrachetta.com/',
    ],
    { cwd: process.cwd() },
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    },
  );
}

export async function addRemote(repoName) {
  await execa(
    'git',
    ['remote', 'add', 'origin', `git@github.com:GBrachetta/${repoName}.git`],
    { cwd: process.cwd() },
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log(`stdout: ${stdout}`);
    },
  );
}

export async function pushRepo() {
  await execa(
    'git',
    ['push', '-u', 'origin', 'master'],
    { cwd: process.cwd() },
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    },
  );
}

export async function goodbye(repoName, userName) {
  console.log();
  console.log(
    `🎉 Done! - Your repository is available in: https://github.com/${userName}/${repoName}`,
  );
}
