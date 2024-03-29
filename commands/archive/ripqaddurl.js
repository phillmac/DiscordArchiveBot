const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_ADD_U_URL) {
  throw new Error('RIPER_QUEUE_ADD_U_URL is required')
}

module.exports = class RipperQueueAddUrlCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ripqaddurl',
      aliases: ['rip-queue-add-url', 'rqau'],
      group: 'archive',
      memberName: 'ripqaddurl',
      description: 'Enques an existing gallery to be ripped',
      guildOnly: false,
      args: [
        {
          key: 'url',
          prompt: 'url of gallery to add to the rip queue',
          type: 'string'
        }
      ]
    })
  }

  hasPermission (msg) {
    if (!this.client.isOwner(msg.author)) return 'Only the bot owner(s) may use this command.'
    return true
  }

  async run (message, { url }) {
    const params = new URLSearchParams()
    params.append('url', url)
    const resp = await fetch(process.env.RIPER_QUEUE_ADD_U_URL, {
      method: 'POST',
      body: params
    })
    const status = await resp.text()
    logger.debug({ url })
    return message.say(`Added ${url} to ripper queue. Staus: ${status}`)
  }
}
