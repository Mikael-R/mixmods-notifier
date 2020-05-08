const Discord =  require('discord.js')
const client = new Discord.Client()
require('dotenv/config')

client.login(process.env.TOKEN)


function dataAtual(){
    let data = new Date()
    return `[${data.getDate()}/${data.getMonth() + 1}/${data.getFullYear()} ${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}]`
}


client.on('ready', () => {
    console.log(dataAtual() + ' Online')
})

client.on('message', msg => {
    if (msg.content.toLocaleLowerCase().startsWith('$ajuda')) {
        msg.reply(`**
                                                    [Mixmods-Notifier]
:ballot_box_with_check: $ajuda: Informa os comandos para utilização.

:ballot_box_with_check: $dataAtual: Informa a data juntamente com a hora(horário do servidor do bot).
**`)
    }
})

client.on('message', msg => {
    if (msg.content.toLocaleLowerCase().startsWith('$dataatual')) {
        msg.reply(dataAtual())
    }
})
