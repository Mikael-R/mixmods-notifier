const Channel = require('../model/channel')

createChannel = (channelId) => {
  return new Channel({
    channelId: channelId,
    isTimerOn: false
  })
}

createIfNotExists = (channelId) => {
  Channel.find({ channelId: channelId }, (err, docs) => {
    if (!docs.length) {
      const newChannel = createChannel(channelId)
      saveOrUpdate(newChannel)
    }
  })
}

saveOrUpdate = (channel) => {

  Channel.findOne({ _id: channel._id}, (err, res) => {
    if (!res) {
      console.log(`Saving new channel`)
      channel.save().then(() => console.log('Channel salved')).catch(err => console.log(`Error to salve channel ${err}`))
    } else {
      console.log(`Saving existing channel`)
      updateChannel(channel)
    }
  })
}

updateChannel = (channel) => {
  Channel.updateOne({ _id: channel._id }, channel).then(() => console.log('Channel updated')).catch(err => console.log(`Error to update channel ${err}`))
}

findByChannelId = (channelId) => Channel.findOne({ channelId: channelId })

findByTimerOn = () => Channel.find({ isTimerOn: true })

module.exports = {
  createChannel,
  createIfNotExists,
  saveOrUpdate,
  updateChannel,
  findByChannelId,
  findByTimerOn
}
