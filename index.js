const Discord =  require('discord.js')
const client = new Discord.Client()
require('dotenv/config')

client.on('ready', () => {
    console.log(`[${new Date().toLocaleString('pt-BR')}] ${client.user.tag}`)
})

client.on('message', msg => {
    if (msg.content.toLocaleLowerCase() == '/mixmods ajuda') {
        msg.channel.send(`
**======================= [Mixmods-Notifier] =======================**
:white_check_mark: **/mixmods ajuda**: Informa os comandos para utilização.

:white_check_mark: **/mixmods data**: Informa a data juntamente com a hora(UTC-3).
`)
    }
    if (msg.content.toLocaleLowerCase() == '/mixmods data') {
        msg.channel.send(`Neste momento estou operando no dia ${new Date().getDay()}/${new Date().getMonth()}/${new Date().getFullYear()} as ${new Date().getHours() + 3}:${new Date().getMinutes()}:${new Date().getSeconds()}`)
    }
    if (msg.content.toLocaleLowerCase() == '/mixmods ping') {
        msg.channel.send('pong')
    }
})

client.login(process.env.TOKEN)
