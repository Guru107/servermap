const fs = require('fs')
const os = require('os')
const ini = require('ini')
const chalk = require('chalk')
const figlet = require('figlet')
const inquirer = require('inquirer')
const ConfigStore = require('configstore')

const INVENTORIES_DIR = `${os.homedir()}/inventories`
function printTitle(message) {
	console.log(
		chalk.yellow(
			figlet.textSync(message,{font: 'Ghost',
			horizontalLayout: 'full',
			verticalLayout: 'default'})
		)
	)
}

function checkIfInventoryDirExists() {
	const inventoryStat = fs.existsSync(INVENTORIES_DIR) && fs.statSync(INVENTORIES_DIR)
	if(inventoryStat){
		return inventoryStat.isDirectory()
	}else{
		return false
	}
}

function createInventoryDirectory() {
	
	if(!checkIfInventoryDirExists()){
		fs.mkdirSync(INVENTORIES_DIR)
	}
}

function questions(){
	const questions = [
		{
			'type':'input',
			'name':'ssh',
			'message':'Enter your ssh username: '
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
		}else {
			return
		}
	})
}

function checkAnsibleFile(){
	if(configObj.has('ansible')){
		if(fs.existsSync(configObj.get('ansible'))){
			const inventoryObject = iniFileReader(configObj.get('ansible'))
			const inventories = ansibleInventoryHostParser(inventoryObject)
		}else{
			console.warn('Ansible inventory file does not exist or the path specified is wrong, please run `servermap init` command again to add correct inventory file')
			configObj.delete('ansible')
		}
	}
}

function parseInventories(inventoryDirectory) {
	const inventories = fs.readdirSync(inventoryDirectory)

	const inventoryObject =inventories.map(filename => {
		const keyName = filename.split('.')[0]
		const hostGroups = JSON.parse(JSON.stringify(iniFileReader(`${inventoryDirectory}/${filename}`)))
		
		const groupInventories = Object.keys(hostGroups).map(groupname => {
			if(typeof hostGroups[groupname] === 'object'){
				return { [groupname]: Object.keys(hostGroups[groupname]) }
			} else {
				return { [groupname]: hostGroups[groupname] }
			} 
		}).reduce((previousValue,currentValue) => {
			return Object.assign({},previousValue,{
				...currentValue
			})
		},{})
		
		return {
			[keyName]: groupInventories
		}
	}).reduce((previousValue,currentValue)=>{
		return Object.assign({},previousValue,{
			...currentValue
		})
	},{})
	
	
	return inventoryObject
}

module.exports = {
	initialize,
	createConfig,
	ansibleInventoryHostParser,
	iniFileReader,
	createInventoryDirectory,
	INVENTORIES_DIR,
	parseInventories
}