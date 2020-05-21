const Discord = require('discord.js')
const feedService = require('./feed')

ajuda = () => {
    const embed = createEmbed();
    const message = [];

    message.push(`:purple_circle: **/mixmods ajuda**: Informa os comandos para utilização.`);
    message.push(`:purple_circle: **/mixmods ping**: Informa o ping do servidor e da api.`);
    message.push(`:purple_circle: **/mixmods data**: Informa a data juntamente com a hora.`);
    message.push(`:purple_circle: **/mixmods post**: Informa o último post do blog.`);
    message.push(`:purple_circle: **/mixmods posts**: Informa os últimos 4 posts do blog.`);
    message.push(`:purple_circle: **/mixmods links**: Informa os links para o site e o fórum.`);
    message.push(`:purple_circle: **/mixmods post-timer on**: Liga o timer para verificar o último post a cada 5 segundos.`);
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
    const embeds = [];

    for (let n = 0; n < 4; n += 1) {

        const embed = createEmbed();
        const message = feedService.parse(feed.items[n]);
        embed.setDescription(message)

        embeds.push(embed)
    }

    return embeds;
}

post = async () => {

    const feed = await feedService.getFeed();
    const embed = createEmbed();
    embed.setDescription(feedService.parse(feed.items[0]));
    return embed;
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

turnTimerOn = (msg, postTimer) => {

    if (postTimer.timer) {
        const embed = createEmbed();
        embed.setDescription(':purple_circle: A notificação já está ativada.\n\n:purple_circle: Use ``/mixmods post-timer off`` para desativar.')
        msg.channel.send(embed)
    } else {

        const embed = createEmbed();
        embed.setDescription(':purple_circle: Notificação: on.')
        msg.channel.send(embed)

        postTimer.timer = setInterval(async () => {

            const feed = await feedService.getFeed();

            if (postTimer.last_title === feed.items[0].title) {
                return;
            }

            postTimer.last_title = feed.items[0].title;
            const message = feedService.parse(feed.items[0]);

            const embed = createEmbed();
            embed.setDescription(message)
            msg.channel.send(embed)

        }, 5000);
    }
}

turnTimerOff = (msg, postTimer) => {

    clearInterval(postTimer.timer)
    postTimer.timer = undefined
    
    const embed = createEmbed();
    embed.setDescription(':purple_circle: Notificação: off.')
    msg.channel.send(embed)
}

timerOptions = (postTimer) => {
    const embed = createEmbed();

    const message = []

    message.push(`:purple_circle: Notificação: ${postTimer.timer ? 'on' : 'off'}.`)
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
    turnTimerOn,
    turnTimerOff,
    timerOptions
}