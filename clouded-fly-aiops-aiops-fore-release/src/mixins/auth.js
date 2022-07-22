import FormTitle from '../views/auth/components/form-title.vue'
export default {
  components: {
    FormTitle
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    /**
     * 切换路由，以切换表单
     * @param { string } routeName 路由name
     */
    changeForm(routeName = 'Login') {
      this.$router.push({ name: routeName })
    }
  }
}
