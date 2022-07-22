export function uuid() {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = ''

  const uuid = s.join('')
  return uuid.toUpperCase()
}

/**
 * 使用广度优先算法将
 * 菜单树转换成数组
 * @param {Array} tree
 */
export function menuTree2Array(tree = []) {
  if (!Array.isArray(tree) || tree.length === 0) {
    return []
  }
  const stack = [...tree]
  const result = []
  while (stack.length) {
    const current = { ...stack.pop() }
    if (Array.isArray(current.children) && current.children.length > 0) {
      stack.push(...current.children)
      current.children = []
    }
    result.push(current)
  }
  return result
}

//转换UTC时间格式
export function dateToUTc(dateString) {
  var date = new Date(dateString)
  var y = date.getUTCFullYear()
  var m = date.getUTCMonth()
  var d = date.getUTCDate()
  var h = date.getUTCHours()
  var M = date.getUTCMinutes()
  var s = date.getUTCSeconds()
  var formatedDate = Date.UTC(y, m, d, h, M, s)
  return formatedDate
}

// 下载文件流方法
export function downloadFile(url) {
  let a = document.createElement('a')
  a.style.display = 'none'
  a.setAttribute('download', '')
  a.setAttribute('href', url)
  a.click() // 强制触发a便签的点击事件
  a = null
}
export const objectToString = Object.prototype.toString
export const toTypeString = value => objectToString.call(value)
export const isPlainObject = val => toTypeString(val) === '[object Object]'

/**
 * 判断是否为json字符串
 * @param {string} str json字符串
 * @param {boolean} isReturnObj 是json字符串时，是否返回解析后的对象
 * @returns boolean || object
 */
export const isJSONString = (str, isReturnObj) => {
  try {
    let obj = JSON.parse(str)
    if (isPlainObject(obj)) {
      return isReturnObj ? obj : true
    }
  } catch (e) {}
  return false
}
