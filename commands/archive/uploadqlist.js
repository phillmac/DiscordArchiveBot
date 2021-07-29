const { Command } = require('discord.js-commando')

module.exports = class UploadQueueListCommand extends Command {
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
    const uploadQueue = this.client.archive.uploadQueue.get(message.guild.id)
    await message.say(`***Upload queue contents***:\n${uploadQueue.map(qi => `\`${uploadQueue.indexOf(qi)}). ${qi.galleryName} ${qi.galleryType}\``).join('\n')}`)
  }
}
