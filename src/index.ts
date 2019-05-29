#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');
import ProjectCreator from './ProjectCreator'

clear();
console.log(
    chalk.red(
        figlet.textSync('azbouki', { horizontalLayout: 'full' })
    )
);

program
    .version('0.1.0')

const Creator = new ProjectCreator()

program
    .command('create [projectName]')
    .description('generates new project')
    .action(Creator.createProject);

program.parse(process.argv);
