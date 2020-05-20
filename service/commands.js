const Discord = require('discord.js')
const feedService = require('./feed')

ajuda = () => {
    const embed = createEmbed();
    const message = [];

    message.push(`:purple_circle: **/mixmods ajuda**: Informa os comandos para utilização.`);
    message.push(`:purple_circle: **/mixmods ping**: Informa o ping do servidor e da api.`);
    message.push(`:purple_circle: **/mixmods data**: Informa a data juntamente com a hora.`);
    message.push(`:purple_circle: **/mixmods post**: Informa o último post do blog.`);
    message.push(`:purple_circle: **/mixmods links**: Informa os links para o site e o fórum.`);

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
    const embeds = [];

    for (let n = 0; n < 4; n += 1) {

        const embed = createEmbed();
        const message = [];

        let categorias = '| '
        for (const c in feed.items[n].categories) {
            categorias += feed.items[n].categories[c]._ + ' | '
        }

        message.push(`:purple_circle: **Título**: ${feed.items[n].title}`)
        message.push(`:purple_circle: **Link**: ${feed.items[n].link}`)
        message.push(`:purple_circle: **Categorias**: ${categorias}`)
        message.push(`:purple_circle: **Publicado**: ${feed.items[n].pubDate.substr(5, 3) + ' ' + feed.items[n].pubDate.substr(8, 9)}`)

        embed.setDescription(message.join('\n\n'))

        embeds.push(embed)
    }

    return embeds;
}

post = async () => {

    const feed = await feedService.getFeed();
    const embed = createEmbed();
    const message = [];

    let categorias = '| '
    for (const c in feed.items[0].categories) {
        categorias += feed.items[0].categories[c]._ + ' | '
    }

    message.push(`:purple_circle: **Título**: ${feed.items[0].title}`)
    message.push(`:purple_circle: **Link**: ${feed.items[0].link}`)
    message.push(`:purple_circle: **Categorias**: ${categorias}`)
    message.push(`:purple_circle: **Publicado**: ${feed.items[0].pubDate.substr(5, 3) + ' ' + feed.items[0].pubDate.substr(8, 9)}`)

    embed.setDescription(message.join('\n\n'))

    return embed;
}

links = (client) => {

    const embed = createEmbed();
    const message = [];

    message.push(`:purple_circle: Site: https://mixmods.com.br`)
    message.push(`:purple_circle: Fórum: https://forum.mixmods.com.br`)
    message.push(`:purple_circle: Api: ${client.ws.ping}ms`)

    embed.setDescription(message.join('\n\n'));
    return embed;
}

createEmbed = () => {
    return new Discord.MessageEmbed().setTitle('[Mixmods-Notifier]').setColor('#4e4784');
}

let timer;

turnTimerOn = (msg) => {

    if (timer) {
        const embed = createEmbed();
        embed.setDescription(':purple_circle: A notificação já está ativada.\n\n:purple_circle: Use ``/mixmods post-timer off`` para desativar.')
        msg.channel.send(embed)
    } else {
        timer = setInterval(() => {
            post().then(embed => msg.channel.send(embed))
        }, 5000);
    }
}

turnTimerOff = () => {
    clearInterval(timer)
    timer = undefined
}

module.exports = {
    ajuda,
    ping,
    data,
    posts,
    post,
    links,
    turnTimerOn,
    turnTimerOff
}