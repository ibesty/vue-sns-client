<template>
	<el-row type="flex" justify="center" class="row-bg clearfix">
		<el-col :span="18" class="timeline-container">
			<el-col :span="7" class="user-info">
				<div class="profile-card">
					<a href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: user.username}})" class="profile-card-bg"></a>
					<div class="profile-card-content">
						<a class="profile-card-avatar-link" href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: user.username}})" title="Lucien Town">
							<img class="profile-card-avatar-image" :src="'/api/public/'+ user.username+ '.png'" alt="">
						</a>
						<div class="profile-card-userinfo">
							<div class="profile-card-nickname">
								<a href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: user.username}})" class="nickname">{{user.nickname}}</a>
							</div>
							<span class="profile-card-username">
									<a href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: user.username}})" class="username"><b>@{{user.username}}</b></a>
								</span>
							<el-button :plain="true" type="danger" v-if="isFollowing === '正在关注'" @click="defollow" class="is-following">{{isFollowing}}</el-button>
							<el-button type="primary" v-if="isFollowing === '关注'" @click="" class="is-following">{{isFollowing}}</el-button>
						</div>
						<div class="profile-card-stats">
							<ul class="profile-card-stat-list">
								<li class="stat-list-item">
									<a href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: user.username}})" class="stat-list-item-link">
										<span class="stat-label">推文</span>
										<span class="stat-value">{{streamCount}}</span>
									</a>
								</li>
								<li class="stat-list-item">
									<a href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: user.username}})" class="stat-list-item-link">
										<span class="stat-label">正在关注</span>
										<span class="stat-value">{{userRelation.following.length}}</span>
									</a>
								</li>
								<li class="stat-list-item">
									<a href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: user.username}})" class="stat-list-item-link">
										<span class="stat-label">关注者</span>
										<span class="stat-value">{{userRelation.follower.length}}</span>
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
	
			</el-col>
			<el-col :span="17" class="timeline clearfix">
				<div class="timeline-main clearfix">
					<div class="timeline-stream clearfix">
						<ol class="stream">
							<li class="stream-item" v-for="item in streamPosts">
								<div class="item-container">
									<div class="content">
										<div class="stream-item-header">
											<a href="javascript:void(0)" @click="$router.push({name: 'Personal', params: { username: item.username}})" class="user-group clearfix">
												<img :src="'/api/public/'+item.username+'.png'" alt="" class="avatar">
												<span class="nickname"><strong>{{item.nickname}}</strong></span>
												<span>&nbsp</span>
												<span class="username">@<b>{{item.username}}</b></span>
											</a>
											<small class="time">
																						{{new Date(item.creationDate).toLocaleDateString('zh-CN',{ month: "short",day: "numeric" })}} 
																						{{new Date(item.creationDate).toLocaleTimeString('zh-CN',{ hour12: false,hour: "numeric",minute: "2-digit"})}}
																			</small>
											<el-button class="delete-btn" @click="deletePost(item._id)" v-if="item.username===user.username" type="text" size="mini">
												删除
											</el-button>
										</div>
										<div class="item-text-container">
											<p class="post-text">{{item.content}}</p>
										</div>
										<div class="stream-item-footer">
											<span class="repost-btn"><i class="el-icon-d-arrow-left"></i> {{item.repostsCount}}</span>
											<span class="comment-btn"><i class="el-icon-message"></i> {{item.commentsCount}}</span>
										</div>
									</div>
								</div>
							</li>
						</ol>
					</div>
				</div>
				<el-row type="flex" justify="center" align="bottom">
					<el-pagination class="pagination" :pageSize="10" :currentPage="currentPage" @current-change="fetchTimeline" layout="prev, pager, next" :total="streamCount">
					</el-pagination>
				</el-row>
			</el-col>
		</el-col>
	</el-row>
</template>

<script>
export default {
	created() {
		if (this.$store.state.isLogin === false && this.$route.name !== 'Login') {
			this.$message('未登录，跳转至登录页面...')
			this.$router.replace('/login')
		}
		document.title = this.$route.params.username + ' | Lucien'
		this.fetchTimeline()
		this.fetchUserinfo()
	},
	data() {
		return {
			postContent: '',
			streamPosts: [],
			streamCount: 0,
			currentPage: 1,
			userinfo: {
				username: '',
				nickname: ''
			},
			userRelation: {
				following: [],
				follower: []
			},
			actionLoading: false
		}
	},
	methods: {
		fetchTimeline(val = 1) {
			this.currentPage = val
			this.$store.dispatch('setLoading', true)
			this.$axios.get('/api/posts/' + this.$route.params.username + '?page=' + this.currentPage, { headers: { 'Authorization': this.token } }).then(res => {
				//console.log(res.data.post)
				this.streamPosts = res.data.post
				this.streamCount = res.data.postCount
				this.$store.dispatch('setLoading', false)
				// console.log(res.data)
			}).catch(err => {
			})
		},
		fetchUserinfo() {
			this.$axios.get('/api/users/' + this.$route.params.username, { headers: { 'Authorization': this.token } }).then(res => {
				this.userinfo = res.data.user
			})
			this.$axios.get('/api/user-relations/' + this.$route.params.username).then(res => {
				this.userRelation = res.data.userRelation
				console.log(res.data.userRelation.follower[0].username)
			})
		},
		deletePost(id) {
			this.$confirm('将删除此条推文, 是否继续？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.$axios.delete('/api/posts/' + id, { headers: { 'Authorization': this.token } }).then(res => {
					this.$message({
						type: 'success',
						message: '删除成功!'
					})
					this.fetchTimeline()
				}).catch(err => {
					this.$message({
						type: 'info',
						message: '网络错误'
					})
				})
			}).catch(() => { })

		}
	},
	computed: {
		token() {
			return 'Bearer '.concat(this.$store.state.token)
		},
		user() {
			return this.$store.state.user
		},
		actionDisable() {
			return this.postContent.length <= 0 || this.postContent.length > 140
		},
		isFollowing() {
			if (this.userinfo.username === this.user.username) {
				return false
			}
			if (this.userRelation.follower.some(ele => { return ele.username === this.user.username })) {
				return '正在关注'
			}
			return '关注'
		}
	}
}

