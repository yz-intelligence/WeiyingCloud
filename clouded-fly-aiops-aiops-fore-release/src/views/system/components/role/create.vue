<template>
  <el-dialog title="新增角色" :width="`840px`" :visible.sync="editVisible" @close="close">
    <div class="step">
      <div class="step-wrap">
        <div
          v-for="(item, index) of stepOptions"
          :key="item.id"
          class="step-item"
          :class="{ active: currentStep === item.id }"
        >
          <div class="step-item-serial">{{ item.id }}</div>
          <div class="step-item-title">{{ item.title }}</div>
          <i v-if="index !== stepOptions.length - 1" class="el-icon-arrow-right step-item-arrow"></i>
        </div>
      </div>
    </div>
    <div v-show="currentStep === 1" class="step-content">
      <div class="role-menu--title">
        <span
          >菜单配置
          <el-tooltip effect="dark" content="给角色配置可访问的菜单" placement="top">
            <i class="point tips el-icon-tip"></i>
          </el-tooltip>
        </span>
        <span
          >功能权限
          <el-tooltip effect="dark" content="配置对应菜单下的操作功能权限" placement="top">
            <i class="point tips el-icon-tip"></i>
          </el-tooltip>
        </span>
      </div>
      <div class="content">
        <div class="role-menu">
          <div class="role-menu-item" v-loading="treeLoading">
            <div class="role-menu-main">
              <el-tree
                ref="tree"
                class="role-menu-tree"
                node-key="id"
                default-expand-all
                :props="props"
                :load="loadNode"
                lazy
                show-checkbox
                highlight-current
                :default-checked-keys="['Dashboard']"
                :expand-on-click-node="false"
                @check="handleCheckChange"
                @node-click="handleNodeClick"
              >
              </el-tree>
            </div>
          </div>
          <div class="role-menu-item role-menu-actions">
            <div class="role-menu-main">
              <template v-if="actions.length">
                <el-checkbox
                  class="role-menu-actions--all"
                  :indeterminate="isIndeterminate"
                  v-model="checkAll"
                  :disabled="disabledAction"
                  @change="handleCheckAllChange"
                  >全选</el-checkbox
                >
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    v-for="item of actions"
                    class="role-menu-actions--option"
                    :key="item.id"
                    :label="item.id"
                    :disabled="disabledAction"
                    @change="val => handleActionChange(val, item.id)"
                    >{{ item.name }}</el-checkbox
                  >
                </el-checkbox-group>
              </template>
              <template v-else>
                <div class="empty">暂无数据</div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="currentStep === 2" class="step-content">
      <el-form ref="form" :model="form" size="small" :form="form" :rules="rules">
        <el-form-item label="角色名称" prop="name" label-width="90px">
          <el-input
            v-model.trim="form.name"
            placeholder="请输入角色名称"
            :maxlength="100"
            clearable=""
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <el-table class="trans-table" height="376px" :data="selectData" row-key="id" size="mini">
        <el-table-column type="index" label="序号" width="100"> </el-table-column>
        <el-table-column prop="name" width="200" label="菜单名称" />
        <el-table-column prop="actions" label="功能权限点"> </el-table-column>
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" v-show="currentStep === 1" @click="close">取 消</el-button>
      <el-button v-show="currentStep === 1" size="small" type="primary" @click="handleSecondStep">下一步</el-button>
      <el-button v-show="currentStep === 2" size="small" @click="currentStep = 1">上一步</el-button>
      <el-button v-show="currentStep === 2" size="small" type="primary" :loading="loading" @click="onSubmit"
        >确定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { apiCreateRole, apiGetPermissionList } from '@/apis/user'
