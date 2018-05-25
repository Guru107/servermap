
const os = require('os')
const fs = require('fs')
const program = require('commander')
const chalk = require('chalk')
const SSHClient = require('ssh2')


const omelette = require('omelette')


const pkg = require('../package.json')
const { parseInventories ,INVENTORIES_DIR, initialize, createConfig, createInventoryDirectory } = require('./utils')

const configObj = createConfig(pkg.name, {})


const completion = omelette(`servermap`).tree({
	init: null,
	connect: parseInventories(INVENTORIES_DIR)
})

completion.init()

program.version(pkg.version)
	.description(chalk.yellow('Server Map'))

program.option('--setup', 'Setup auto completion (Run this only once)', () => {
	completion.setupShellInitFile()
})

program.command('init')
	.description('Initialize config')
	.alias('i')
	.action(() => {
		initialize().then(config => {
			configObj.set(config)
			createInventoryDirectory()
			
			//const inifile = ansibleInventoryHostParser(iniFileReader(INVENTORIES_DIR))
			
		})
	})

program.command('connect <data_center> <group_name> <server_name>')
	.description('Shh into server')
	.alias('c')
	.action((dataCenter, groupName, serverName) => {
		
		const sshUser = configObj.get('ssh')
		/*eslint no-console: 0 */
		console.log(`${sshUser}@${serverName}`)

		var conn = new SSHClient();
		conn.on('ready', function () {
			
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
					process.stdin.setRawMode(false)
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

// Output help information if nothing is provided
if (!process.argv.slice(2).length) {
	program.help()
}
program.parse(process.argv)