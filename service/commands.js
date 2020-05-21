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
let last_title;

turnTimerOn = (msg) => {

    if (timer) {
        const embed = createEmbed();
        embed.setDescription(':purple_circle: A notificação já está ativada.\n\n:purple_circle: Use ``/mixmods post-timer off`` para desativar.')
        msg.channel.send(embed)
    } else {

        timer = setInterval(async () => {
            
            const feed = await feedService.getFeed();

            if (last_title === feed.items[0].title) {
                return;
            }

            last_title = feed.items[0].title;
            const message = feedService.parse(feed.items[0]);

            const embed = createEmbed();
            embed.setDescription(message)
            msg.channel.send(embed)

        }, 5000);
    }
}

turnTimerOff = () => {
    clearInterval(timer)
    timer = undefined
}

timerOptions = () => {
    const embed = createEmbed();

    const message = []

    message.push(':purple_circle: Use ``/mixmods post-timer on`` para ativar.')
    message.push(':purple_circle: Use ``/mixmods post-timer off`` para desativar.')

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