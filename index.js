const Discord = require('discord.js')
const commandService = require('./service/commands')

const dotenv = require('dotenv')
dotenv.config();

const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logado como ${client.user.tag}`)
})

client.on('message', (msg) => {

  const command = msg.content.toLocaleLowerCase().split(' ');

  if (command[0] !== '/mixmods') {
    return null
  }

  const method = command[1];

  if (!method) {
    const embed = new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');
    embed.setDescription(':purple_circle: Comando inválido, use **/mixmods ajuda** para ver a lista de comandos.')
    msg.channel.send(embed)
  } else {

    switch (method) {
      case 'ajuda':
        msg.channel.send(commandService.ajuda())
        break;

      case 'ping':
        msg.channel.send(commandService.ping(msg, client));
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
        msg.channel.send(commandService.links(client))
        break;

      case 'post-timer': 

        if (command[2] === 'on') {
          commandService.turnTimerOn(msg)
        } else if (command[2] === 'off') {
          commandService.turnTimerOff();
        }

        break;

    }
  }
})

client.login(process.env.TOKEN)
