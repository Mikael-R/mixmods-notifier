const RssParser = require('rss-parser')
const parser = new RssParser()
const { JSDOM } = require('jsdom')

getFeed = async () => {
  try {
    return await parser.parseURL('https://www.mixmods.com.br/feeds/posts/default?alt=rss')
  } catch (ex) {
    console.log(ex)
    return null;
  }
}

parse = (item) => {
  const message = [];

  const categorias = item.categories.reduce((acc, curr) => acc + ' | ' + curr._, '| ') + ' | ';

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
