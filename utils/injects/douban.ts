export const doubanTopic = String.raw`
(function doubanStatus() {
  const talionNav = document.getElementById('TalionNav');
  if (talionNav) {
    talionNav.remove();
  }
  const tdService = new window.TurndownService()
  tdService.addRule('aViewLarge', {
    filter: function (node, options) {
      return node.nodeName === 'A' && /view-large/.test(node.className)
    },
    replacement: function () {
      return ''
    },
  })

  tdService.remove(['script', 'style', 'aViewLarge'])

  setTimeout(() => {
    let title = '', pubtime = '', content = '', user = ''
    const header = document.getElementsByClassName('header')[0]
    if (header) {
      title = header.getElementsByClassName('title')[0].innerText
      pubtime = header.getElementsByClassName('timestamp')[0].innerText
      user = header.getElementsByClassName('name')[0].innerText
    }
    const noteBody = document.getElementById('note-body')
    if (noteBody) {
      const richNote = noteBody.getElementsByClassName('rich-note')[0]
      content = tdService.turndown(richNote || '')
    }

    window.ReactNativeWebView.postMessage(JSON.stringify({
      user,
      title,
      content,
      pubtime,
      origin: window.location.href,
      type: 'douban.topic',
    }))
  }, 1000)
})();
`

export const doubanNote = String.raw`
(function doubanStatus() {
  const talionNav = document.getElementById('TalionNav');
  if (talionNav) {
    talionNav.remove();
  }
  const tdService = new window.TurndownService()
  tdService.addRule('aViewLarge', {
    filter: function (node, options) {
      return node.nodeName === 'A' && /view-large/.test(node.className)
    },
    replacement: function () {
      return ''
    },
  })

  tdService.remove(['script', 'style', 'aViewLarge'])

  setTimeout(() => {
    let title = document.title
    let user = '', pubtime = '', refer = '', type = 'douban.note'
    if (window.location.href.includes('/review/')) {
      type = 'douban.review'
    }
    const author = document.getElementsByClassName('author')[0]
    if (author) {
      const authorName = author.getElementsByClassName('author-name')[0].innerText
      const authorLink = author.getElementsByClassName('note-author')[0]
      user = '[' + authorName + '](https://www.douban.com' + (authorLink ? authorLink.getAttribute('href') : '') + ')'
    }

    const header = document.getElementsByClassName('header')[0]
    if (header) {
      title = header.getElementsByClassName('title')[0].innerText
      pubtime = header.getElementsByClassName('timestamp')[0].innerText
    }

    // review for book, music or movie
    const card = document.getElementsByClassName('card')[0]
    if (!user && card) {
      const detail = card.getElementsByClassName('user-title')[0]
      if (detail) {
        user = detail.getElementsByClassName('name')[0].innerText
      }
      const timestamp = detail.getElementsByClassName('timestamp')[0].innerText
      pubtime = timestamp.split(' ')[0]
      title = card.getElementsByClassName('title')[0].innerText

      const subjectCard = document.getElementsByClassName('subject-card')[0]
      if (subjectCard) {
        const subjectHref = subjectCard.getAttribute('href')
        const subjectTitle = subjectCard.getElementsByTagName('h2')[0]
        refer = '[' + (subjectTitle ? subjectTitle.innerText : '未知') + '](' + subjectHref + ')'
      }
    }


    const contentEle = document.getElementById('content')
    const content = tdService.turndown(contentEle || '')
    window.ReactNativeWebView.postMessage(JSON.stringify({
      user,
      title,
      content,
      refer,
      pubtime,
      origin: window.location.href,
      type,
    }))
  }, 1000)
})();
`

