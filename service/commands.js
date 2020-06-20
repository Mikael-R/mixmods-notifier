const Discord = require('discord.js')
const feedService = require('./feed')
const channelRepository = require('../repository/channel-repository')

ajuda = () => {
  const embed = createEmbed()
  const message = []

  message.push(':purple_circle: **/mixmods ajuda**: Informa os comandos para utilização.')
  message.push(':purple_circle: **/mixmods ping**: Informa o ping do servidor e da api.'); ''
  message.push(':purple_circle: **/mixmods data**: Informa a data juntamente com a hora.')
  message.push(':purple_circle: **/mixmods post**: Informa o último post do blog.')
  message.push(':purple_circle: **/mixmods posts**: Informa os últimos 4 posts do blog.')
  message.push(':purple_circle: **/mixmods links**: Informa os links para o site e o fórum.')
  message.push(':purple_circle: **/mixmods post-timer status**: Verifica o estado do timer.')
  message.push(':purple_circle: **/mixmods post-timer on**: Liga o timer.')
  message.push(':purple_circle: **/mixmods post-timer off**: Desliga o timer.')

  embed.setDescription(message.join('\n\n'))

  return embed
}

ping = (msg, client) => {
  const embed = createEmbed()
  const message = []

  message.push(':ping_pong: Pong!')
  message.push(`:purple_circle: Server: ${Date.now() - msg.createdTimestamp}ms`)
  message.push(`:purple_circle: Api: ${client.ws.ping}ms`)

  embed.setDescription(message.join('\n\n'))

  return embed
}

data = () => {
  const embed = createEmbed()
  embed.setDescription(new Date())
  return embed
}

posts = async () => {
  const feed = await feedService.getFeed()

  if (!feed) return

  const embeds = []

  for (let n = 0; n < 4; n += 1) {
    embeds.push(createEmbedPost(feed.items[n]))
  }

  return embeds
}

post = async () => {
  const feed = await feedService.getFeed()

  if (!feed) return

  return createEmbedPost(feed.items[0])
}

createEmbedPost = (item) => {
  return createEmbed()
    .setDescription(feedService.parse(item))
    .setImage(feedService.getImageLink(item))
}

links = () => {
  const embed = createEmbed()
  const message = []

  message.push(':purple_circle: Site: https://mixmods.com.br')
  message.push(':purple_circle: Fórum: https://forum.mixmods.com.br')

  embed.setDescription(message.join('\n\n'))
  return embed
}

createEmbed = () => {
  return new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784')
}

getChannelValue = (id) => {
  if (!existChannel(id)) setChannelInDB(id)

  const channels = readDB().channels
  for (c in channels) {
    if (channels[c].id === id) {
      return {
        pos: c,
        id: channels[c].id,
        timer: channels[c].timer,
        last_title: channels[c].last_title
      }
    }
  }
}

setTimer = async (id, status) => {
  status = status === 'on'

  let channel = await channelRepository.findByChannelId(id)

  if (!channel) {
    channel = channelRepository.createChannel(id);
  }

  if (status && channel.isTimerOn) {
    const embed = createEmbed()
    embed.setDescription(':purple_circle: A notificação já está ativada.\n\n:purple_circle: Use ``/mixmods post-timer off`` para desativar.')
    return embed
  } else if (!status && !channel.isTimerOn) {
    const embed = createEmbed()
    embed.setDescription(':purple_circle: A notificação já está desativada.\n\n:purple_circle: Use ``/mixmods post-timer on`` para ativar.')
    return embed
  } else {
    channel.isTimerOn = status
    channelRepository.saveOrUpdate(channel)

    const embed = createEmbed()
    embed.setDescription(`:purple_circle: Notificação: **${status === true ? 'ON' : 'OFF'}**`)
    return embed
  }
}

turnTimer = (client) => {
  setInterval(async () => {
    const channelsWithTimer = await channelRepository.findByTimerOn()

    if (!channelsWithTimer.length) {
      console.log('Nenhum canal com timer habilitado')
      return
    }

    const feed = await feedService.getFeed()

    const channelsToSend = channelsWithTimer.filter(channel => channel.lastTitleReceived !== feed.items[0].title)

    if (!channelsToSend.length) {
      console.log('Channels do not need updating')
      return
    }

    const embed = createEmbedPost(feed.items[0])

    channelsToSend.forEach(channel => {
      console.log(`Post "${feed.items[0].title}" send to ${channel.id}`)

      channel.lastTitleReceived = feed.items[0].title
      channelRepository.updateChannel(channel)

      const discordChannel = client.channels.cache.get(channel.channelId)
      discordChannel.send(embed)
    })
  }, 10000)
}

timerOptions = async (id) => {
  const embed = createEmbed()

  const channel = await channelRepository.findByChannelId(id)

  const message = []

  message.push(`:purple_circle: Notificação: ${channel.isTimerOn ? '**ON**' : '**OFF**'}`)
  message.push(':purple_circle: Use ``/mixmods ajuda`` para ver os comandos.')

  embed.setDescription(message.join('\n\n'))

  return embed
}

module.exports = {
  ajuda,
  ping,
  data,
  posts,
  post,
  links,
  turnTimer,
  timerOptions,
  setTimer
}
