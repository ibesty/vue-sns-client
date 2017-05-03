<template>
  <div id="app" v-loading.fullscreen.lock="isLoading">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="16">
          <el-menu-item index="1">主页</el-menu-item>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="logout()" v-if="isLogin">注销登录</el-button>
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
    let isLogin = localStorage.getItem('isLogin'), user,token=localStorage.getItem('token')
    if (isLogin === 'true') {
      user = JSON.parse(localStorage.getItem('user'))
      this.$store.dispatch('setLogin', true)
      this.$store.dispatch('setUser', user)
      this.$store.dispatch('setToken', token)
    }
  },
  data() {
    return {
      activeIndex: '1',

    }
  },
  computed: {
    isLoading: function () {
      return this.$store.state.isLoading
    },
    isLogin: function(){
      return this.$store.state.isLogin
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    loginRedirect() {

    },
    logout() {
      this.$store.dispatch('setUser', null)
      this.$store.dispatch('setLogin', false)
      this.$store.dispatch('setToken', null)
      this.$message('注销成功')
      this.$router.replace('/login')
    }
  }

}
</script>

<style lang="scss">
* {
  font-family: 'Microsoft Yahei', sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-size: 14px;
  line-height: 18px;
  overflow-y: scroll;
}

ol,
ul {
  list-style: none;
}

a {
  text-decoration: none;
}

a:hover,
a:focus,
a:active {
  color: #ABB8C2;
}

#app {
  margin: 0;
  padding: 0;
}

.nav-container {
  max-width: 1000px;
}
</style>
