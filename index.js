const Discord =  require('discord.js')
const client = new Discord.Client()
require('dotenv/config')

client.login(process.env.TOKEN)

client.on('ready', () => {
    console.log(new Date().toLocaleString('pt-BR', { timeZome: 'UTC-3'}) + ' Online')
})

client.on('message', msg => {
    if (msg.content.toLocaleLowerCase().startsWith('$ajuda')) {
        msg.reply(`**
                                                    [Mixmods-Notifier]
:ballot_box_with_check: $ajuda: Informa os comandos para utilização.

:ballot_box_with_check: $dataAtual: Informa a data juntamente com a hora(UTC-3).
**`)
    }
})

client.on('message', msg => {
    if (msg.content.toLocaleLowerCase().startsWith('$dataatual')) {
        msg.reply(new Date().toLocaleString('pt-BR', { timeZome: 'UTC-3'}))
    }
})
