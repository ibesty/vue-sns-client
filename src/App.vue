<template>
  <div id="app">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-menu-item index="1">主页</el-menu-item>
        </el-col>
      </el-row>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    let isLogin = localStorage.getItem('isLogin'),user
    if (isLogin) {
      user = JSON.parse(localStorage.getItem('user'))
      this.$store.dispatch('setLogin',!!isLogin)
      this.$store.dispatch('setUser', user)
    }
  },
  data() {
    return {
      activeIndex: '1'
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    loginRedirect(){

    }
  }

}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0;
  padding: 0;
}

.nav-container {
  max-width: 1000px;
}
</style>
