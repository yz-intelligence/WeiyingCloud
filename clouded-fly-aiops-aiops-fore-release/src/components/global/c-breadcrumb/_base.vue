<template>
  <div class="breadcrumb">
    <el-breadcrumb v-if="menu && menu.length" class="breadcrumb-centent" separator="/">
      <template>
        <el-breadcrumb-item v-for="item of menu" :key="item.name">{{ item.name }}</el-breadcrumb-item>
      </template>
      <!-- <template v-else>
        <el-breadcrumb-item v-for="item of currentArr" :key="item.id">{{ item.name }}</el-breadcrumb-item>
      </template> -->
    </el-breadcrumb>
    <template v-else>
      <div v-for="(item, index) of currentArr" :key="item.id" class="breadcrumb-font">
        <span v-if="index !== currentArr.length - 1">{{ item.name }}<span class="breadcrumb-divider">/</span></span>
        <span v-else>
          <el-dropdown class="breadcrumb-hover" placement="bottom-start" @visible-change="changeHover">
            <div ref="hoverarea">
              <span>{{ item.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu>
              <el-dropdown-item class="dropdown-head" disabled>{{ dropDownArr[0].parent.name }}</el-dropdown-item>
              <el-divider></el-divider>
              <div v-for="item of dropDownArr" :key="item.id">
                <el-dropdown-item v-if="item.url === $route.path" disabled class="dropdown-current">{{
                  item.name
                }}</el-dropdown-item>
                <el-dropdown-item v-else @click.native="$router.push(item.url)">{{ item.name }}</el-dropdown-item>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </div>
    </template>
    <div class="breadcrumb-extra">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CBreadcrumb',
  props: {
    // 手动路由名称
    menu: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      //检测下拉菜单响应区状态
      visible: false
    }
  },
  watch: {
    //检测下拉菜单状态，保持hover样式
    visible(val) {
      if (val) {
        const { style, lastChild } = this.$refs.hoverarea[0]
        style.color = '#0076ff'
        lastChild.style.transform = 'scaleY(-1)'
      } else {
        const { style, lastChild } = this.$refs.hoverarea[0]
        style.color = '#333'
        lastChild.style.transform = 'scaleY(1)'
      }
    }
  },
  computed: {
    menuArr() {
      return this.$store.getters.menuArr
    },
    // 当前路由链路
    currentArr() {
      const currentRoute = this.$route.path
      return this.expand(this.menuArr.find(item => item.url === currentRoute))
    },
    // 下拉菜单选项
    dropDownArr() {
      const currentRouteParent = this.$route.path.split('/')[1]
      return this.menuArr
        .filter(
          //筛选同级菜单项并剔除当前菜单项
          item => item.url.match(RegExp(`${currentRouteParent}`))
        )
        .reverse()
    }
  },
  methods: {
    // 递归将树展开为数组
    expand(tree = {}, arr = []) {
      if (!tree) return []
      const { parent, name, url } = tree
      arr.unshift({ name, url })
      if (parent) {
        return this.expand(parent, arr)
      } else {
        return arr
      }
    },
    //监听下拉菜单状态
    changeHover(visible) {
      this.visible = visible
    }
  }
}
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 0 24px;
  width: 100%;
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 0 0 #ddd;
  z-index: 1;
  &::v-deep .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #999999;
      font-size: 16px;
    }
    &:last-of-type {
      .el-breadcrumb__inner {
        color: #333;
        // font-weight: 700;
        // &:hover {
        //   cursor: pointer;
        //   color: #0076ff;
        // }
      }
    }
  }
}
.breadcrumb {
  &-font {
    font-size: 16px;
    color: #999999;
  }
  &-divider {
    padding: 0 8px;
  }
  &-hover {
    font-size: 16px;
    color: #333;
    cursor: pointer;
    :hover {
      color: #0076ff;
      // .el-icon-arrow-down {
      //   transition: 0.5s;
      //   transform: scaleY(-1);
      // }
    }
  }
}
.dropdown-head {
  color: #333 !important;
}
.dropdown-current {
  font-weight: 700;
  background-color: #f6f6f6;
  color: #0076ff !important;
}
.el-dropdown-menu {
  width: 200px;
}
.el-dropdown-menu__item {
  color: #666666;
}
.el-dropdown-menu__item:not(.is-disabled):hover,
.el-dropdown-menu__item:hover {
  color: #666666;
  background-color: #f6f6f6;
}
.el-dropdown-menu__item:not(.is-disabled):active,
.el-dropdown-menu__item:active {
  color: #ffffff !important;
  background-color: #0076ff !important;
}
.el-divider--horizontal {
  margin: 0 0 10px;
  transform: scaleX(0.8);
}
</style>
