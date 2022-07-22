/**
 * 密码规则：位数8-18，满足大写小写数字特殊符号其中3种
 * @param { String } value 密码
 */
export function passwordValidate(value = '') {
  const low = '[a-z]' //小写
  const up = '[A-Z]' // 大写
  const dit = '[0-9]' // 数字
  const sym = '[!@#$%^&*?]' // 特殊符号
  const reg = regStr => new RegExp(regStr).test(value)
  const t = {
    u: reg(up),
    l: reg(low),
    d: reg(dit),
    s: reg(sym)
  }
  return (t.u && t.l && t.d) || (t.u && t.l && t.s) || (t.u && t.d && t.s) || (t.l && t.d && t.s)
}
export function emailValidate(value = '') {
  const reg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(value)
}

/**
 * 用于form rules规则
 * 可以输入空字符
 * 但是不允许提交前后空字符
 * 使用场景：英文名字
 * @param {String} msg 报错信息
 */
export function validateEmpty(msg = '不能为空') {
  return (rule, value, callback) => {
    if (!value.trim()) {
      callback(new Error(msg))
      return false
    }
    callback()
  }
}
