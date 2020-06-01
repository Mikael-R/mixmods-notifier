const Channel = require('../model/channel');

createIfNotExists = (newChannelId) => {

    Channel.find({ channelId: newChannelId }, (err, docs) => {

        if (!docs.length) {
            new Channel({
                channelId: newChannelId,
                isTimerOn: false,
            }).save().then(() => console.log('canal salvo com sucesso')).catch(err => console.log(`Erro ao salvar canal ${err}`))
        }
    })
}

updateChannel = (channel) => {
    Channel.updateOne({ _id: channel._id }, channel).then(() => console.log('canal atualizado com sucesso')).catch(err => console.log(`Erro ao atualizar canal ${err}`))
}

findByChannelId = (channelId) => Channel.findOne({ channelId: channelId })

findByTimerOn = () => Channel.find({ isTimerOn: true })

module.exports = {
    createIfNotExists,
    updateChannel,
    findByChannelId,
    findByTimerOn
}