const Discord = require('discord.js')
const commandService = require('./service/commands')

const dotenv = require('dotenv')
dotenv.config();

const client = new Discord.Client()

client.on('ready', () => {
  client.user.setActivity('Vendo os novos posts da MixMods')
  console.log(`Logado como ${client.user.tag}`)

  // create database if dont exists //
  commandService.createDB()

  // define the server channels that the bot is in the database //
  client.channels.cache.forEach(c => {
    commandService.setChannelInDB(c.id)
  })

  // activating the timer //
  commandService.turnTimer(client)

})

client.on('message', (msg) => {
  const command = msg.content.toLocaleLowerCase().split(' ');

  if (command[0] !== '/mixmods') {
    return null
  }

  const method = command[1];

  if (!method) {
    const embed = new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');
    embed.setDescription(':purple_circle: Nenhum parâmetro passado, use **/mixmods ajuda** para ver a lista de comandos.')
    msg.channel.send(embed);
  } else {

    switch (method) {

      case 'ajuda':
        msg.channel.send(commandService.ajuda())
        break;

      case 'ping':
        msg.channel.send(commandService.ping(msg, client));
        break;

      case 'data':
        msg.channel.send(commandService.data());
        break;

      case 'posts':
        commandService.posts().then(embeds => {
          embeds.forEach(embed => msg.channel.send(embed));
        });
        break;

      case 'post':
        commandService.post().then(embed => {
          msg.channel.send(embed);
        });
        break;

      case 'links':
        msg.channel.send(commandService.links())
        break;

      case 'post-timer':
        if (command[2] === 'on' || command[2] === 'off') {
          msg.channel.send(commandService.setTimer(msg.channel.id, command[2]));
          break
        } else if (command[2] === 'status') {
          msg.channel.send(commandService.timerOptions(msg.channel.id));
          break
        } else {
          const embed = new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');
          embed.setDescription(':purple_circle: Nenhum parâmetro passado, use **/mixmods ajuda** para ver a lista de comandos.')
          msg.channel.send(embed);
          break
        }

      default:
        const embed = new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');
        embed.setDescription(':purple_circle: Comando inválido, use **/mixmods ajuda** para ver a lista de comandos.')
        msg.channel.send(embed);
    }
  }
})

client.login(process.env.TOKEN)
