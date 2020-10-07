const { Command } = require('discord.js-commando')

module.exports = class UploadQueueAddCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'uploadqadd',
      aliases: ['upload-queue-add', 'uqa'],
      group: 'archive',
      memberName: 'uploadqadd',
      description: 'Enques an existing gallery to be uploaded to the archive site',
      guildOnly: true,
      args: [
        {
          key: 'galleryName',
          prompt: 'Name of gallery to add to the upload queue',
          type: 'string'
        },
        {
          key: 'galleryType',
          prompt: 'Type of gallery to add to the upload queue',
          type: 'string',
          oneOf: ['gallery', 'favs']
        }
      ]
    })
  }

  run (message, { galleryName, galleryType }) {
    this.client.archive.uploadQueue.ensure(message.guild.id, [])
    this.client.archive.uploadQueue.push(message.guild.id, { galleryName, galleryType }, null, false)
    return message.say(`Added \`${galleryName} ${galleryType}\` to upload queue`)
  }
}
