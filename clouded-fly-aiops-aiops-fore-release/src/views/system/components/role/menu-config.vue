<template>
  <el-dialog :title="`当前角色名称：${record.name}`" :width="`840px`" :visible.sync="editVisible" @close="close">
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
      <div class="role-menu" v-loading="loading">
        <div class="role-menu-item">
          <div class="role-menu-main">
            <el-tree
              ref="tree"
              class="role-menu-tree"
              node-key="id"
              :default-expanded-keys="defaultMenuExpandIds"
              :props="props"
              :load="loadNode"
              lazy
              show-checkbox
              highlight-current
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
              <!-- <el-empty style="height: auto" description="暂无数据"></el-empty> -->
            </template>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  apiGetPermissionList,
  apiAddActionToRole,
  apiAddMenuToRole,
  apiDelMenuOfRole,
  apiDelActionOfRole,
  apiGetPermission,
  apiGetMenuPermissions
} from '@/apis/user'
export default {
  name: 'RoleMenuConfig',
  props: {
    // 当前编辑数据
    record: {
      type: Object,
      default: () => {}
    },
    visible: Boolean
  },

  data() {
    return {
      loading: false,
      editVisible: this.visible,
      checkList: [], // 功能已选中id
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf'
      },
      isIndeterminate: true, // true默认显示横线（非空和非全选），false根据状态显示
      checkAll: true, // 全选
      actions: [], // 当前节点功能菜单
      cacheActions: [], // 全部功能菜单
      disabledAction: false,
      actionscheckedIds: [], // 该角色所有功能权限
      viewCheckedIds: [] // 该角色所有功能权限缓存
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
    visible(val) {
      this.editVisible = val
    }
  },
  mounted() {
    this.getRolePermissions()
    this.getRoleCheckedActions()
  },
  methods: {
    close() {
      this.$emit('update:visible', false)
    },
    /**
     * 菜单勾选/取消
     * @param {}
     */
    async handleCheckChange(node, { checkedKeys }) {
      const { viewCheckedIds } = this
      checkedKeys = checkedKeys.concat(this.$refs.tree.getHalfCheckedKeys())
      const isChecked = viewCheckedIds.length < checkedKeys.length

      const lessArr = isChecked ? viewCheckedIds : checkedKeys
      const moreArr = isChecked ? checkedKeys : viewCheckedIds

      let idsArr = moreArr.filter(key => !lessArr.includes(key))
      const { success, desc } = await this.permissionChange(isChecked, idsArr.join(','))
      if (success) {
        this.$Message.success('保存成功')
        this.viewCheckedIds = isChecked
          ? [...viewCheckedIds, ...idsArr]
          : [...viewCheckedIds.filter(item => !idsArr.includes(item))]

        // 更新数据
        this.getRoleCheckedActions()
      } else {
        desc && this.$Message.error(desc)
      }
      // 勾选/取消勾选，高亮当前行
      this.disabledAction = !isChecked
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
    // 权限修改公共方法
    async permissionChange(isChecked, ids, loading = 'loading') {
      const fn = isChecked ? apiAddMenuToRole : apiDelMenuOfRole
      this[loading] = true
      const result = await fn(this.record.id, ids)
      this[loading] = false
      return result
    },
    /**
     * 对功能进行勾选变化
     * @param { Boolean } isChecked 选中/取消
     * @param { String } ids 选中/取消得id集合
     */
    async handleActionChange(isChecked, ids) {
      const fn = isChecked ? apiAddActionToRole : apiDelActionOfRole
      this.loading = true
      const actionsIds = Array.isArray(ids) ? ids : [ids]
      const params = {
        roleId: this.record.id,
        actionsIds
      }
      const { success, desc } = await await fn(params)
      this.loading = false
      if (success) {
        const { actionscheckedIds } = this
        // 同步权限到本地内存actionscheckedIds中
        this.actionscheckedIds = isChecked
          ? [...actionscheckedIds, ...actionsIds]
          : actionscheckedIds.filter(item => !actionsIds.includes(item))
        this.checkAllStatusChange()
        this.$Message.success('保存成功')
        // 更新数据
        this.getRoleCheckedActions()
      } else {
        desc && this.$Message.error(desc)
      }
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
      // 重置功能区状态
      if (this.cacheActions.length === 0) {
        this.actions = []
        this.checkList = []
        const params = {
          id: '',
          version: 1.26
        }
        this.loading = true
        const { success, desc, data } = await apiGetPermissionList(params)
        this.loading = false
        if (success) {
          this.cacheActions = data
        } else {
          desc && this.$Message.error(desc)
        }
      }
      this.actions = this.cacheActions.filter(action => action.parentId === node.id)
      this.checkList = this.actions.filter(item => this.actionscheckedIds.includes(item.id)).map(item => item.id)
      this.checkAllStatusChange()
      // 如果node未勾选，则disabled
      if (treeNode) {
        this.disabledAction = !treeNode.checked
      }
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
    // 获取该角色的全部功能权限
    async getRoleCheckedActions() {
      const params = {
        id: this.record.id,
        type: 'Role',
        version: 1.26
      }
      const { success, desc, data } = await apiGetPermission(params)
      if (success) {
        // 保存功能权限ids
        this.actionscheckedIds = data.map(item => item.id)
        this.checkList = this.actions.filter(item => this.actionscheckedIds.includes(item.id)).map(item => item.id)
        this.checkAllStatusChange()
      } else {
        desc && this.$Message.error(desc)
      }
    },
    // 获取该角色全部菜单权限
    async getRolePermissions() {
      const { success, desc, data } = await apiGetMenuPermissions(this.record.id)
      if (success) {
        // 获取一级菜单ids
        // 去除首页id,因为首页没有下级菜单
        const level1Ids = this.menuTree.filter(item => item.name !== '首页').map(item => item.id)
        // 缓存权限ids，用于更改权限对比
        this.viewCheckedIds = data.map(item => item.sourceId)

        // 将去除非首页在内的一级菜单权限id去除，因为存在一级菜单id，节点下全部节点都会自动勾选
        // 然后将过滤后的ids set到树上
        const treeviewCheckedIds = this.viewCheckedIds.filter(id => !level1Ids.includes(id))
        this.$refs.tree && this.$refs.tree.setCheckedKeys(treeviewCheckedIds)
      } else {
        desc && this.$Message.error(desc)
      }
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
  margin-left: 5px;
  margin-bottom: 2px;
  width: 14px;
  height: 14px;
  position: relative;
}
.empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
