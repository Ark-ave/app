export const weibo = String.raw`
(function weibo() {
  const tdService = new window.TurndownService()
  tdService.remove(['script', 'style'])
  const liteTopbar = document.getElementsByClassName('lite-topbar')[0]
  if (liteTopbar) {
    liteTopbar.remove();
  }

  setTimeout(() => {
    let user = '', pubtime = '', title = '', refer = ''
    const weiboMain = document.getElementsByClassName('weibo-main')[0]
    if (weiboMain) {
      const mTextBox = document.getElementsByClassName('m-text-box')[0]
      if (mTextBox) {
        const userLink = mTextBox.getElementsByTagName('a')[0]
        if (userLink) {
          user = '[' + userLink.innerText + '](https://m.weibo.cn' + userLink.getAttribute('href') + ')'
        }
        const publishTime = mTextBox.getElementsByClassName('time')[0]
        if (publishTime) {
          pubtime = publishTime.innerText
        }
      }
      const urlIcons = weiboMain.getElementsByClassName('url-icon')
      for (let index = urlIcons.length - 1; index >= 0; index--) {
        const element = urlIcons[index];
        element.remove()
      } 
      const mwbvInfoBars = weiboMain.getElementsByClassName('mwbv-info-bar')
      for (let index = mwbvInfoBars.length - 1; index >= 0; index--) {
        const element = mwbvInfoBars[index];
        element.remove()
      }
      const footerCtrls = weiboMain.getElementsByClassName('f-footer-ctrl')
      for (let index = footerCtrls.length - 1; index >= 0; index--) {
        const element = footerCtrls[index];
        element.remove()
      }

      title = tdService.turndown(weiboMain.firstElementChild)
      if (weiboMain.childElementCount > 1) {
        refer = tdService.turndown(weiboMain.lastElementChild)
      }

      window.ReactNativeWebView.postMessage(JSON.stringify({
        user,
        pubtime,
        title,
        refer,
        origin: window.location.href,
        type: 'weibo'
      }))
    } else {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        error: true,
      }))
    }
  }, 1000);
})();
`
