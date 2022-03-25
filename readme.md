# Repocreate

This command line tool automatizes the following:

- Initializes a git repository
- Adds a generic `.gitignore` file
- Stages and commits all files in the directory
- Creates a GitHub repository with the given name
- Adds a remote to that repository
- Pushes all files to the remote

## Requirements

You need to have `git` and the [GitHub CLI](https://cli.github.com/) installed.

## Installation

```bash
npm i -g @gbrachetta/repocreate
```

## Usage

Run the following in your terminal, **from the root of your directory for which you want to create a repository**:

```bash
repocreate
```
