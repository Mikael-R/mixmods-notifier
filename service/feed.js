const RssParser = require('rss-parser')
const parser = new RssParser()
const { JSDOM } = require('jsdom')

getFeed = async () => await parser.parseURL('https://www.mixmods.com.br/feeds/posts/default?alt=rss')

parse = (item) => {
    const message = [];

    let categorias = '| '
    for (const c in item.categories) {
        categorias += item.categories[c]._ + ' | '
    }

    message.push(`:purple_circle: **Título**: ${item.title}`)
    message.push(`:purple_circle: **Link**: ${item.link}`)
    message.push(`:purple_circle: **Categorias**: ${categorias}`)
    message.push(`:purple_circle: **Publicado**: ${item.pubDate.substr(5, 3) + ' ' + item.pubDate.substr(8, 9)}`)

    return message.join('\n\n');
}

getImageLink = (item) => {
    const dom = new JSDOM(item.content);
    const img = dom.window.document.querySelector('img');
    return img ? img.src : null;
}

module.exports = {
    getFeed,
    parse,
    getImageLink
}
