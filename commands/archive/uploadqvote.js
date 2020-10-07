const { Command } = require('discord.js-commando')

module.exports = class UploadQueueVoteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'uploadqvote',
      aliases: ['upload-queue-vote', 'uqv'],
      group: 'archive',
      memberName: 'uploadqvote',
      description: 'Requests a vote on which gallery to upload to the archive next',
      guildOnly: true
    })
  }

  run (message) {
    this.client.archive.uploadQueue.ensure(message.guild.id, [])
    const uploadQueue = [...this.client.archive.uploadQueue.get(message.guild.id)]
    if(uploadQueue.length > 0) {
      message.say(`/poll Vote on what to upload next! ${uploadQueue.map(qi => `${qi.galleryName}:${qi.galleryType}`).join(' ')}`)
    } else {
      return message.say('Upload queue is empty! Add some items first.')
    }
  }
}