</script>

<style lang="scss" scoped>
.row-bg {
	position: relative;
	overflow: hidden;
	background: #f5f8fa;
	min-height: calc(100vh - 60px);


	.timeline-container {
		padding: 10px 0;



		.user-info {
			height: 100%;
			padding-right: 8px;

			.profile-card {
				height: 200px;
				border-radius: 5px;
				overflow: hidden;
				border: 1px solid #e6ecf0;
				position: relative;

				.profile-card-bg {
					background: #ABB8C2 !important;
					background-size: 100%;
					background-position: 0 50%;
					border-bottom: 1px solid #e6ecf0;
					border-radius: 4px 4px 0 0;
					height: 95px;
					width: 100%;
					padding: 0 1px;
					margin-left: -1px;
					margin-top: -1px;
					display: block;
				}

				.profile-card-content {
					background: #fff;


					.profile-card-avatar-link {
						background: #fff;
						border-radius: 6px;
						margin: -30px 0 0 8px;
						padding: 1px;
						vertical-align: bottom;
						display: inline-block;
						max-width: 100%;

						.profile-card-avatar-image {
							border-radius: 7px;
							height: 72px;
							width: 72px;
							border: 2px solid #fff;
						}
					}

					.profile-card-userinfo {
						position: absolute;
						top: 103px;
						left: 90px;
						width: 185px;

						.is-following {
							position: absolute;
							right: 10px;
							top: 0;
						}

						.profile-card-nickname {
							font-weight: 700;
							font-size: 18px;
							line-height: 25px;
							margin: -1px 0 -2px 0;
							max-width: 100%;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							word-wrap: normal;

							.nickname {
								color: #000;
								text-decoration: none;
							}
						}

						.profile-card-username {
							display: inline-block!important;
							max-width: 100%;
							text-align: left;

							.username {
								font-size: 12px;
								padding-right: 5px;
								color: #66757f;
								text-decoration: none;

								b {
									font-weight: normal;
									font-size: 14px;
								}
							}
						}
					}

					.profile-card-stats {
						margin-left: 11px;
						padding: 10px 0;

						.profile-card-stat-list {
							display: table;
							min-width: 100%;

							.stat-list-item {
								display: table-cell;
								vertical-align: bottom;

								.stat-list-item-link {
									display: block;
									text-align: center;

									.stat-label {
										display: block;
										color: #657786;
										font-size: 10px;
										letter-spacing: .02em;
										overflow: hidden;
										transition: color .15s ease-in-out;
									}

									.stat-value {
										display: block;
										font-size: 18px;
										font-weight: 500;
										padding-top: 3px;
										transition: color .15s ease-in-out;
										color: #ABB8C2;
									}
								}
							}
						}
					}
				}
			}
		}

		.timeline {
			background: transparent;
			position: relative;
			height: 100%;


			.timeline-main {
				border-radius: 6px;
				height: calc(100% - 36px); // background: #fff;
				.timeline-post-box {
					border-radius: 5px 5px 0 0;
					border: 1px solid #e6ecf0;

					.home-post-box {
						position: relative;
						border-radius: 3px 3px 0 0;
						padding: 10px 12px;
						background: #f6f7f8;

						img {
							position: absolute;
							left: 12px;
							top: 13px;
							width: 48px;
							height: 48px;
							border-radius: 4px;
						}

						.post-form {
							margin-left: 66px;

							.length-count {
								margin-right: 20px;
							}
						}
					}
				}

				.timeline-stream {
					position: relative;
					background: #fff;
					border-left: 1px solid #e6ecf0;
					border-right: 1px solid #e6ecf0;

					.stream {
						position: relative;
						margin-left: 0;

						.stream-item {
							position: relative;
							background: #fff;

							&:hover {
								background: #f5f8fa;
							}

							.item-container {
								border-bottom: 1px solid #e6ecf0;
								cursor: pointer;
								min-height: 51px;
								padding: 9px 12px;

								.content {
									margin-left: 66px;

									.stream-item-header {
										.user-group {
											color: #657786;

											.avatar {
												float: left;
												margin-top: 3px;
												margin-left: -58px;
												width: 48px;
												height: 48px;
												border-radius: 5px;
												border: 0;
											}

											.nickname {
												strong {
													color: #14171a;
													font-size: 14px;
													font-weight: bold;
												}
											}

											.username {
												b {
													font-weight: normal;
												}
											}
										}

										.time {
											color: #657786;

											&:before {
												content: "\00b7 "
											}
										}

										.delete-btn {
											margin-left: 10px;
										}
									}

									.item-text-container {
										margin: 5px 0;
										.post-text {
											white-space: pre-wrap;
											word-wrap: break-word;
											font-size: 14px;
											line-height: 20px;
										}
									}

									.stream-item-footer {
										margin-top: 5px;
										.comment-btn {
											margin-left: 20px;
										}
									}
								}
							}
						}
					}
				}
			}
			.pagination {
				padding-top: 5px;
			}
		}
	}
}
</style>