const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_ADD_URL) {
  throw new Error('RIPER_QUEUE_COUNT_URL is required')
}

module.exports = class RipperQueueCountCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ripqcount',
      aliases: ['rip-queue-count', 'rqc'],
      group: 'archive',
      memberName: 'ripqcount',
      description: 'Queries the current size of the ripper queue',
      guildOnly: false
    })
  }

  async run (message) {
    const resp = await fetch(process.env.RIPER_QUEUE_COUNT_URL)
    const msg = await resp.json()
    logger.debug({ msg })
    return message.say(msg)
  }
}
