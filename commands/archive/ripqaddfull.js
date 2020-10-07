const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_ADD_URL) {
  throw new Error('RIPER_QUEUE_ADD_URL is required')
}

module.exports = class RipperQueueAddCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ripqaddfull',
      aliases: ['rip-queue-add-full', 'rqaf'],
      group: 'archive',
      memberName: 'ripqaddfull',
      description: 'Enques an existing gallery to be ripped, forcing a full crawl',
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
        },
        {
          key: 'priority',
          prompt: 'Priority to assign job in the rip queue',
          type: 'integer'
        }
      ]
    })
  }

  async run (message, { galleryName, galleryType, priority }) {
    const resp = await fetch(process.env.RIPER_QUEUE_ADD_URL, {
      method: 'POST',
      body: JSON.stringify([{ deviant: galleryName, mode: galleryType, priority, full_crawl: true }]),
      headers: { 'Content-Type': 'application/json' }
    })
    const status = await resp.text()
    logger.debug({ galleryName, galleryType, priority, status })
    return message.say(`Added \`${galleryName} ${galleryType} ${priority}\` to ripper queue with forced full crawl. Status: ${status}`)
  }
}
