const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_ADD_URL) {
  throw new Error('RIPER_QUEUE_ADD_URL is required')
}

module.exports = class RipperQueueAddSubFullCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ripqaddsubfull',
      aliases: ['rip-queue-add-sub-full', 'rqasf'],
      group: 'archive',
      memberName: 'ripqaddsubfull',
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
          oneOf: ['album', 'collection']
        },
        {
          key: 'subType',
          prompt: 'Sub type of gallery to add to the rip queue',
          type: 'string'
        },
        {
          key: 'priority',
          prompt: 'Priority to assign job in the rip queue',
          type: 'integer'
        }
      ]
    })
  }

  hasPermission (msg) {
    if (!this.client.isOwner(msg.author)) return 'Only the bot owner(s) may use this command.'
    return true
  }

  async run (message, { galleryName, galleryType, subType, priority }) {
    const resp = await fetch(process.env.RIPER_QUEUE_ADD_URL, {
      method: 'POST',
      body: JSON.stringify([{ deviant: galleryName, mode: galleryType.toLowerCase(), mval: subType, priority, full_crawl: true }]),
      headers: { 'Content-Type': 'application/json' }
    })
    const status = await resp.text()
    logger.debug({ galleryName, galleryType, priority, subType, status })
    return message.say(`Added \`${galleryName} ${galleryType} ${subType} ${priority}\` to ripper queue with forced full crawl. Status: ${status}`)
  }
}
