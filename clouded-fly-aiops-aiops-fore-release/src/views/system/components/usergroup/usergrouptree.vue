<template>
  <div>
    <el-tree
      id="user-manage_tree_usertree"
      :data="treedata"
      :props="nodeProps"
      default-expand-all
      :highlight-current="true"
      :expand-on-click-node="false"
      @node-click="changeGroup"
      v-loading="loading"
      class="usertree"
    >
      <span slot-scope="{ node }" class="userTree-line span-ellipsis">
        <span :title="node.label">
          <div class="tree-icon">
            <i v-if="node.level === 1" class="el-icon-s-home"></i>
            <i v-else-if="node.label === '未分组'" class="el-icon-s-claim"></i>
            <i v-else class="el-icon-office-building"></i>
          </div>
          {{ node.label }}</span
        >
        <span v-if="node.label !== '未分组'" class="tree-buttonGroup">
          <i id="user-manage_i_add" class="el-icon-plus groupButton" @click="addGroup(node)"></i>
          <i
            id="user-manage_i_edit"
            class="el-icon-edit groupButton"
            v-show="node.level !== 1"
            @click="editGroup(node)"
          ></i>
          <i
            id="user-manage_i_delete"
            class="el-icon-delete groupButton"
            v-show="node.level !== 1"
            @click="deleteGroup(node)"
          ></i>
        </span>
      </span>
    </el-tree>
    <user-group-tree-dialog
      :id="targetNode.data.id"
      :visible.sync="showGroupDialog"
      :groupDialogTitle="groupDialogTitle"
      :groupForm="groupForm"
      @loadTree="loadTree"
    ></user-group-tree-dialog>
  </div>
</template>
<script>
import { apiGetGroupTree, apiDeleteGroup } from '@/apis/user'
import UserGroupTreeDialog from './usergrouptreedialog.vue'
export default {
  components: { UserGroupTreeDialog },
  name: 'UserGroupTree',
  data() {
    const user = this.$store.getters.user
    return {
      user,
      //树节点数据结构
      treedata: [
        {
          id: user.companyId,
          name: user.company,
          isRoot: true,
          expand: true,
          icon: '',
          children: []
        }
      ],
      // 用户组列表树--request数据与树节点属性的映射
      nodeProps: {
        children: 'children',
        label: 'name'
      },
      targetNode: {
        data: {
          id: ''
        }
      },
      loading: false,
      //控制左侧用户树对话框触发
      showGroupDialog: false,
      //左侧用户树对话框属性
      groupDialogTitle: '',
      groupForm: {
        name: ''
      }
    }
  },
  created() {
    this.loadTree()
  },
  methods: {
    //用户组树节点--加载
    async loadTree() {
      this.loading = true
      const { success, data, desc } = await apiGetGroupTree(this.user.companyId)
      this.loading = false
      if (success) {
        this.treedata[0].children = data
        this.treedata[0].children.push({
          id: '-',
          name: '未分组'
        })
      } else {
        desc && this.$Message.error(desc)
      }
    },
    //用户组树节点点击事件--触发列表加载
    changeGroup({ id }) {
      //未选择节点和选择节点为未分组时 禁用关联用户按钮 （未分组id：‘-’）
      this.$emit('changeGroup', id, id === '' || id === '-')
    },
    //用户组树节点--节点新增组按钮
    addGroup(node) {
      this.targetNode = node
      this.groupDialogTitle = '新增组'
      this.groupForm.name = ''
      this.showGroupDialog = true
    },
    //用户组树节点--节点修改组按钮
    editGroup(node) {
      this.targetNode = node
      this.groupDialogTitle = '编辑组'
      this.groupForm.name = node.label
      this.showGroupDialog = true
    },
    //用户组树节点--节点删除组按钮
    deleteGroup(node) {
      this.$customMessageBox(this, '提示', '确定删除本用户组吗？', 'warning')
        .then(async () => {
          const { success, desc } = await apiDeleteGroup(node.data.id)
          if (success) {
            this.$Message.success('删除成功')
            this.loadTree()
          } else {
            desc && this.$Message.error(desc)
          }
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.span-ellipsis {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.usertree {
  padding-top: 10px;
  height: 100%;
  // &::v-deep .el-tree-node.is-expanded > .el-tree-node__children {
  //   display: inline;
  // }
}
.tree-icon {
  display: inline;
  margin-right: 5px;
}
.tree-buttonGroup {
  display: none;
  position: absolute;
  background-color: #f4f6fa;
  // border: 1px solid;
  border-radius: 4px;
  margin: 0;
  right: 5px;
  .groupButton {
    padding: 0 5px;
    &:hover {
      transform: scale(1.5);
      color: #0076ff;
    }
  }
}
::v-deep .el-tree-node__content {
  &:hover .tree-buttonGroup {
    display: inline;
  }
}
</style>
