<template>
  <div id="app" v-loading.fullscreen.lock="isLoading">
    <div class="header-nav">
      <el-row type="flex" justify="center" align="middle">
        <el-col :span="18">
          <el-row type="flex" justify="space-between">
            <el-col :span="4">
              <a class="logo-link" href="#/" alt="首页" title="首页"><img class="logo-img" src="/static/logo.png" alt="首页"></a>
            </el-col>
            <el-col :span="4">
              <el-dropdown v-if="isLogin" class="settings" @command="handleCommand">
                <span class="el-dropdown-link">
                                  <img :src="'/api/public/'+user.username+'.png'" alt="设置" class="settings-img">
                                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">个人设置</el-dropdown-item>
                  <el-dropdown-item command="b">注销登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="个人设置" class="setting-dialog" size="tiny" v-model="showSettings">
      <el-form :model="userModify" :rules="userModifyRule" @keyup.enter.native="submitForm('userModify')" ref="userModify" class="user-modify">
        <el-form-item></el-form-item>
        <el-form-item prop="email">
          <el-input type="text" v-model="userModify.email" disabled auto-complete="off" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input type="text" v-model="userModify.username" disabled auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input type="text" v-model="userModify.nickname" auto-complete="off" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="userModify.password" auto-complete="off" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item prop="passwordCheck">
          <el-input type="password" v-model="userModify.passwordCheck" auto-complete="off" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item style="text-align: center">
          <el-button @click="showSettings=false">取消</el-button>
          <el-button type="primary" @click="submitForm('userModify')">修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created() {
    let isLogin = localStorage.getItem('isLogin'), user, token = localStorage.getItem('token')
    if (isLogin === 'true') {
      user = JSON.parse(localStorage.getItem('user'))
      this.$store.dispatch('setLogin', true)
      this.$store.dispatch('setUser', user)
      this.$store.dispatch('setToken', token)
    }
  },
  data() {
    const validatePasswordCheck = (rule, value, callback) => {
      if (value === '' && this.userModify.password !== '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.userModify.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }
    return {
      showSettings: false,
      modifyLoading: false,
      userModify: {
        email: '',
        username: '',
        nickname: '',
        password: ''
      },
      userModifyRule: {
        email: [
          { required: true, type: 'email', trigger: 'blur', message: '请输入常用的邮箱地址' }
        ],
        username: [
          { required: true, min: 4, max: 10, trigger: 'blur', message: '请输入用户名 (不可修改)' }
        ],
        nickname: [
          { required: true, min: 4, max: 18, trigger: 'blur', message: '请输入昵称' }
        ],
        password: [
          { required: true, min: 8, max: 18, trigger: 'blur', message: '密码长度在4-18位之间' }
        ],
        passwordCheck: [
          { validator: validatePasswordCheck, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
    isLogin() {
      return this.$store.state.isLogin
    },
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    logout() {
      this.$confirm('即将注销登录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('setUser', null)
        this.$store.dispatch('setLogin', false)
        this.$store.dispatch('setToken', null)
        this.$message({
          type: 'success',
          message: '注销成功!'
        })
        this.$router.replace('/login')
      }).catch(() => { })
    },
    handleCommand(cmd) { //下拉菜单
      if (cmd === 'a') {
        console.log('show dialog')
        this.showSettings = true
        Object.assign(this.userModify, this.user)
      }
      if (cmd === 'b') {
        this.logout()
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.modifyLoading = true
          this.$axios.put('/api/users', {
            user: {
              nickname: this.userModify.nickname,
              password: this.userModify.password
            }
          }).then(res => {
            if (res.status === 200) {
              let that = this
              this.$message('修改成功')
              this.modifyLoading = false
              this.userModify = false
            }
          }).catch(err => {
            console.log(err)
            this.$message('网络错误')
          })
        } else {
          return false;
        }
      })
    }
  }

}
</script>

<style lang="scss">
* {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
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

  .setting-dialog {}

  .user-modify {
    width: 370px;
    height: 400px;
  }

  .header-nav {
    position: relative;
    height: 50px;
    background: #fff;
    border-radius: 0 0 5px 5px;
    box-shadow: 2px 2px 4px rgba(100, 100, 100, 0.3);
    z-index: 999;

    .logo-link {
      display: block;
      height: 50px;
      .logo-img {
        display: block;
        height: 40px;
        position: relative;
        top: 5px;
      }
    }

    .settings {
      position: relative;
      top: 5px;
      left: 130px;

      .settings-img {
        display: block;
        height: 40px;
        border-radius: 50%;
      }
    }
  }
}
</style>
