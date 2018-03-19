// @flow

import fetch from 'isomorphic-fetch'

const endpoint = 'https://ja.wikipedia.org/w/api.php'

type Params = { [key: string]: string }

const params = {
  format: 'json',
  action: 'query',
  prop: 'info',
  titles: '',
}

const getQueryString = (params: Params): string => {
  let requestParameters = '?'
  requestParameters += Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
  return requestParameters
}

const setWordToParams = (params: Params, word: string): Params => {
  return Object.assign({}, params, { titles: encodeURIComponent(word) })
}

const isWordExisted = async (word): Promise<boolean> => {
  const url = endpoint + getQueryString(setWordToParams(params, word))
  const res = await fetch(url)
  const json = await res.json()

  // TODO
  return parseInt(Object.keys(json.query.pages)[0], 10) > 0
}

export default isWordExisted
