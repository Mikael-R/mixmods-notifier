const Channel = require('../model/channel')

createIfNotExists = (newChannelId) => {
  Channel.find({ channelId: newChannelId }, (err, docs) => {
    if (!docs.length) {
      new Channel({
        channelId: newChannelId,
        isTimerOn: false
      }).save().then(() => console.log('Channel salved')).catch(err => console.log(`Error to salve channel ${err}`))
    }
  })
}

updateChannel = (channel) => {
  Channel.updateOne({ _id: channel._id }, channel).then(() => console.log('Channel updated')).catch(err => console.log(`Error to update channel ${err}`))
}

findByChannelId = (channelId) => Channel.findOne({ channelId: channelId })

findByTimerOn = () => Channel.find({ isTimerOn: true })

module.exports = {
  createIfNotExists,
  updateChannel,
  findByChannelId,
  findByTimerOn
}
