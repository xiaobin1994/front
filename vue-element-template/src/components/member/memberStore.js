import httpApi from "../../util/js/http";
import {message, success} from "../../plugin/resetMessage";


export default {
  state: {
    memberInfo: localStorage.getItem('memberInfo') ? JSON.parse(localStorage.getItem('memberInfo')) : null,
    isLogin: localStorage.getItem('isLogin') ? JSON.parse(localStorage.getItem('isLogin')) : null,
    token: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : null,
  },
  mutations: {
    setMemberInfo(state, memberInfo) {
      state.memberInfo = memberInfo || JSON.parse(localStorage.getItem('memberInfo'))
    },
    setToken(state, token) {
      state.token = token || JSON.parse(localStorage.getItem('accessToken'))
    },
    setIsLogin(state, token) {
      state.isLogin = token || JSON.parse(localStorage.getItem('isLogin'))
    },
    reset(state) {
      state.memberInfo = null;
      state.isLogin = false;
      state.token = null;

      localStorage.clear()
    },
  },
  actions: {
    getMemberInfoByCredentialNo({
      dispatch,
      commit,
      state
    }, param) {
      httpApi
        .get(param.url, param.data, false, null, true)
        .then(res => {
          if (res.data) {
            if (res.data.code === 200) {
              if (param.success && typeof param.success === 'function') {
                param.success();
              }
            } else {
              message.error({
                duration: 1500,
                showClose: true,
                message: res.data.msg,
              });
            }
          } else {
            message.error({
              duration: 1500,
              showClose: true,
              message: '服务器异常',
            });
          }
        })
        .catch(err => {
          console.error('getMemberInfoByCredentialNo', err)
          if (err.message || err.response.data.error_msg) {
            message.error({
              duration: 1500,
              showClose: true,
              message: '获取个人信息失败',
            });
          }
        })
    },
    getVerifyCode({
      dispatch,
      commit,
      state
    }, param) {
      httpApi
        .get(param.url, param.data, false, null, true)
        .then(res => {
          if (res.data) {
            if (res.data.code === 200) {
              if (param.success && typeof param.success === 'function') {
                param.success();
              }
            } else {
              message.error({
                duration: 1500,
                showClose: true,
                message: res.data.msg,
              });
            }
          } else {
            message.error({
              duration: 1500,
              showClose: true,
              message: '服务器异常',
            });
          }
        })
        .catch(err => {
          console.error('getVerifyCode', err)
          if (err.message || err.response.data.error_msg) {
            message.error({
              duration: 1500,
              showClose: true,
              message: '获取验证码失败',
            });
          }
        })
    },
    doLogin({
      dispatch,
      commit,
      state
    }, param) {
      httpApi
        .get(param.url, param.data, false, null, true)
        .then(res => {
          if (res.data) {
            if (res.data.code === 200) {
              let memberInfo = res.data.data.memberInfo;
              let accessToken = res.data.data.token;
              commit('reset')
              localStorage.setItem('memberInfo', JSON.stringify(memberInfo))
              localStorage.setItem('accessToken', accessToken)
              localStorage.setItem('isLogin', true)
              commit('setMemberInfo', memberInfo)
              commit('setToken', accessToken)
              commit('setIsLogin', true)
              if (param.success && typeof param.success === 'function') {
                param.success();
              }
            } else {
              message.error({
                duration: 1500,
                showClose: true,
                message: res.data.msg,
              });
            }
          } else {
            message.error({
              duration: 1500,
              showClose: true,
              message: '服务器异常',
            });
          }
        })
        .catch(err => {
          console.error('doLogin', err)
          if (err.message || err.response.data.error_msg) {
            message.error({
              duration: 1500,
              showClose: true,
              message: '登录失败',
            });
          }
        })
    }
  }
}
