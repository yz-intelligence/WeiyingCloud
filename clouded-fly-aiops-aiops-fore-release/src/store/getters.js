const getters = {
  // 菜单树
  menuTree: state => state.menu.menuTree,
  menuArr: state => state.menu.menuArr,
  isFix: state => state.menu.isFix,
  user: state => state.user.info,
  permissions: state => state.user.permissions,
  // 数据字典
  levelOpt: state => state.dictionary.levelOpt,
  statusOpt: state => state.dictionary.statusOpt,
  sourceStatus: state => state.dictionary.sourceStatus,
  sendType: state => state.dictionary.sendType,
  validityOpt: state => state.dictionary.validityOpt,
  statusOptions: state => state.dictionary.statusOptions,
  conditionOpt: state => state.dictionary.conditionOpt,
  fieldOpt: state => state.dictionary.fieldOpt,
  periodType: state => state.dictionary.periodType,
  weekType: state => state.dictionary.weekType,
  closeTime: state => state.dictionary.closeTime
}
export default getters
