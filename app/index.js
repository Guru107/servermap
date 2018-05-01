const program = require('commander')
const clear = require('clear')
const chalk = require('chalk')
const fs = require('fs')
const ini = require('ini')
const Fuse = require('fuse.js')
const pkg = require('../package.json')
const { initialize,createConfig,ansibleInventoryHostParser,iniFileReader } = require('./utils')

const configObj = createConfig(pkg.name,{})
const servers = [
	{
		'group':'dbservers',
		'servers':[
			'one.example.com',
			'two.example.com',
			'three.example.com'
		]
	},
	{
		'group': 'webservers',
		'servers':[
			'foo.example.com',
			'bar.example.com'
		]
	}
]
const fuseOptions = {
	keys:['group','servers']
}
const fuse = new Fuse(servers,fuseOptions)

console.log(fuse.search('web'))
if(configObj.has('ansible')){
	if(fs.existsSync(configObj.get('ansible'))){
		const inventoryObject = iniFileReader(configObj.get('ansible'))
		console.log(inventoryObject)
		const inventories = ansibleInventoryHostParser(inventoryObject)
	}else{
		console.warn('Ansible inventory file does not exist or the path specified is wrong, please run `servermap init` command again to add correct inventory file')
		configObj.delete('ansible')
	}
}

program.version(pkg.version)
.description(chalk.yellow('Server Map'))

program.command('init')
.description('Initialize your config')
.alias('i')
.action(function(){
	initialize().then(config => {
		configObj.set(config)
	})
})


program.command('connect <server_name>')
.description('Ssh into remote server')
.alias('c')
.action(function(arg1){
	
})



program
.parse(process.argv)

