export const commonArticle = String.raw`
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
    const title = document.title

    let content = ''
    const article = document.getElementsByTagName('article')[0]
    if (article) {
      content = tdService.turndown(article)
    }
    window.ReactNativeWebView.postMessage(JSON.stringify({
      user: '',
      pubtime: '',
      title,
      content,
      origin: window.location.href,
      type: 'other'
    }))
  }, 1000);
})();
`
