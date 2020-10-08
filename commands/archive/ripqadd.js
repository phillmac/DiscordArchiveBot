const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_ADD_URL) {
  throw new Error('RIPER_QUEUE_ADD_URL is required')
}

module.exports = class RipperQueueAddCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ripqadd',
      aliases: ['rip-queue-add', 'rqa'],
      group: 'archive',
      memberName: 'ripqadd',
      description: 'Enques an existing gallery to be ripped',
      guildOnly: false,
      args: [
        {
          key: 'galleryName',
          prompt: 'Name of gallery to add to the rip queue',
          type: 'string'
        },
        {
          key: 'galleryType',
          prompt: 'Type of gallery to add to the rip queue',
          type: 'string',
          oneOf: ['gallery', 'favs']
        }
      ]
    })
  }

  hasPermission (msg) {
    if (!this.client.isOwner(msg.author)) return 'Only the bot owner(s) may use this command.'
    return true
  }

  async run (message, { galleryName, galleryType }) {
    const resp = await fetch(process.env.RIPER_QUEUE_ADD_URL, {
      method: 'POST',
      body: JSON.stringify([{ deviant: galleryName, mode: galleryType, priority: 110 }]),
      headers: { 'Content-Type': 'application/json' }
    })
    const status = await resp.text()
    logger.debug({ galleryName, galleryType, status })
    return message.say(`Added \`${galleryName} ${galleryType}\` to ripper queue. Status: ${status}`)
  }
}
