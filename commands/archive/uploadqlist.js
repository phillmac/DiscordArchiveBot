const { Command } = require('discord.js-commando')

module.exports = class MeowCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'uploadqlist',
      aliases: ['upload-queue-list', 'uql'],
      group: 'archive',
      memberName: 'uploadqlist',
      description: 'Enques an existing gallery to be uploaded to the archive site',
      guildOnly: true
    })
  }

  async run (message) {
    this.client.archive.uploadQueue.ensure(message.guild.id, [])
    const uploadQueue = new Set()
    await (this.client.archive.uploadQueue.get(message.guild.id)).forEach(item => uploadQueue.add(item))
    message.say('Upload queue contents:')
    return message.say(JSON.stringify(uploadQueue, null, 2))
  }
}
