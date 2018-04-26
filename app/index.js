const program = require('commander')
const clear = require('clear')
const fs = require('fs')
const ini = require('ini')
const pkg = require('../package.json')
const { initialize,createConfig } = require('./utils')

program.version(pkg.version)
.option('-i, --init','Enter your config')
.command('connect [server_name]','Ssh into remote server')
.parse(process.argv)



if(program.init){
	initialize().then(config => {
		const configObj = createConfig(pkg.name,config)
		const inventoryFile = ini.parse(fs.readFileSync(configObj.get('ansible'),'UTF-8'))
		console.log(inventoryFile)
	})
}
