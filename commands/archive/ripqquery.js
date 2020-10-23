const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_QUERY_URL) {
  throw new Error('RIPER_QUEUE_QUERY_URL is required')
}

module.exports = class RipperQueueQueryCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'ripqquery',
      aliases: ['rip-queue-query', 'rqq'],
      group: 'archive',
      memberName: 'ripqquery',
      description: 'Queries if a gallery is queued to be ripped',
      guildOnly: false,
      args: [
        {
          key: 'galleryName',
          prompt: 'Name of gallery to query in the rip queue',
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
          return message.say(` No queue items found for \`${galleryName}\`.`)
        }
        return message.say(matches
          .map(m => `\`Name: ${m?.deviant} Mode: ${m?.mode} priority: ${m?.priority}\``)
          .join('\n')
        )
      }
    } catch (err) {
      logger.error(err.toString())
    }
    return message.say('Error: Unable to query queue manager.')
  }
}
