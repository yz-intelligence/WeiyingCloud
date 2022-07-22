import { debounce } from 'lodash'
export default {
  data() {
    return {
      loading: false,
      pageSizes: [10, 20, 50, 100],
      tableHeight: 400,
      customTableRef: 'table', // 可以自定义元素作为tableTop
      table: {
        rows: [],
        total: 0
      },
      search: {
        page: 1, // 当前页
        limit: 10 // 每页数量
      },
      routerName: ''
    }
  },
  created() {
    this.routerName = this.$route.name
    this.search.limit = Number(localStorage.getItem(`${this.routerName}limit`)) || 10
  },
  mounted() {
    this.resetTableHeight()
    window.addEventListener('resize', this.resetTableHeight)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resetTableHeight)
  },
  methods: {
    /**
     * 每页显示数量切换
     * @param {number} size 页数
     */
    handleSizeChange(size) {
      this.search.limit = size
      this.search.page = 1
      this.getData(1)
      localStorage.setItem(`${this.routerName}limit`, size)
    },
    /**
     * 页码切换
     * @param {number} current 页码切换
     */
    handleCurrentChange(current) {
      if (this.$refs.table) {
        this.$refs.table.bodyWrapper.scrollTop = 0
      }
      this.search.page = current
      this.getData()
    },
    /**
     * 重新设置表格高度
     * @param {string} extraHeight 额外高度
     */
    resetTableHeight: debounce(function () {
      {
        this.$nextTick(() => {
          // 获取表格dom距离视口顶部的距离
          const tableTop = this.$refs[this.customTableRef]?.$el.getBoundingClientRect().top
          // 获取页面视口高度
          if (tableTop) {
            const pageHeight = document.documentElement.clientHeight || document.body.clientHeight
            // 表格高度 = 页面视口高度 - 表格距离顶部高度 - 分页器高度 - 底部margin
            this.tableHeight = tableTop ? pageHeight - tableTop - 64 - 25 : 400
          }
        })
      }
    }, 200)
  }
}
