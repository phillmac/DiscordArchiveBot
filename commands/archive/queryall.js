const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_QUERY_URL) {
  throw new Error('RIPER_QUEUE_QUERY_URL is required')
}

if (!process.env.BULK_QUERY_URL) {
  throw new Error('BULK_QUERY_URL is required')
}

module.exports = class RipperQueueAddCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'queryall',
      aliases: ['query-all', 'qa'],
      group: 'archive',
      memberName: 'queryall',
      description: 'Queries if a gallery is queued to be ripped or in bulk items',
      guildOnly: false,
      args: [
        {
          key: 'galleryName',
          prompt: 'Name of gallery to query',
          type: 'string'
        }
      ]
    })
  }

  async run (message, { galleryName }) {
    try {
      const resp = await fetch(process.env.RIPER_QUEUE_QUERY_URL)
      if (resp.status === 200) {
        const matches = (await resp.json())
          .map(qi => Object.fromEntries(qi))
          .filter(qi => qi?.deviant?.toLowerCase() === galleryName.toLowerCase())

        if (matches.length === 0) {
          message.say(` No queue items found for \`${galleryName}\`.`)
        }
        message.say(matches
          .map(m => `\`Name: ${m?.deviant} Mode: ${m?.mode} priority: ${m?.priority}\``)
          .join('\n')
        )
      }
    } catch (err) {
      logger.error(err.toString())
      message.say('Error: Unable to query queue manager.')
    }

    try {
      const resp = await fetch(process.env.BULK_QUERY_URL)
      if (resp.status === 200) {
        const match = (await resp.json())[galleryName.toLowerCase()]
        if (!match) {
          return message.say(`No bulk items found for \`${galleryName}\`.`)
        }
        logger.debug(match)
        const modes = Object.keys(match)
          .map(m => `\t*${m}*\n\t\t${match[m] ? match[m].join('\n\t\t') : ''}`)
        return message.say(`**${galleryName}**\n${modes.join('\n')}`)
      }
    } catch (err) {
      logger.error(err.toString())
    }
    return message.say('Error: Unable to query queue manager.')
  }
}
