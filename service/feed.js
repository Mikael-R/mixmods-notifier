const RssParser = require('rss-parser')
const parser = new RssParser()

getFeed = async () => await parser.parseURL('https://www.mixmods.com.br/feeds/posts/default?alt=rss')

module.exports = {
    getFeed
}