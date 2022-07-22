<template>
  <div class="access-cardlist" v-loading="loading">
    <el-card v-for="item in toolList" :key="item.id" shadow="hover" class="access-card">
      <div class="card-content" :id="'access_div_select' + item.type" @click="selectType(item.type)">
        <div class="card-left">
          <img v-if="item.iconUrl" :src="getLocalIcon(item.type)" alt="" />
        </div>
        <template v-if="$hasPermission('MonitoringSource-create')">
          <el-divider direction="vertical" class="custom-divider"></el-divider>
          <div>
            <i
              class="el-icon-plus card-addicon"
              :id="'access_i_add' + item.type"
              @click="showConfig(item.type, item.title, item.subPath)"
            ></i>
          </div>
        </template>
      </div>
    </el-card>
    <!-- 占位元素，根据最长列数生成，填充flex-wrap布局 -->
    <i v-for="item in toolList" :key="item.index"></i>
  </div>
</template>
<script>
export default {
  name: 'AccessCardList',
  data() {
    return {
      loading: false,
      toolList: []
    }
  },
  created() {
    this.getAccessList()
  },
  methods: {
    async getAccessList() {
      this.loading = true
      const data = await this.$store.dispatch('dictionary/getMonitorSource')
      this.loading = false
      if (Array.isArray(data)) {
        this.toolList = data
        this.sendAccessList(this.toolList)
      }
    },
    showConfig(type, title, path) {
      this.$router.push(`accessdetail?type=${type}&title=${title}&subPath=${path}`)
    },
    //当前选择监控源类型通讯
    selectType(type) {
      this.$emit('selectType', type)
    },
    //当前监控源type<=>title对应表通讯
    sendAccessList(list) {
      this.$emit('sendAccessList', list)
    },
    getLocalIcon(type) {
      try {
        return require(`@/assets/images/access/logos/${type}.png`)
      } catch (error) {
        console.log('图标获取失败', error)
        return require('@/assets/images/access/logos/default.png')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-divider {
  width: 2px;
  transform: scaleX(0.5);
}
.access-card {
  margin-bottom: 20px;
  width: 244px;
}
.access-cardlist {
  padding: 24px 0 4px 0;
  display: flex;
  min-height: 150px;
  justify-content: space-evenly;
  flex-wrap: wrap;
  .card-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
    .card-left {
      width: 140px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      img {
        max-width: 135px;
        height: 48px;
      }
    }
    .el-divider {
      height: 60px;
      margin: 0 20px;
    }
    .card-addicon {
      font-size: 25px;
      color: #0076ff;
      transition: all ease 0.3s;
      &:hover {
        transform: scale(1.2);
      }
    }
  }
}
//占位元素设定宽度填充最后一行，高度为0
.access-cardlist > i {
  width: 244px;
}
</style>
