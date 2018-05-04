
const program = require('commander')
const clear = require('clear')
const chalk = require('chalk')
const { spawn } = require('child_process')
const fs = require('fs')
const os = require('os')
const SSHClient = require('ssh2')

const ini = require('ini')
const omelette = require('omelette')
const Fuse = require('fuse.js')

const pkg = require('../package.json')
const { initialize, createConfig, ansibleInventoryHostParser, iniFileReader } = require('./utils')

const configObj = createConfig(pkg.name, {})


omelette(`servermap`).tree({
	init: null,
	connect: null
}).init()




program.version(pkg.version)
	.description(chalk.yellow('Server Map'))

program.option('--setup', 'Setup auto completion (Run this once)', () => {
	completion.setupShellInitFile()
})

program.command('init')
	.description('Initialize config')
	.alias('i')
	.action(serverName => {
		initialize().then(config => {
			configObj.set(config)
			console.log(configObj.get('ansible'))
		})
	})

program.command('connect <server_name>')
	.description('Shh into server')
	.alias('c')
	.action(serverName => {
		const sshUser = configObj.get('ssh')
		console.log(`${sshUser}@${serverName}`)

		var conn = new SSHClient();
		conn.on('ready', function () {
			console.log('Client :: ready');
			conn.shell(function (err, stream) {
				if (err) throw err;

				process.stdin.setRawMode(true)
				process.stdin.pipe(stream)
				stream.pipe(process.stdout)
				stream.stderr.pipe(process.stderr)
				process.stdout.on('resize', function () {
					stream.setWindow(process.stdout.rows, process.stdout.columns);
				})
				var listeners = process.stdin.listeners('keypress')

				// Remove those listeners
				process.stdin.removeAllListeners('keypress')

				stream.on('close', function () {

					// Release stdin
					process.stdin.setRawMode(false);
					process.stdin.unpipe(stream);
					process.stdin.unref();

					// Restore listeners
					listeners.forEach(function (listener) {
						return process.stdin.addListener('keypress', listener);
					})
					// End connection
					conn.end();

				})

			})
		}).connect({
			host: serverName,
			port: 22,
			username: sshUser,
			privateKey: fs.readFileSync(`${os.homedir()}/.ssh/id_rsa`)
		})

	})

program.parse(process.argv)