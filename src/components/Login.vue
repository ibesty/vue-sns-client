<template>
	<el-row type="flex" class="login-container" justify="center" align="middle">
		<el-col :span="6">
			<el-row type="flex" justify="space-around">
				<el-col :span="12">
					<img src="../assets/image/Logo.png" width="100%" alt="">
				</el-col>
			</el-row>
			<el-row type="flex" justify="center" align="middle">
				<el-col :span="18">
					<el-form :model="userLogin" :rules="userLoginRule" @keyup.enter.native="submitForm('userLogin')" ref="userLogin" class="user-login">
						<el-form-item></el-form-item>
						<el-form-item prop="email">
							<el-input type="text" v-model="userLogin.email" auto-complete="on" placeholder="邮箱"></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input type="password" v-model="userLogin.password" auto-complete="on" placeholder="密码"></el-input>
						</el-form-item>
						<el-form-item style="text-align: center">
							<el-button type="text" class="register" @click="$router.push('/register')">注册</el-button>
							<el-button type="primary" @click="submitForm('userLogin')">登录</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-col>
	</el-row>
</template>

<script>
export default {
	mounted() {
		if (this.$store.state.isLogin) {
			this.$message('您已登录')
			this.$router.replace('/') //如果已登录，跳转到Timeline
		}
		document.title = '登录 | Lucien'
	},
	data() {
		return {
			userLogin: {
				email: '',
				password: ''
			},
			userLoginRule: {
				email: [
					{ required: true, type: 'email', trigger: 'blur', message: '请输入常用的邮箱地址' }
				],
				password: [
					{ required: true, min: 8, max: 18, trigger: 'blur', message: '密码长度在8-18位之间' }
				]
			}
		}
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$store.dispatch('setLoading', true)
					this.$axios.post('/api/auth', {
						email: this.userLogin.email,
						password: this.userLogin.password
					}).then(res => {
						if (res.status === 200) {
							this.$store.dispatch('setLoading', false)
							this.$message('登录成功')
							this.loginSuccess(res.data)
						}
					}).catch(err => {
						this.$store.dispatch('setLoading', false)
						this.loginFailure()
						console.log(err)
						this.$message('邮箱或密码错误')
					})
				} else {
					return false;
				}
			})
		},
		loginSuccess(data) {
			let user = {
				email: data.user.email,
				username: data.user.username,
				nickname: data.user.nickname
			}
			this.$store.dispatch('setUser', user)
			this.$store.dispatch('setLogin', true)

			this.$store.dispatch('setToken', data.token)
			this.$router.push('/')
		},
		loginFailure() {
			let user = {
				email: '',
				username: '',
				nickname: ''
			}
			this.$store.dispatch('setUser', user)
			this.$store.dispatch('setLogin', false)
			this.$store.dispatch('setToken', null)
		}
	}
}
</script>

<style lang="scss" scoped>
.login-container {
	height: calc(100vh - 50px);
}

.user-login {
	height: 200px;

	.register {}
}
</style>