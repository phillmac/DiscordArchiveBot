const { Command } = require('discord.js-commando')

function getRandom (arr, n) {
  const result = new Array(n)
  let len = arr.length
  const taken = new Array(len)
  if (n > len) { throw new RangeError('getRandom: more elements taken than available') }
  while (n--) {
    const x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

module.exports = class UploadQueueVoteCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'uploadqvote',
      aliases: ['upload-queue-vote', 'uqv'],
      group: 'archive',
      memberName: 'uploadqvote',
      description: 'Requests a vote on which gallery to upload to the archive next',
      guildOnly: true,
      args: [{
        key: 'voteSize',
        prompt: 'Amount of items to select for voting',
        type: 'integer',
        default: 10
      }]
    })
  }

  run (message, { voteSize }) {
    this.client.archive.uploadQueue.ensure(message.guild.id, [])
    const uploadQueue = [...this.client.archive.uploadQueue.get(message.guild.id)]
    if (uploadQueue.length > 0) {
      const amount = voteSize <= uploadQueue.length ? voteSize : uploadQueue.length
      const selection = getRandom(uploadQueue, amount).sort()
      message.say(`/poll "Vote on what to upload next!" ${selection.map(qi => `"${qi.galleryName} ${qi.galleryType}"`).join(' ')}`)
    } else {
      return message.say('Upload queue is empty! Add some items first.')
    }
  }
}
