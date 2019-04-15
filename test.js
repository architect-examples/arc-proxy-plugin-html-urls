let test = require('tape')
let plugin = require('./index') // note package.json "main" points to dist

test('env', t=> {
  t.plan(1)
  t.ok(plugin, 'exists')
})

test('returns {body, headers}', t=> {
  t.plan(2)
  let Key = 'index.html'
  let src = `
  <a href=/foo>foo</a>
  <br>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <img src=/otter-fren.png>
  <form action=/login method=post><button></form>
  <script src=/awesome.mjs type=module></script>
  `
  process.env.NODE_ENV='production'
  let result = plugin(Key, {
    headers: {'content-type':'text/html;charset=utf8'},
    body: src
  })
  t.ok(result.headers, 'has headers')
  t.ok(result.body, 'has body')
  console.log(result)
})
