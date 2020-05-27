const Discord = require('discord.js')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const feedService = require('./feed')

const adapter = new FileSync('db.json')
const db = low(adapter)

createDB = () => {

  db.defaults({ channels: [] })
    .write()
}

readDB = () => {

  return db.value()
}

existChannel = (id) => {

  const channels = db.value().channels
  return channels.filter(channel => channel.id === id).length > 0
}

setChannelInDB = (id) => {

  const index = readDB().channels.length

  if (!existChannel(id)) {
    db.get('channels')
      .push({ pos: index, id: id, timer: false, last_title: null })
      .write()
  }
}

ajuda = () => {

  const embed = createEmbed();
  const message = [];

  message.push(`:purple_circle: **/mixmods ajuda**: Informa os comandos para utilização.`);
  message.push(`:purple_circle: **/mixmods ping**: Informa o ping do servidor e da api.`);
  message.push(`:purple_circle: **/mixmods data**: Informa a data juntamente com a hora.`);
  message.push(`:purple_circle: **/mixmods post**: Informa o último post do blog.`);
  message.push(`:purple_circle: **/mixmods posts**: Informa os últimos 4 posts do blog.`);
  message.push(`:purple_circle: **/mixmods links**: Informa os links para o site e o fórum.`);
  message.push(`:purple_circle: **/mixmods post-timer status**: Verifica o estado do timer.`);
  message.push(`:purple_circle: **/mixmods post-timer on**: Liga o timer.`);
  message.push(`:purple_circle: **/mixmods post-timer off**: Desliga o timer.`);

  embed.setDescription(message.join('\n\n'));

  return embed;
}

ping = (msg, client) => {

  const embed = createEmbed();
  const message = [];

  message.push(`:ping_pong: Pong!`)
  message.push(`:purple_circle: Server: ${Date.now() - msg.createdTimestamp}ms`)
  message.push(`:purple_circle: Api: ${client.ws.ping}ms`)

  embed.setDescription(message.join('\n\n'));

  return embed;
}

data = () => {

  const embed = createEmbed();
  embed.setDescription(new Date());
  return embed;
}

posts = async () => {

  const feed = await feedService.getFeed();

  if (!feed) return;

  const embeds = [];

  for (let n = 0; n < 4; n += 1) {
    embeds.push(createEmbedPost(feed.items[n]))
  }

  return embeds;
}

post = async () => {

  const feed = await feedService.getFeed();

  if (!feed) return;

  return createEmbedPost(feed.items[0]);
}

createEmbedPost = (item) => {

  return createEmbed()
    .setDescription(feedService.parse(item))
    .setImage(feedService.getImageLink(item));
}

links = () => {

  const embed = createEmbed();
  const message = [];

  message.push(`:purple_circle: Site: https://mixmods.com.br`)
  message.push(`:purple_circle: Fórum: https://forum.mixmods.com.br`)

  embed.setDescription(message.join('\n\n'));
  return embed;
}

createEmbed = () => {

  return new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');
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

setTimer = (id, status) => {

  status = status === 'on'

  const channelDB = getChannelValue(id)

  if (status && channelDB.timer) {

    const embed = createEmbed();
    embed.setDescription(':purple_circle: A notificação já está ativada.\n\n:purple_circle: Use ``/mixmods post-timer off`` para desativar.')
    return embed

  } else if (status === false && channelDB.timer === false) {

    const embed = createEmbed();
    embed.setDescription(':purple_circle: A notificação já está desativada.\n\n:purple_circle: Use ``/mixmods post-timer on`` para ativar.')
    return embed

  } else {

    if (status === true) {
      db.set(`channels[${channelDB.pos}].timer`, true).write()
    } else {
      db.set(`channels[${channelDB.pos}].timer`, false).write()
    }

    const embed = createEmbed();
    embed.setDescription(`:purple_circle: Notificação: **${status === true ? 'ON' : 'OFF'}**`)
    return embed
  }
}

turnTimer = (client) => {

  const timer = setInterval(async () => {

    for (c in readDB().channels) {
      const channel = client.channels.cache.get(readDB().channels[c].id)

      const channelDB = getChannelValue(channel.id)

      const feed = await feedService.getFeed()

      if (channelDB.timer === true && channelDB.last_title !== feed.items[0].title) {

        console.log(`Post "${feed.items[0].title}" send to ${channelDB.id}`)

        const embed = createEmbedPost(feed.items[0])
        channel.send(embed)

        db.set(`channels[${channelDB.pos}].last_title`, feed.items[0].title).write();

      }
    }
  }, 10000);
}

timerOptions = (id) => {

  const embed = createEmbed();

  const message = []

  message.push(`:purple_circle: Notificação: ${getChannelValue(id).timer === true ? '**ON**' : '**OFF**'}`)
  message.push(':purple_circle: Use ``/mixmods ajuda`` para ver os comandos.')

  embed.setDescription(message.join('\n\n'))

  return embed;
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
  createDB,
  setChannelInDB,
  setTimer
}
