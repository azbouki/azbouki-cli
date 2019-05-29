#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var program = require('commander');
var ProjectCreator_1 = __importDefault(require("./ProjectCreator"));
clear();
console.log(chalk.red(figlet.textSync('azbouki', { horizontalLayout: 'full' })));
program
    .version('0.1.0');
var Creator = new ProjectCreator_1.default();
program
    .command('create [projectName]')
    .description('generates new project')
    .action(Creator.createProject);
program.parse(process.argv);
