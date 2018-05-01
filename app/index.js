const program = require('commander')
const clear = require('clear')
const chalk = require('chalk')
const fs = require('fs')
const ini = require('ini')
const pkg = require('../package.json')
const { initialize,createConfig } = require('./utils')

const configObj = createConfig(pkg.name,{})

program.version(pkg.version)
.description(chalk.yellow('Server Map'))




program.command('init')
.description('Initialize your config')
.alias('i')
.action(function(){
	initialize().then(config => {
		configObj.set(config)
		const inventoryFile = ini.parse(fs.readFileSync(configObj.get('ansible'),'UTF-8'))
		console.log(inventoryFile)
	})
})


program.command('connect <server_name>')
.description('Ssh into remote server')
.alias('c')
.action(function(arg1){
	console.log(arg1)
})

program.parse(process.argv)

