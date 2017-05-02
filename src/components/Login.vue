<template>
	<el-row type="flex" class="login-container" justify="space-around" align="middle">
		<el-col :span="6">
			<el-row type="flex" justify="space-around">
				<el-col :span="12">
					<img src="../assets/image/Logo.png" width="100%" alt="">
				</el-col>
			</el-row>
			<el-form :model="userLogin" :rules="userLoginRule" @keyup.enter.native="submitForm('userLogin')" ref="userLogin" class="user-login">
				<el-form-item></el-form-item>
				<el-form-item prop="email">
					<el-input type="text" v-model="userLogin.email" auto-complete="on" placeholder="邮箱"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" v-model="userLogin.password" auto-complete="on" placeholder="密码"></el-input>
				</el-form-item>
				<el-form-item></el-form-item>
				<el-form-item style="text-align: center">
					<el-button type="text" class="register" @click="$router.push('/register')">注册</el-button>
					<el-button type="primary" @click="submitForm('userLogin')">登录</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
</template>

<script>
export default {
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
					this.$axios.post('/api/auth', {
						email: this.userLogin.email,
						password: this.userLogin.password
					}).then(res => {
						if (res.status === 200) {
							this.$message('登录成功')
							this.loginSuccess(res.data)
						}
					}).catch(err => {
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
	position: absolute;
	top: 60px;
	left: 0;
	right: 0;
	bottom: 0;
}

.user-login {
	height: 200px;

	.register {}
}
</style>