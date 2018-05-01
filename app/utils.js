const fs = require('fs')
const ini = require('ini')
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const ConfigStore = require('configstore')

function printTitle(message) {
	console.log(
		chalk.yellow(
			figlet.textSync(message,{font: 'Ghost',
			horizontalLayout: 'full',
			verticalLayout: 'default'})
		)
	)
}

function questions(){
	const questions = [
		{
			'type':'input',
			'name':'ssh',
			'message':'Enter your ssh username: '
		},
		{
			'type': 'input',
			'name': 'ansible',
			'message': 'Enter ansible inventory file location'
		}
	]
	return inquirer.prompt(questions)
}

async function initialize() {
	printTitle('Server Map')
	return await questions() 
}

function createConfig(pkgName,config) {
	return new ConfigStore(pkgName,config)
}

function iniFileReader(filePath){
	const inventoryFile = ini.parse(fs.readFileSync(filePath,'UTF-8'))
	return inventoryFile
}

function ansibleInventoryHostParser(inventoryObject){
	
	Object.keys(inventoryObject).forEach(inventorykey => {
		if(typeof inventoryObject[inventorykey] === 'object'){
			console.log('Group Name: ',inventorykey)
			ansibleInventoryHostParser(inventoryObject[inventorykey])
		}else if(typeof inventoryObject[inventorykey] === 'boolean'){
			console.log('Inventory name: ',inventorykey)
		}else{
			return
		}
	})
}

module.exports = {
	initialize,
	createConfig,
	ansibleInventoryHostParser,
	iniFileReader
}