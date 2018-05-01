
const program = require('commander')
const clear = require('clear')
const chalk = require('chalk')
const fs = require('fs')
const ini = require('ini')
const omelette = require('omelette')
const Fuse = require('fuse.js')
const pkg = require('../package.json')
const { initialize, createConfig, ansibleInventoryHostParser, iniFileReader } = require('./utils')

const configObj = createConfig(pkg.name,{})
const completion = omelette(`servermap`)

completion.on('action',({reply})=>{
	reply(['init','connect'])
})
completion.init()



program.version(pkg.version)
.description(chalk.yellow('Server Map'))

program.option('--setup','Setup auto completion (Run this once)',()=>{
	completion.setupShellInitFile()
})

program.command('init')
.description('Initialize config')
.alias('i')
.action(serverName => {
	initialize().then(config=>{
		configObj.set(config)
	})
})

program.command('connect <server_name>')
.description('Shh into server')
.alias('c')
.action(serverName => {
	console.log(serverName)
})

program.parse(process.argv)