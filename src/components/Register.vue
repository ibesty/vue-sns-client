<template>
	<el-row type="flex" class="row-bg" justify="space-around">
		<el-col :span="6">
			<el-form :model="userRegister" :rules="userRegisterRule" ref="userRegister" class="user-login">
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
				<el-form-item>
					<el-button type="primary" @click="submitForm('userRegister')">注册</el-button>
				</el-form-item>
			</el-form>
		</el-col>
	</el-row>
</template>

<script>
export default {
	data() {
		return {
			userRegister: {
				email: '',
				username: '',
				nickname: '',
				password: ''
			},
			userRegisterRule: {
				email: [
					{ required: true, type: 'email', trigger: 'blur', messgae: '请输入常用的邮箱地址' }
				],
				username: [
					{ required: true, min: 4, max: 10, trigger: 'blur', messgae: '请输入常用的邮箱地址' }
				],
				nickname: [
					{ required: true, min: 4, max: 18, trigger: 'blur', messgae: '请输入常用的邮箱地址' }
				],
				password: [
					{ required: true, min: 4, max: 18, trigger: 'blur', messgae: '密码长度在4-18位之间' }
				]
			}
		}
	},
	methods: {
		
	}
}
</script>

<style lang="scss" scoped>

</style>