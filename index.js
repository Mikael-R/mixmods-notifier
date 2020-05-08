const Discord =  require('discord.js')
const client = new Discord.Client()
require('dotenv/config')

client.login(process.env.TOKEN)

client.on('ready', () => {
    console.log(new Date().toLocaleString('pt-BR') + ' Online')
})

client.on('message', msg => {
    if (msg.content.toLocaleLowerCase() == '/mixmods ajuda') {
        msg.reply(`**
                                                    [Mixmods-Notifier]
:ballot_box_with_check: /mixmods ajuda: Informa os comandos para utilização.

:ballot_box_with_check: /mixmods data: Informa a data juntamente com a hora(UTC-3).
**`)
    }
    if (msg.content.toLocaleLowerCase() == '/mixmods data') {
        msg.reply(new Date().toLocaleString('pt-BR'))
    }
})
