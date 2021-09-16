const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_ADD_URL) {
  throw new Error('RIPER_QUEUE_ADD_URL is required')
}

module.exports = class RipperQueueAddFullCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ripqaddfull',
      aliases: ['rip-queue-add-html', 'rqah'],
      group: 'archive',
      memberName: 'ripqaddhtml',
      description: 'Enques an existing gallery to be ripped, forcing a full crawl & html dump',
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

  hasPermission (msg) {
    if (!this.client.isOwner(msg.author)) return 'Only the bot owner(s) may use this command.'
    return true
  }

  async run (message, { galleryName, galleryType, priority }) {
    const resp = await fetch(process.env.RIPER_QUEUE_ADD_URL, {
      method: 'POST',
      body: JSON.stringify([{
        deviant: galleryName,
        mode: galleryType.toLowerCase(),
        priority,
        full_crawl: true,
        disable_filter: true,
        dump_html: true,
        load_more: true
      }]),
      headers: { 'Content-Type': 'application/json' }
    })
    const status = await resp.text()
    logger.debug({ galleryName, galleryType, priority, status })
    return message.say(`Added \`${galleryName} ${galleryType} ${priority}\` to ripper queue with dump html. Status: ${status}`)
  }
}