export default {
  name: 'RoleMenuCreate',
  props: {
    visible: Boolean,
    roleActions: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      currentStep: 1,
      loading: false,
      treeLoading: false,
      editVisible: this.visible,
      stepOptions: [
        { id: 1, title: '权限配置' },
        { id: 2, title: '角色信息' }
      ],
      checkList: [], // 功能已选中id
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      form: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      menuIds: ['Dashboard'], // 已选菜单权限
      checkedActions: [], // 已选功能权限
      isIndeterminate: true, // true默认显示横线（非空和非全选），false根据状态显示
      checkAll: true, // 全选
      disabledAction: false,
      actions: [], // 功能菜单
      selectData: []
    }
  },
  computed: {
    // 首页添加isLeaf，即去掉下拉展开符号
    menuTree() {
      return this.$store.getters.menuTree.map(item => {
        return {
          isLeaf: !item.children.length,
          disabled: item.name === '首页',
          ...item
        }
      })
    },
    // 获取第一&二层菜单id
    defaultMenuExpandIds() {
      return this.$store.getters.menuArr.map(item => item.id)
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.editVisible = val
        if (val && this.roleActions.length === 0) {
          this.getActions()
        }
      },
      immediate: true
    }
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    // 获取该角色的全部功能权限
    async getActions() {
      const params = {
        id: '',
        version: 1.26
      }
      this.loading = true
      const { success, desc, data } = await apiGetPermissionList(params)
      this.loading = false
      if (success) {
        // 保存功能权限ids
        this.$emit('update:roleActions', data)
      } else {
        desc && this.$Message.error(desc)
      }
    },
    /**
     * 菜单勾选/取消
     * @param {}
     */
    async handleCheckChange(node, { checkedKeys }) {
      const { menuIds } = this
      let currentCheckKeys = [...checkedKeys, ...this.$refs.tree.getHalfCheckedKeys()]
      const isChecked = menuIds.length < currentCheckKeys.length
      const lessArr = isChecked ? menuIds : currentCheckKeys
      const moreArr = isChecked ? currentCheckKeys : menuIds
      // 获取本次操作后差异的ids
      let idsArr = moreArr.filter(key => !lessArr.includes(key))

      // 如果是取消勾选
      // 则去除idsArr相关的功能权限，如果是勾选，则添加相关的功能权限
      if (isChecked) {
        const currentActions = this.roleActions.filter(item => idsArr.includes(item.parentId))
        this.checkedActions = [...this.checkedActions, ...currentActions]
      } else {
        this.checkedActions = this.checkedActions.filter(item => !idsArr.includes(item.parentId))
      }
      this.disabledAction = !isChecked
      this.menuIds = isChecked ? [...menuIds, ...idsArr] : [...menuIds.filter(item => !idsArr.includes(item))]
      // 勾选/取消勾选，高亮当前行
      this.$refs.tree.setCurrentKey(node.id)
      this.handleNodeClick(node)
    },
    // 节点展开
    async loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve(this.menuTree)
      }
      if (node.level === 1) {
        return resolve(node.data.children || [])
      }
      if (node.level > 1) {
        return resolve([])
      }
    },
    handleSecondStep() {
      let menus = this.$refs.tree.getCheckedNodes(true, false)
      menus = menus.map(item => {
        const currntActions = this.checkedActions.filter(action => action.parentId === item.id).map(item => item.name)
        return {
          ...item,
          actions: '菜单主页' + (currntActions.length > 0 ? '、' : '') + currntActions.join('、')
        }
      })
      this.selectData = menus
      this.currentStep = 2
    },
    /**
     * 勾选全部功能权限
     * @param {}
     */
    handleCheckAllChange(val) {
      const actionsIds = this.actions.map(item => item.id)
      this.checkList = val ? actionsIds : []
      this.isIndeterminate = false
      this.handleActionChange(val, actionsIds)
    },
    // 点击节点，加载功能权限
    async handleNodeClick(node, treeNode) {
      // 如果node未勾选，则disabled
      if (treeNode) {
        this.disabledAction = !treeNode.checked
      }
      // 重置功能区状态
      this.actions = this.roleActions.filter(item => item.parentId === node.id)
      this.checkList = this.checkedActions.filter(item => item.parentId === node.id).map(item => item.id)
      this.checkAllStatusChange()
    },
    /**
     * 对功能进行勾选变化
     * @param { Boolean } isChecked 选中/取消
     * @param { String } ids 选中/取消得id集合
     */
    handleActionChange(isChecked, ids = []) {
      const idsArr = Array.isArray(ids) ? ids : [ids]
      const { checkedActions } = this
      // 同步权限到本地内存checkedActions中
      this.checkedActions = isChecked
        ? [...checkedActions, ...this.actions.filter(item => idsArr.includes(item.id))]
        : checkedActions.filter(item => !idsArr.includes(item.id))
      this.checkAllStatusChange()
    },
    /**
     *  根据勾选状态-设置全选按钮是否显示横线，
     *  设置全选状态
     */
    checkAllStatusChange() {
      const checkedLen = this.checkList.length
      this.isIndeterminate = checkedLen !== 0 && checkedLen !== this.actions.length
      this.checkAll = !!checkedLen
    },
    onSubmit() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          const { menuIds, checkedActions } = this
          const params = {
            ...this.form,
            menuIds,
            actionsIds: checkedActions.map(item => item.id)
          }
          const { success, desc } = await apiCreateRole(params)
          this.loading = false
          if (success) {
            this.$Message.success('新增成功')
            this.$emit('success')
            this.close()
          } else {
            desc && this.$Message.error(desc)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 8px transparent;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
::-webkit-scrollbar-track {
  border-radius: 2px;
}
.content {
  height: 416px;
}
.role-menu {
  display: flex;
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 4px;
  &--title {
    display: flex;
    margin-top: -6px;
    padding-bottom: 10px;
    span {
      flex: 1;
      font-size: 16px;
    }
  }
  &-item {
    padding: 16px;
    flex: 1;
    height: 100%;
    overflow: auto;
  }
  &-main {
    height: 100%;
  }
  &-actions {
    border-left: 1px solid #dcdfe6;
    &--option {
      display: block;
      margin-bottom: 10px;
    }
    &--all {
      margin-bottom: 10px;
    }
  }
}
.point {
  cursor: pointer;
}
.tips {
  position: relative;
  margin-left: 5px;
  margin-bottom: 2px;
  font-size: 14px;
  color: #919eab;
}
.empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.step {
  padding: 8px 0 32px;
  margin-bottom: 24px;
  border-bottom: 1px solid #dcdfe6;
  &-wrap {
    display: flex;
    align-items: center;
  }
  &-item {
    display: flex;
    align-items: center;
    &-serial {
      margin-right: 10px;
      width: 28px;
      height: 28px;
      line-height: 24px;
      font-size: 16px;
      text-align: center;
      border-radius: 100%;
      border: 2px solid #bbb;
      color: #bbb;
    }
    &-title {
      color: #bbb;
    }
    &-arrow {
      margin: 0 40px;
      font-size: 20px;
      color: #bbb;
    }
  }
}
.active {
  .step {
    &-item {
      &-serial {
        background-color: #006eff;
        border: 2px solid #006eff;
        color: #fff;
      }
      &-title {
        color: #000;
        font-weight: 700;
      }
    }
  }
}
</style>
