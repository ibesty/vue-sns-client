<template>
	<el-row type="flex" class="rigister-container" justify="space-around" align="middle">
		<el-col :span="6">
			<el-row type="flex" justify="space-around">
				<el-col :span="12">
					<img src="../assets/image/Logo.png" width="100%" alt="">
				</el-col>
			</el-row>
			<el-row type="flex" justify="center" align="middle">
				<el-col :span="18">
					<el-form :model="userRegister" :rules="userRegisterRule" @keyup.enter.native="submitForm('userRegister')" ref="userRegister" class="user-login">
						<el-form-item></el-form-item>
						<el-form-item prop="email">
							<el-input type="text" v-model="userRegister.email" auto-complete="off" placeholder="邮箱"></el-input>
						</el-form-item>
						<el-form-item prop="username">
							<el-input type="text" v-model="userRegister.username" auto-complete="off" placeholder="用户名"></el-input>
						</el-form-item>
						<el-form-item prop="nickname">
							<el-input type="text" v-model="userRegister.nickname" auto-complete="off" placeholder="昵称"></el-input>
						</el-form-item>
						<el-form-item prop="password">
							<el-input type="password" v-model="userRegister.password" auto-complete="off" placeholder="密码"></el-input>
						</el-form-item>
						<el-form-item prop="passwordCheck">
							<el-input type="password" v-model="userRegister.passwordCheck" auto-complete="off" placeholder="确认密码"></el-input>
						</el-form-item>
						<el-form-item style="text-align: center">
							<el-button type="primary" @click="submitForm('userRegister')">注册</el-button>
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
		if (!!this.$store.state.isLogin) {
			this.$message('您已登录')
			this.$router.replace('/') //如果已登录，跳转到Timeline
		}
		document.title = '注册 | Lucien'
	},
	data() {
		const validatePasswordCheck = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请再次输入密码'));
			} else if (value !== this.userRegister.password) {
				callback(new Error('两次输入密码不一致!'));
			} else {
				callback();
			}
		}
		return {
			userRegister: {
				email: '',
				username: '',
				nickname: '',
				password: '',
				passwordCheck: ''
			},
			userRegisterRule: {
				email: [
					{ required: true, type: 'email', trigger: 'blur', message: '请输入常用的邮箱地址' }
				],
				username: [
					{ required: true, min: 4, max: 10, trigger: 'blur', message: '请输入用户名 (不可修改)' }
				],
				nickname: [
					{ required: true, min: 4, max: 18, trigger: 'blur', message: '请输入昵称 (可修改)' }
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
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$axios.post('/api/users', {
						user: {
							email: this.userRegister.email,
							username: this.userRegister.username,
							nickname: this.userRegister.nickname,
							password: this.userRegister.password
						}
					}).then(res => {
						if (res.status === 200) {
							let that = this
							this.$message('注册成功')
							setTimeout(function () {
								that.$message('跳转到登录界面')
								that.$router.replace('/login')
							}, 1000)

						}
					}).catch(err => {
						console.log(err)
						this.$message('用户名或邮箱已存在')
					})
				} else {
					return false;
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.rigister-container {
	height: calc(100vh - 50px)
}
</style>