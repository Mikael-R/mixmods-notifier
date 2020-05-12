const Discord = require('discord.js')
const RssParser = require('rss-parser')
require('dotenv/config')

const client = new Discord.Client()
const parser = new RssParser()

client.on('ready', () => {
  // informações do bot quando está online //
  console.log(`[${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}] Logado como ${client.user.tag}`)
})

client.on('message', async (msg) => {
  const feed = await parser.parseURL('https://www.mixmods.com.br/feeds/posts/default?alt=rss')
  const embed = new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784') // definições do embed //

  if (msg.content.toLocaleLowerCase().split(' ')[0] !== '/mixmods') {
    // verifica se a mensagem é um comando //
    return null
  } else if (msg.content.toLocaleLowerCase() === '/mixmods ajuda') {
    // informa os comandos //
    embed.setDescription(`
:purple_circle: **/mixmods ajuda**: Informa os comandos para utilização.

:purple_circle: **/mixmods ping**: Informa o ping do servidor e da api.

:purple_circle: **/mixmods data**: Informa a data juntamente com a hora.

:purple_circle: **/mixmods posts**: Informa os 4 últimos posts do blog.

:purple_circle: **/mixmods post**: Informa o último post do blog.

:purple_circle: **/mixmods links**: Informa os links para o site e o fórum.
        `)
    msg.channel.send(embed)
  } else if (msg.content.toLocaleLowerCase() === '/mixmods ping') {
    // informa o ping do servidor e da api //
    embed.setDescription(`
:ping_pong: Pong!

:purple_circle: Server: ${Date.now() - msg.createdTimestamp}ms

:purple_circle: Api: ${client.ws.ping}ms
        `)
    msg.channel.send(embed)
  } else if (msg.content.toLocaleLowerCase() === '/mixmods data') {
    // informa a data //
    embed.setDescription(`Neste momento estou operando no dia ${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} as ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
    msg.channel.send(embed)
  } else if (msg.content.toLocaleLowerCase() === '/mixmods posts') {
    // informa os 4 últimos posts //
    for (let n = 0; n < 4; n += 1) {
      // máximo de 25 posts(0 a 24) //
      let categorias = '| '
      for (const c in feed.items[n].categories) {
        categorias += feed.items[n].categories[c]._ + ' | '
      }
      embed.setDescription(`
:purple_circle: **Título**: ${feed.items[n].title}

:purple_circle: **Link**: ${feed.items[n].link}

:purple_circle: **Categorias**: ${categorias}

:purple_circle: **Publicado**: ${feed.items[n].pubDate.substr(5, 3) + ' ' + feed.items[n].pubDate.substr(8, 9)}`)
      msg.channel.send(embed)
    }
  } else if (msg.content.toLocaleLowerCase() === '/mixmods post') {
    // informa o último post //
    let categorias = '| '
    for (const c in feed.items[0].categories) {
      categorias += feed.items[0].categories[c]._ + ' | '
    }
    embed.setDescription(`
:purple_circle: **Título**: ${feed.items[0].title}

:purple_circle: **Link**: ${feed.items[0].link}

:purple_circle: **Categorias**: ${categorias}

:purple_circle: **Publicado**: ${feed.items[0].pubDate.substr(5, 3) + ' ' + feed.items[0].pubDate.substr(8, 9)}
`)
    msg.channel.send(embed)
  } else if (msg.content.toLocaleLowerCase() === '/mixmods links') {
    // informa o link para o site e o fórum //
    embed.setDescription(`
:purple_circle: Site: https://mixmods.com.br

:purple_circle: Fórum: https://forum.mixmods.com.br
        `)
    msg.channel.send(embed)
  } else {
    // mensagem de erro //
    embed.setDescription(':purple_circle: Comando inválido, use **/mixmods ajuda** para ver a lista de comandos.')
    msg.channel.send(embed)
  }
})

client.login(process.env.TOKEN)
