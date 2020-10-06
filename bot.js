
const logger = require('winston')
const { CommandoClient } = require('discord.js-commando')
const path = require('path')

const Enmap = require('enmap')

// Configure logger settings
logger.remove(logger.transports.Console)
logger.add(new logger.transports.Console(), {
  colorize: true
})
logger.level = 'debug'

const client = new CommandoClient({
  commandPrefix: '!',
  owner: '159657566584963072',
  invite: ''
})

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ['archive', 'Archive Command Group']
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.archive = {
  uploadQueue: new Enmap({
    name: 'uploadQueue',
    fetchAll: false,
    autoFetch: true,
    cloneLevel: 'deep'
  })

}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`)
  client.user.setActivity('with Commando')
})

client.on('error', console.error)

if (!process.env.AUTH_TOKEN) {
  const auth = require('./auth.json')
  client.login(auth.token)
} else {
  client.login(process.env.AUTH_TOKEN)
}

