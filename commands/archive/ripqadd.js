const { Command } = require('discord.js-commando')
const fetch = require('node-fetch');

if (!process.env.RIPER_QUEUE_ADD_URL) {
  throw new Error('RIPER_QUEUE_ADD_URL is required')
}


module.exports = class MeowCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ripqadd',
      aliases: ['rip-queue-add', 'rqa'],
      group: 'archive',
      memberName: 'ripqadd',
      description: 'Enques an existing gallery to be ripped',
      guildOnly: true,
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

  async run(message, { galleryName, galleryType }) {
    const resp = await fetch(process.env.RIPER_QUEUE_ADD_URL, {
      method: 'post',
      body: JSON.stringify([{ deviant: galleryName, mode: galleryType, priority: 110 }]),
      headers: { 'Content-Type': 'application/json' },
    })
    const msg = await resp.text()
    console.log({ galleryName, galleryType, msg })
    return message.say(`Added ${JSON.stringify({ galleryName, galleryType, msg })} to ripper queue`)
  }
}
