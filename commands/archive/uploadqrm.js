const { Command } = require('discord.js-commando')

module.exports = class UploadQueueRemoveCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'uploadqrm',
      aliases: ['upload-queue-remove', 'uqr'],
      group: 'archive',
      memberName: 'uploadqrm',
      description: 'Removes a gallery from the archive upload queue',
      guildOnly: true,
      args: [
        {
          key: 'galleryName',
          prompt: 'Name of gallery to remove from the upload queue',
          type: 'string'
        },
        {
          key: 'galleryType',
          prompt: 'Type of gallery to remove from the upload queue',
          type: 'string',
          oneOf: ['gallery', 'favs']
        }
      ]
    })
  }

  run (message, { galleryName, galleryType }) {
    this.client.archive.uploadQueue.ensure(message.guild.id, [])
    this.client.archive.uploadQueue.remove(message.guild.id, (i) => i.galleryName === galleryName && i.galleryType === galleryType)
    return message.say(`Removed \`${galleryName} ${galleryType}\` from upload queue`)
  }
}
