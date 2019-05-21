#!/usr/bin/env node

const ncp = require('ncp').ncp;

ncp.limit = 16;


const args = process.argv.splice(process.execArgv.length + 2);

const command = args[0];
const packageName = args[1];

const source = `${__dirname}\\..\\source`;
const destination = process.cwd() + `\\${packageName}`;

if (command === 'generate') {

    ncp(source, destination, (err) => {
        if (err) {
            return console.error(err);
        }
        console.log('done!');
    });
} else {
    console.error(`No such command ${command}`);
}
