export const wechatArticle = String.raw`
(function wechatArticle() {
  const tdService = new window.TurndownService()
  tdService.addRule('imageDataSrc', {
    filter: function (node, options) {
      return node.nodeName === 'IMG' && node.dataset && node.dataset.src
    },
    replacement: function (content, node, options) {
      return '![' + node.alt + '](' + node.dataset.src + ')'
    },
  })
  tdService.remove(['script', 'style', 'imageDataSrc'])

  setTimeout(() => {
    const jsContent = document.getElementById('js_content')
    const content = tdService.turndown(jsContent || '')
    const name = document.getElementById('js_name')
    const user = tdService.turndown(name || '')
    const pubtime = document.getElementById('publish_time').innerText
    const title = document.getElementById('activity-name').innerText

    window.ReactNativeWebView.postMessage(JSON.stringify({
      user,
      pubtime,
      title,
      content,
      origin: window.location.href,
      type: 'wechat.article'
    }))
  }, 1000);
})();
`
