function toQueryString(o) {
  let str = ''
  for (let k in o) {
    const v = o[k] && o[k] !== 0 ? o[k] : ''
    str += `&${k}=${encodeURIComponent(v)}`
  }
  return str.slice(1)
}

function appendQueryString(url, queryObj) {
  const querystr = toQueryString(queryObj)
  url = url.indexOf('?') > -1 ? `${url}&${querystr}` : `${url}?${querystr}`
  return url
}

function debounce(fn, wait = 500) {
  let timer

  return function() {
    const ctx = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(ctx, args)
    }, wait)
  }
}

export {
  toQueryString,
  appendQueryString,
  debounce
}