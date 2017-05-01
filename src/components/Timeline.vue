<template>
	<el-row type="flex" justify="center" class="row-bg">
		<el-col :span="18" class="timeline-container">
			<el-col :span="6" class="user-info"></el-col>
			<el-col :span="18" class="timeline">
	
			</el-col>
		</el-col>
	</el-row>
</template>

<script>
export default {
	created() {
		if (this.$store.state.isLogin === false && this.$route.name !== 'Login') {
			this.$message('未登录，跳转至登录页面...')
			let that = this
			setTimeout(function () {
				that.$router.push('/login')
			}, 1000)
		}
	},
	data() {
		return {
			activeIndex: '1'
		}
	}
}

</script>

<style lang="scss" scoped>
.row-bg {
	position: absolute;
	top: 60px;
	left: 0;
	right: 0;
	bottom: 0;

	.timeline-container {
		background: #ddd;

		.user-info {
			background: #eee;
			height: 200px;
		}

		.timeline {
			background: #ffa;
			height: 200px;
		}
	}
}
</style>