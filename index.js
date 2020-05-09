const Discord =  require('discord.js')
const client = new Discord.Client()
const RssParser = require('rss-parser')
const parser = new RssParser()

require('dotenv/config')

client.on('ready', () => { // informações do bot quando está online //
    console.log(`[${new Date().toLocaleString('pt-BR')}] ${client.user.tag}`)
})

client.on('message', async msg => { // informa os comandos //
    if (msg.content.toLocaleLowerCase() == '/mixmods ping') { // testar //
        msg.channel.send('pong')
    }
    if (msg.content.toLocaleLowerCase() == '/mixmods ajuda') { // informa os comandos //
        msg.channel.send(`
**======================= [Mixmods-Notifier] =======================**
:white_check_mark: **/mixmods ajuda**: Informa os comandos para utilização.

:white_check_mark: **/mixmods data**: Informa a data juntamente com a hora(UTC-3).

:white_check_mark: **/mixmods posts**: Informa os 4 últimos posts do blog.

:white_check_mark: **/mixmods post**: Informa o último post do blog.
`)
    }
    if (msg.content.toLocaleLowerCase() == '/mixmods data') { // informa a data(UTC-3) //
        msg.channel.send(`Neste momento estou operando no dia ${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} as ${new Date().getHours() + 3}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
    }
    if (msg.content.toLocaleLowerCase() == '/mixmods posts') { // informa os 4 últimos posts //
        let feed = await parser.parseURL('https://www.mixmods.com.br/feeds/posts/default?alt=rss')
        for (let n = 0; n < 4; n++) { // máximo 25 posts(0 a 24) //
            let categorias = ''
            for (let c in feed.items[n].categories) {
              categorias += feed.items[n].categories[c]._ + ' | '
            }
            msg.channel.send(`
**======================= [Mixmods-Notifier] =======================**
● Título: ${feed.items[n].title}
● Link: ${feed.items[n].link}
● Categorias: ${categorias}
● Publicado: ${String(feed.items[n].pubDate.substr(5,3)) + ' ' + feed.items[n].pubDate.substr(8,9)}
            `)
          }
    }
    if (msg.content.toLocaleLowerCase() == '/mixmods post') { // informa o último post //
        let feed = await parser.parseURL('https://www.mixmods.com.br/feeds/posts/default?alt=rss')
        let categorias = ''
        for (let c in feed.items[0].categories) {
            categorias += feed.items[0].categories[c]._ + ' |'
        }
        msg.channel.send(`
**======================= [Mixmods-Notifier] =======================**
● Título: ${feed.items[0].title}
● Link: ${feed.items[0].link}
● Categorias: ${categorias}
● Publicado: ${String(feed.items[0].pubDate.substr(5,3)) + ' ' + feed.items[0].pubDate.substr(8,9)}
        `)
    }
})

client.login(process.env.TOKEN)
