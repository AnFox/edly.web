import React from 'react'

export function nl2el(str, el = 'p', options = null) {
  const newlineRegex = /(\r\n|\r|\n)/g

  if (el === 'br') {
    return str.split(newlineRegex).map(function(line, index) {
      if (line.match(newlineRegex)) {
        return React.createElement('br', { key: index })
      }
      return line
    })
  }

  return str.split(newlineRegex).map(function (line) {
    if (!line.match(newlineRegex)) {
      return React.createElement(el, options, line)
    }
  })
}

export function addHttpProtocolIfRequired(url) {
  if (!/^https?:\/\//.test(url)) {
    url = "http://" + url
  }

  return url
}
