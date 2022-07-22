// 0、1 转 是否
export function num2YesOrNo(val) {
  const map = {
    0: '否',
    1: '是'
  }
  return map[val] || '-'
}

/**
 * 去除字符串的前后空格
 * @param { String } value 传入参数
 */
export function strTrim(value) {
  return value.trim()
}

/**
 * 10000 => "10,000"
 * @param {number|string} num
 */
export function toThousandFilter(num) {
  if (num === '--') {
    return num
  }
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}
