#!/usr/bin/env node

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
import {
  addRemote,
  addToGit,
  createFirstCommit,
  createRepo,
  goodbye,
  initializeRepo,
  pushRepo,
} from './utils/utils.js';

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

const userName = 'gbrachetta';
const currentFileUrl = import.meta.url;

const templatesPath = path.resolve(
  new URL(currentFileUrl).pathname,
  '../templates',
);

const goAhead = async (repoName, repoDescription, repoType) => {
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
  goodbye(repoName, userName);
};

(async () => {
  init({ clear });
  input.includes(`help`) && cli.showHelp(0);

  debug && log(flags);

  inquirer
    .prompt([
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
    .then(({ repoName, repoDescription, repoType }) => {
      goAhead(repoName, repoDescription, repoType);
    });
})();
