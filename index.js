#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * repocreate
 * A command line tool to create repositories and push them to Github
 *
 * @author Guillermo Brachetta <https://brachetta.com>
 */

import init from './utils/init.js';
import cli from './utils/cli.js';
import log from './utils/log.js';
import inquirer from 'inquirer';
import path from 'path';
import Listr from 'listr';
import shell from 'shelljs';
import chalk from 'chalk';
import {
  addReadme,
  addRemote,
  addToGit,
  checkGh,
  createFirstCommit,
  createRepo,
  goodbye,
  initializeRepo,
  pushRepo,
} from './utils/utils.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const currentFileUrl = import.meta.url;

const templatesPath = path.resolve(
  new URL(currentFileUrl).pathname,
  '../templates',
);

async function areYouSure(repoName, repoDescription, repoType, username) {
  const colors = {
    choices: chalk.hex('#8fde8e').bold,
    danger: chalk.hex('#ff4400').inverse.bold,
    friendly: chalk.hex('#6ea9c2').inverse.bold,
    warning: chalk.hex('#FF8800').inverse.bold,
  };

  console.log();
  console.log(colors.friendly(' Your selection: '));
  console.log();
  console.log('‣ Repository Name:', colors.choices(repoName));
  console.log('‣ Repository Description:', colors.choices(repoDescription));
  console.log('‣ Repository Type:', colors.choices(repoType));
  console.log('‣ Your GitHub Username:', colors.choices(username));
  console.log(
    '‣ Your Repository will be created in the current directory:',
    colors.choices(process.cwd()),
  );
  console.log();

  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: colors.warning(' Are you sure? '),
        default: false,
      },
    ])
    .then(async answers => {
      if (answers.confirm) {
        console.log();
        console.log(chalk.bgBlueBright.black(' Creating repository... '));
        console.log();
        await goAhead(repoName, repoDescription, repoType, username);
      } else {
        console.log();
        console.log(colors.danger(' Cancelled '));
        process.exit(0);
      }
    });
}

const goAhead = async (repoName, repoDescription, repoType, username) => {
  const tasks = new Listr([
    {
      title: 'Initialize Repository',
      task: () => initializeRepo(),
    },
    {
      title: 'Add .gitignore',
      task: () => shell.cp('-R', `${templatesPath}/gitignore`, './'),
    },
    {
      title: 'Rename .gitignore',
      task: () => shell.mv('gitignore', '.gitignore'),
    },
    {
      title: 'Add Readme',
      task: () => addReadme(repoName, repoDescription, username),
    },
    {
      title: 'Add files to stage',
      task: () => addToGit(),
    },
    {
      title: 'Create First Commit',
      task: () => createFirstCommit(),
    },
    {
      title: 'Create Repo',
      task: () => createRepo(repoName, repoDescription, repoType),
    },
    {
      title: 'Add Github Remote',
      task: () => addRemote(repoName),
    },
    {
      title: 'Push to Github',
      task: () => pushRepo(),
    },
  ]);
  await tasks.run();
  goodbye(repoName, username);
};

(async () => {
  init({ clear });
  input.includes(`help`) && cli.showHelp(0);

  debug && log(flags);

  // Check if gh is installed
  checkGh();

  // Prompt
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'username',
        message: 'What is your GitHub username?',
        default: 'my-username',
      },
      {
        type: 'input',
        name: 'repoName',
        message: 'What is the name of the repository?',
        default: 'my-repo-name',
      },
      {
        type: 'input',
        name: 'repoDescription',
        message: 'Please enter a description',
        default: 'Repository description',
      },
      {
        type: 'list',
        name: 'repoType',
        message: 'What type of repository is this?',
        choices: ['public', 'private'],
      },
    ])
    .then(({ repoName, repoDescription, repoType, username }) => {
      areYouSure(repoName, repoDescription, repoType, username);
    });
})();
