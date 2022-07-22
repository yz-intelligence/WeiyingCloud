/**
 *
 * @param {传入this} obj
 * @param {提示框的标题} title
 * @param {提示框的主要内容} maintext 如果需要换行，请以<br/>分割
 * @param {提示框类型：warning、delete、normal} type
 * @param {自定义设置参数} props
 * @param {是否需要换行参数} br
 * @returns
 */
function customMessageBox(obj, title, maintext, type, props, br = false) {
  const h = obj.$createElement
  const options = {
    warning: {
      color: '#FF9F00',
      display: 'block',
      buttonColor: ''
    },
    delete: {
      color: '#FF483B',
      display: 'block',
      buttonColor: 'red'
    },
    normal: {
      color: '#0076ff',
      display: 'none',
      buttonColor: ''
    }
  }
  if (br) {
    const arr = maintext.split('<br/>')
    maintext = [h('span', null, arr[0]), h('br', null, ''), h('span', null, arr[1])]
  }
  return obj.$msgbox({
    title: '',
    message: h('p', null, [
      h('div', { style: 'display: flex; alignItems: flex-start;margin: 22px 0 13px' }, [
        h('i', {
          class: 'el-icon-warning',
          style: `color: ${options[type].color};fontSize: 25px;marginRight: 10px;display:${options[type].display}`
        }),
        h('div', { style: 'display: flex; flexDirection: column;' }, [
          h('p', { style: 'fontSize: 16px;font-weight: 600;marginBottom: 12px;color: #1D1F25' }, title),
          h('span', { style: 'fontSize: 14px;color: #666666' }, maintext)
        ])
      ])
    ]),
    showCancelButton: true,
    confirmButtonText: '确定',
    confirmButtonClass: options[type].buttonColor,
    cancelButtonText: '取消',
    ...props
  })
}

const install = function (Vue) {
  Vue.prototype.$customMessageBox = customMessageBox
}

export default {
  install,
  customMessageBox
}
