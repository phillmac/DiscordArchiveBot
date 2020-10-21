const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.BULK_QUERY_URL) {
  throw new Error('BULK_QUERY_URL is required')
}

module.exports = class RipperQueueAddCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'bulkquery',
      aliases: ['bulk-query', 'bq'],
      group: 'archive',
      memberName: 'bulkquery',
      description: 'Queries if a gallery is contained in the bulk list',
      guildOnly: false,
      args: [
        {
          key: 'galleryName',
          prompt: 'Name of gallery to query in the bulk list',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { galleryName }) {
    try {
      const resp = await fetch(process.env.BULK_QUERY_URL)
      if (resp.status === 200) {
        const match = (await resp.json())[galleryName.toLowerCase()]
        if (!match) {
          return message.say(`No bulk items found for \`${galleryName}\`.`)
        }
        logger.debug(match)
        const modes = Object.keys(match)
        .map(m =>`\t*${m}*\n\t\t${match[m] ? match[m].join('\n\t\t') : ''}`)
        return message.say(`**${galleryName}**${modes.join('\n')}`)
      }
    } catch (err) {
      logger.error(err.toString())
    }
    return message.say('Error: Unable to query queue manager.')
  }
}
