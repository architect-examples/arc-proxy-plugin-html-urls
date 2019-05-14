let cheerio = require('cheerio')
/**
 * arc-proxy-plugin-html-urls
 *
 * @param Key - the requested S3 Key
 * @param File - the file contents {headers, body}
 * @returns File - the processed file contents {header, body}
 */
module.exports = function html(Key, {headers, body}) {
  // early exit if running local
  if (process.env.NODE_ENV === 'testing')
    return {headers, body}
  // sort out prefix
  let prefix = ''
  if (process.env.NODE_ENV === 'staging')
    prefix = '/staging'
  if (process.env.NODE_ENV === 'production')
    prefix = '/production'
  // parse the html
  let $ = cheerio.load(body)
  // links are element.attribute that can make requests
  let links = [
    'a.href',
    'form.action',
    'img.src',
    'link.href',
    'script.src',
    'iframe.src'
  ]
  // walk the links
  links.forEach(link=> {
    let element = link.split('.')[0]
    let attribute = link.split('.')[1]
    // collect the elements
    $(element).each(function() {
      // rewrite the element attribute
      let val =  $(this).attr(attribute)
      let url = prefix + val
      if (val && !val.startsWith('http')) {
        $(this).attr(attribute, url)
      }
    })
  })
  return {
    headers: {...headers, 'content-type':'text/html;charset=utf8'},
    body: $.html()
  }
}
