/* eslint-disable no-undef */
import { execa } from 'execa';
import shell from 'shelljs';
import fs from 'fs';
import chalk from 'chalk';
import stripAnsi from 'strip-ansi';

const { which } = shell;

export async function checkGh() {
  if (!which('gh')) {
    shell.echo(
      'Sorry, this script requires gh installed (GitHub CLI tool) to work',
    );
    shell.echo();
    shell.echo('See: https://cli.github.com/');
    shell.exit(1);
  }
}

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

export async function createRepo(
  repoName,
  repoDescription,
  repoType,
  homepage,
) {
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
      `${homepage}`,
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

export async function addRemote(repoName, username) {
  await execa(
    'git',
    [
      'remote',
      'add',
      'origin',
      `git@github.com:${stripAnsi(username)}/${repoName}.git`,
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

export async function addReadme(repoName, repoDescription, username) {
  const readme = `
# ${repoName}

## By ${username}

${repoDescription}
`;
  fs.writeFile(`${process.cwd()}/Readme.md`, readme, err => {
    if (err) {
      console.error(err);
      return;
    }
  });
}

export async function goodbye(repoName, userName) {
  console.log();
  console.log(
    chalk.cyan.bold(
      `🎉 Done! - Your repository is available in: https://github.com/${userName}/${repoName}`,
    ),
  );
}
