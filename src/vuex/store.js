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
	token: ''
}

const mutations = {
	SET_USER(state, user) {
		state.user = user
	},
	SET_ISLOGIN(state, isLogin) {
		state.isLogin = isLogin
	}, //设置登录状态
	SET_TOKEN(state, token) {
		state.token= token
	},
	INIT_MESSAGE_LIST(state, contactUserID) {
		if (typeof state.messageList[parseInt(contactUserID)] == 'undefined') {
			state.messageList[parseInt(contactUserID)] = new Array()
			console.log(state.messageList[parseInt(contactUserID)])
		}
	},
	UPDATE_MESSAGE_LIST(state, msgData) {
		let tempMsgList = state.messageList
		state.messageList = null //不置空无法触发computed
		if (msgData.msgType === 1) {
			if (typeof tempMsgList[parseInt(msgData.targetID)] == 'undefined') {
				tempMsgList[parseInt(msgData.targetID)] = new Array()
			}
			tempMsgList[parseInt(msgData.targetID)].push(msgData)
		} else if (msgData.msgType === 2) {
			if (typeof tempMsgList[parseInt(msgData.sourceID)] == 'undefined') {
				tempMsgList[parseInt(msgData.sourceID)] = new Array()
			}
			tempMsgList[parseInt(msgData.sourceID)].push(msgData)
		}
		state.messageList = tempMsgList
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
		localStorage.setItem('token',token)
	},
	updateMessageList: function ({
		commit
	}, msgData) {
		commit('UPDATE_MESSAGE_LIST', msgData)
	},
	updateCurrentContact: function ({
		commit
	}, contactInfo) {
		commit('UPDATE_CURRENT_CONTACT', contactInfo)
	}
}

export default new Vuex.Store({
	state,
	mutations,
	actions
})