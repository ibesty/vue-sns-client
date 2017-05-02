import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
	isLogin: false,
	user: {
		email: '',
		username: '',
		nickname: ''
	},
	token: '',
	isLoading: false
}

const mutations = {
	SET_USER(state, user) {
		state.user = user
		localStorage.setItem('user',JSON.stringify(user))
	},
	SET_ISLOGIN(state, isLogin) {
		state.isLogin = isLogin
		localStorage.setItem('isLogin',isLogin)
	}, //设置登录状态
	SET_TOKEN(state, token) {
		state.token= token
		localStorage.setItem('token',token)
	},
	SET_LOADING(state, isLoading) {
		state.isLoading = isLoading
	}
}

const actions = {
	setUser: function ({
		commit
	}, user) {
		commit('SET_USER', user)
	},
	setLogin: function ({
		commit
	}, isLogin) {
		commit('SET_ISLOGIN', isLogin)
	},
	setToken: function ({
		commit
	}, token) {
		commit('SET_TOKEN', token)
	},
	setLoading: function({
		commit
	}, isLoading) {
		commit('SET_LOADING',isLoading)
	}
}

export default new Vuex.Store({
	state,
	mutations,
	actions
})