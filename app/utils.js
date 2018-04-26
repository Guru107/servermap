const fs = require('fs')
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

const initialize = async () => {
	printTitle('Server Map')
	return await questions() 
}

function createConfig(pkgName,config) {
	return new ConfigStore(pkgName,config)
}

module.exports = {
	initialize,
	createConfig
}