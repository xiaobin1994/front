import httpApi from "../../util/js/http";
import {message, success} from "../../plugin/resetMessage";


export default {
  state: {
  },
  mutations: {
  },
  actions: {
    appointmentSave({
      dispatch,
      commit,
      state
    }, param) {
      httpApi
        .post(param.url, param.data, false, null, true)
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
            console.error('接口请求异常，没有对应的返回信息')
            message.error({
              duration: 1500,
              showClose: true,
              message: '服务器异常',
            });
          }
        })
        .catch(err => {
          console.error('appointmentSave', err)
          if (err.message || err.response.data.error_msg) {
            message.error({
              duration: 1500,
              showClose: true,
              message: '体检预约提交失败',
            });
          }
        })
    },
    findScheduleList({
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
                param.success(res.data.data);
              }
            } else {
              message.error({
                duration: 1500,
                showClose: true,
                message: res.data.msg,
              });
            }
          } else {
            console.error('接口请求异常，没有对应的返回信息')
            message.error({
              duration: 1500,
              showClose: true,
              message: '服务器异常',
            });
          }
        })
        .catch(err => {
          console.error('findScheduleList', err)
          if (err.message || err.response.data.error_msg) {
            message.error({
              duration: 1500,
              showClose: true,
              message: '获取体检预约时间段失败',
            });
          }
        })
    }
  }
}
