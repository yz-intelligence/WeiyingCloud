<template>
  <div class="menu" :class="{ 'menu-guide': !isFix }">
    <!-- 一级目录 -->
    <div class="box">
      <!-- 维鹰图标 -->
      <div class="logo" @click="backToHome">
        <img src="../../../assets/images/menu/logo.svg" alt="维鹰云" />
      </div>

      <div class="guide">
        <!-- 导航栏 -->
        <div class="guide-content">
          <div
            :id="`menu_${item.id}`"
            class="guide-content-item"
            v-for="item in sortMenu(menuTree)"
            :key="item.id"
            :class="{ active: item.id === activeId }"
            @mouseover="showList(item)"
            @mouseout="hiddenList()"
          >
            <!-- 首页 -->
            <router-link
              v-if="!item.children.length"
              v-slot="{ navigate }"
              custom
              :to="item.url"
              @click.native="changeId(item.id)"
            >
              <!-- 用vue-router 4.0的api，避免报错 -->
              <span @click="navigate" role="link">{{ item.name }}</span>
            </router-link>
            <!-- 剩下导航栏 -->
            <span v-else>{{ item.name }} </span>
          </div>
        </div>

        <!-- 新手指南 + 个人中心 -->
        <div class="guide-person">
          <!-- 新手指南 -->
          <div class="guide-person-icon" @click="$router.push('/home?intro')" title="新手指南">
            <i class="el-icon-help-document"></i>
          </div>
          <el-dropdown class="guide-person-center">
            <el-row type="flex" align="middle">
              <span>帮助</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-row>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="$router.push('/home?intro')">新手教程</el-dropdown-item>
              <el-dropdown-item @click.native="toHelpDoc()">帮助文档</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span class="guide-person-divider"></span>
          <!-- 个人图标 -->
          <div class="guide-person-icon" @click="toPerson()" title="个人中心">
            <i class="el-icon-mine"></i>
          </div>
          <!-- 个人中心 -->
          <el-dropdown class="guide-person-center">
            <el-row type="flex" align="middle">
              <span>{{ user && user.nickname ? user.nickname : '' }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-row>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="toPerson()">个人中心</el-dropdown-item>
              <el-dropdown-item @click.native="outLog()">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 二级目录 -->
    <el-collapse-transition>
      <div class="detail" v-if="isShowlist && list.children.length" @mouseover="showList()" @mouseout="hiddenList()">
        <div class="detail-guide">
          <div class="detail-guide-img">
            <img :src="require('@/assets/images/menu/menu/' + list.image)" />
            <div class="detail-guide-disc">{{ list.description }}</div>
          </div>
        </div>
        <div class="detail-list">
          <div
            v-for="m2 in sortMenu(list.children)"
            @click="menuSelect(m2.url, m2.name, list.id)"
            :name="m2.url"
            :key="m2.id"
            class="detail-list-item"
          >
            <div class="detail-list-item-title">{{ m2.name }}</div>
            <div class="detail-list-item-disc">
              {{ m2.description }}
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { saveUserAction } from '@/apis/user'
import { mapGetters } from 'vuex'
import home from '@/mixins/homeChange'
export default {
  name: 'LayoutHeader',
  mixins: [home],
  data() {
    return {
      isShowlist: false,
      list: [],
      timeout: '',
      activeId: '',
      listTime: ''
    }
  },
  computed: {
    ...mapGetters(['menuArr', 'isFix'])
  },
  methods: {
    //跳转到帮助文档
    toHelpDoc() {
      window.open('https://docs.qq.com/doc/DTU1RSVZwbmF6eXlj')
    },
    sortMenu(arr) {
      let tmp = [...arr]
      tmp.sort((a, b) => a.priority - b.priority)
      return tmp
    },
    // 显示二级菜单
    showList(list) {
      clearTimeout(this.timeout)
      clearTimeout(this.listTime)
      if (list) {
        this.listTime = setTimeout(() => {
          this.list = list
          this.isShowlist = true
        }, 200)
      }
    },
    // 隐藏二级菜单
    hiddenList() {
      this.timeout = setTimeout(() => {
        this.isShowlist = false
      }, 200)
    },
    // 页面跳转
    menuSelect(url, name, id) {
      if (this.$route.path !== url) {
        setTimeout(() => {
          saveUserAction({
            type: '访问页面',
            title: name,
            data: JSON.stringify({ url: url })
          })
        }, 500)
        this.$router.push({ path: url })
      } else {
        this.$router.go(0)
      }
      this.changeId(id)
      this.isShowlist = false
    },
    backToHome() {
      this.routerChange('/home/dashboard')
    },
    toPerson() {
      this.$router.push('/user/mine')
      this.changeId(0)
    },
    // 修改activeId
    changeId(id) {
      this.activeId = id
    },
    // 退出登录
    async outLog() {
      const { success, desc } = await this.$store.dispatch('user/logout')
      if (!success) {
        desc && this.$Message.error(desc)
      }
    }
  },
  watch: {
    $route: {
      handler(val, oldVal) {
        let { path } = val
        if (path === '/user/mine') {
          this.activeId = path
          return
        }
        this.menuArr.forEach(item => {
          if (item.url === path) {
            if (item.parent) {
              this.activeId = item.parent.id
              return
            } else {
              this.activeId = item.id
              return
            }
          }
        })
      }
    }
  },
  mounted() {
    let { path } = this.$route
    this.menuArr.forEach(item => {
      if (item.url === path) {
        if (item.parent) {
          this.activeId = item.parent.id
          return
        } else {
          this.activeId = item.id
          return
        }
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.img {
  width: 20px;
  height: 20px;
}
.menu {
  z-index: 1999;
  position: fixed;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  width: 100%;
  min-width: 1200px;
  box-shadow: 0 1px 2px 0 #e5e5e5;
  .box {
    display: flex;
    padding: 0 24px;
    height: 56px;
    width: 100%;
    justify-content: space-between;
    .logo {
      margin: 6px 0;
      cursor: pointer;
    }
    .guide {
      display: flex;
      flex-direction: row;
      width: auto;
      &-content {
        display: flex;
        margin: 0 25px;
        min-width: 160px;
        font-size: 15px;
        color: #444f5a;
        &-item {
          margin: 0 24px;
          font-size: 15px;
          // min-width: 62px;
          color: #333;
          display: flex;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          padding-top: 2px;
          span {
            margin: auto;
            text-align: center;
            border: none;
          }
          &:hover {
            color: #0076ff;
          }
        }
      }
      &-person {
        display: flex;
        align-items: center;
        margin-left: 16px;
        &-icon {
          margin-right: 4px;
          font-size: 20px;
          color: #333;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        &-divider {
          height: 20px;
          width: 2px;
          background-color: rgba(221, 221, 221, 0.7);
          transform: scaleX(-50%);
          margin: 8px;
        }
        &-center {
          margin: 0;
          cursor: default;
        }
      }
    }
  }
  .active {
    color: #0076ff !important;
    border-bottom: 2px solid #0076ff !important;
    background-color: #fff;
  }
  .detail {
    z-index: 2006;
    overflow: hidden;
    top: 56px;
    left: 0;
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    width: 100%;
    min-width: 1200px;
    height: 150px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    box-shadow: 0 1px 6px rgb(0 0 0 / 20%);
    background-color: #ffffff;
    &-guide {
      display: flex;
      flex: 1;
      border-right: 1px solid #eeeeee;
      padding: 0 40px;
      &-img {
        width: auto;
        height: 127px;
        margin: auto 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        img {
          width: 170px;
          height: 127px;
        }
        img::before {
          content: '';
          width: 170px;
          height: 127px;
        }
      }
      &-disc {
        word-wrap: break-word;
        flex: 2;
        height: 36px;
        font-size: 13px;
        color: #444f5a;
        margin: auto 30px;
      }
    }
    &-list {
      display: flex;
      flex: 2;
      flex-direction: column;
      flex-wrap: wrap;
      margin: 0 8px;
      padding: 6px 8px;
      height: 150px;
      &-item {
        min-width: 40%;
        padding: 4px 8px;
        overflow: hidden;
        cursor: pointer;
        height: 33%;
        &-title {
          font-size: 13px;
          color: #000;
          margin-bottom: 4px;
        }
        &-disc {
          font-size: 12px;
          color: #666;
        }
        &:hover {
          background: #f3f3f3;
        }
      }
    }
  }
}
// hack 新手指导定位改成绝对定位
.menu-guide {
  position: absolute;
}
.el-dropdown-menu__item:not(.is-disabled):hover,
.el-dropdown-menu__item:hover {
  color: #333;
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
