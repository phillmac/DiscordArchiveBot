const { Command } = require('discord.js-commando')
const fetch = require('node-fetch')
const logger = require('winston')

if (!process.env.RIPER_QUEUE_QUERY_URL) {
  throw new Error('RIPER_QUEUE_QUERY_URL is required')
}

function filterStats(stats, filter) {

  const filterMatches = (s) => {
    for (const prop of Object.keys(filter)) {
      if (s[prop] !== filter[prop]) return false
    }
    return true
  }
  return stats.filter((s) => filterMatches(s))
}

function collateStats(stats) {
  const mode = {}
  const priority = {}
  for (const s of stats) {
    if (!mode[s.mode]) mode[s.mode] = []
    if (!priority[s.priority]) priority[s.priority] = []

    mode[s.mode].push(s)
    priority[s.priority].push(s)


  }
  return { mode, priority }
}

function formatStats({ mode, priority }, filter) {
  const results = []
  results.push('*Mode*:')
  for (const m of Object.keys(mode)) {
    results.push(`\t**${m}**: \`${mode[m].lenght}\``)
    if (filter?.mode) {
      for (const fm of mode[m]) {
        results.push(`\t\t${fm?.deviant} ${fm?.mval} ${fm?.priority}`)
      }
    }
  }
  results.push('*Priority*:')
  for (const p of Object.keys(priority)) {
    results.push(`\t**${p}**: \`${priority[p].lenght}\``)
    if (filter?.priority) {
      for (const fp of priority[p]) {
        results.push(`\t\t${fp?.deviant} ${fp?.mode} ${fp?.mval}`)
      }
    }

  }
  return results
}

module.exports = class RipperQueueStatsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ripqstats',
      aliases: ['rip-queue-stats', 'rqs'],
      group: 'archive',
      memberName: 'ripqstats',
      description: 'Disiplays rip queue statistics',
      guildOnly: false,
      args: [
        {
          key: 'mode',
          prompt: 'Mode filter stats in the rip queue',
          type: 'string',
          default: undefined
        },
        {
          key: 'priority',
          prompt: 'Priority filter stats in the rip queue',
          type: 'integer',
          default: undefined
        }
      ]
    })
  }

  async run(message, { mode, priority }) {
    try {
      const resp = await fetch(process.env.RIPER_QUEUE_QUERY_URL)
      if (resp.status === 200) {
        const stats = await resp.json()
        const filtered = filterStats(stats, { mode, priority })
        const collated = collateStats(filtered)
        const formatted = formatStats(collated, { mode, priority })
        return message.say(formatted.join('\n'))
      }
    } catch (err) {
        logger.error(err.toString())
      }
      return message.say('Error: Unable to query queue manager.')
    }
}
