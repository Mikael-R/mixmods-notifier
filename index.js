const dotenv = require('dotenv')
dotenv.config();

require('./database/connection')

const Discord = require('discord.js')
const commandService = require('./service/commands')
const channelRepository = require('./repository/channel-repository')


const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity('informações para todos os cantos!')
  console.log(`Started | ${client.user.tag}`)

  client.channels.cache.forEach(c => channelRepository.createIfNotExists(c.id))

  commandService.turnTimer(client);
})

client.on('message', (msg) => {
  const command = msg.content.toLocaleLowerCase()
  const flag = command.split(' ')[0]

  if (flag !== '/mixmods') {
    return null
  }

  if (!command.split(' ')[1]) {
    const embed = new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');
    embed.setDescription(':purple_circle: Nenhum parâmetro informado.\n\n:purple_circle: Use **/mixmods ajuda** para ver a lista de comandos.');
    msg.channel.send(embed);
  } else {

    const embed = new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');

    switch (command) {

      case '/mixmods ajuda':
        msg.channel.send(commandService.ajuda());
        break;

      case '/mixmods ping':
        msg.channel.send(commandService.ping(msg, client));
        break;

      case '/mixmods data':
        msg.channel.send(commandService.data());
        break;

      case '/mixmods posts':
        commandService.posts().then(embeds => {
          embeds.forEach(embed => msg.channel.send(embed));
        });
        break;

      case '/mixmods post':
        commandService.post().then(embed => {
          msg.channel.send(embed);
        });
        break;

      case '/mixmods links':
        msg.channel.send(commandService.links());
        break;

      case '/mixmods post-timer':
        embed.setDescription(':purple_circle: Nenhum parâmetro informado.\n\n:purple_circle: Use **/mixmods ajuda** para ver a lista de comandos.');
        msg.channel.send(embed);
        break;

      case '/mixmods post-timer on':
        commandService.setTimer(msg.channel.id, 'on').then(embed => msg.channel.send(embed));
        break;

      case '/mixmods post-timer off':
        commandService.setTimer(msg.channel.id, 'off').then(embed => msg.channel.send(embed));
        break;

      case '/mixmods post-timer status':
        msg.channel.send(commandService.timerOptions(msg.channel.id));
        break;

      default:
        embed.setDescription(':purple_circle: Comando inválido.\n\n:purple_circle: Use **/mixmods ajuda** para ver a lista de comandos.')
        msg.channel.send(embed);
    }
  }
})

client.login(process.env.TOKEN)