export const doubanStatus = String.raw`
  (function doubanStatus() {
    const talionNav = document.getElementById('TalionNav');
    if (talionNav) {
      talionNav.remove();
    }
    const commentInput = document.getElementById('comment-input_1');
    if (commentInput) {
      commentInput.remove();
    }

    const commentList = document.getElementsByClassName('comment-list');
    for (let index = 0; index < commentList.length; index++) {
      const element = commentList[index];
      element.remove();
    }

    const downloadApp = document.getElementsByClassName('download-app');
    for (let index = 0; index < downloadApp.length; index++) {
      const element = downloadApp[index];
      element.remove();
    }

    function cleanString(str) {
      return str.trim('\n').trim()
    }

    setTimeout(() => {
      const statusList = document.getElementsByClassName('status-list')[0]
      if (statusList) {
        const tdService = new window.TurndownService()
        tdService.addRule('aViewLarge', {
          filter: function (node, options) {
            return node.nodeName === 'A' && /view-large/.test(node.className)
          },
          replacement: function () {
            return ''
          },
        })

        tdService.addRule('feedImages', {
          filter: function (node, options) {
            return node.nodeName === 'A' && /view-large/.test(node.className)
          },
          replacement: function () {
            return ''
          },
        })

        tdService.remove(['script', 'style', 'aViewLarge'])

        const statusListWrap = document.getElementsByClassName('status-list')
        if (statusListWrap[0]) {
          const statusList = statusListWrap[0].children
          for (let index = 0; index < statusList.length; index++) {
            const element = statusList[index]
            const desc = element.getElementsByClassName('desc')[0]
            const link = desc.getElementsByTagName('a')[0]
            const avatar = link.getElementsByTagName('img')[0]
            const user = '[' + avatar.getAttribute('alt') + '](https://www.douban.com' + link.getAttribute('href') + ')'
            
            let refer = ''
            const content = element.getElementsByClassName('content')[0] || ''
            const feedCard = element.getElementsByClassName('feed-card')[0]
            const feedImages = element.getElementsByClassName('feed-images')[0]
            let title = tdService.turndown(content)
            if (feedCard) {
              const detail = feedCard.getElementsByClassName('detail')[0]
              const feedCardLink = feedCard.getElementsByTagName('a')[0]
              const cardTitle = feedCard.getElementsByClassName('title')[0]
              const href = feedCardLink.getAttribute('href')
                
              if (detail && feedCardLink) {
                const detailTitle = detail.getElementsByClassName('title')[0]
                if (cardTitle && cardTitle.innerText) {
                  refer = '[' + cleanString(cardTitle.innerText) + '](' + href + ')' 
                } else if (detailTitle && detailTitle.innerText){
                  refer = '[' + cleanString(detailTitle.innerText) + '](' + href + ')' 
                }
              }
            }
            const pubtime = desc.getElementsByClassName('timestamp')[0].innerText

            const reshareStatus = element.getElementsByClassName('reshared-status')[0]
            
            if (reshareStatus) {
              const href = reshareStatus.getAttribute('href')
              const userInfo = reshareStatus.getElementsByClassName('user-info')[0]
              const strong = userInfo.getElementsByTagName('strong')[0]
              const extra = strong.getElementsByTagName('span')[0]
              extra.remove()
              const result = (href || '').match(/\/people\/\d*/)
              const user = '[' + strong.innerText + '](https://www.douban.com' + (result ? result[0] : '') + ')'
              const reshareContent = reshareStatus.getElementsByClassName('content')[0] || ''
              let reshareTitle = tdService.turndown(reshareContent)
              
              const reshareFeedImages = reshareStatus.getElementsByClassName('feed-images')[0]
              if (reshareFeedImages) {
                const items = reshareFeedImages.getElementsByClassName('item')
                if (items.length === 1) {
                  reshareTitle = reshareTitle + '\n' + tdService.turndown(items[0])
                } else {
                  for (let index = 0; index < items.length; index++) {
                    const bgImage = items[index].style['background-image'];
                    if (bgImage) {
                      const result = bgImage.match(/https:\/\/\S*.(jpg|jpeg|png|webp)/)
                      if (result && result.length) {
                        reshareTitle = reshareTitle + '\n' + '![](' + result[0] + ')'
                      }
                    }
                  }
                }
              }

              refer = {
                origin: 'https://www.douban.com' + href,
                title: reshareTitle,
                user,
              }
            } else {
              if (feedImages) {
                const items = feedImages.getElementsByClassName('item')
                if (items.length === 1) {
                  title = title + '\n' + tdService.turndown(items[0])
                } else {
                  for (let index = 0; index < items.length; index++) {
                    const bgImage = items[index].style['background-image'];
                    if (bgImage) {
                      const result = bgImage.match(/https:\/\/\S*.(jpg|jpeg|png|webp)/)
                      if (result && result.length) {
                        title = title + '\n' + '![](' + result[0] + ')'
                      }
                    }
                  }
                }
              }
            }
            window.ReactNativeWebView.postMessage(JSON.stringify({
              user,
              title,
              pubtime,
              refer,
              origin: window.location.href,
              type: 'douban.status',
            }))
          }
        }
      }
    }, 1000)
  })();
`
