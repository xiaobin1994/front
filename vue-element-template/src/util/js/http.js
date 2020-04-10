import axios from 'axios'
import * as hostUrl from '@/config/env.js'
import {showLoading, hideLoading} from '@/plugin/loading/loading';


function apiAxiosGet(method, url, params, noAuth, header, isloading = true) {
  let rootUrl = hostUrl.publicApi
  let apiUrl = rootUrl + url
  // console.log("rootUrl, memberApiUrl", rootUrl, memberApiUrl)
  if (isloading) {
    showLoading();
  }
  return new Promise((resolve, reject) => {
    axios.get(apiUrl, {
      headers: mergeHeader(noAuth, header),
      params: params,
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        console.error('请求异常信息：', error)
        reject(error)
      })
  })
}


function apiAxiosPost(method, url, params, noAuth, header, isloading = true) {
  let rootUrl = hostUrl.publicApi
  let apiUrl = rootUrl + url
  // console.log("rootUrl, memberApiUrl", rootUrl, memberApiUrl)
  if (isloading) {
    showLoading();
  }
  return new Promise((resolve, reject) => {
    axios.post(apiUrl, params, {
      headers: mergeHeader(noAuth, header)
    })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        console.error('请求异常信息：', error)
        reject(error)
      })
  })
}


// 接口请求前拦截处理
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
// 接口回应后拦截处理
axios.interceptors.response.use(response => {
  hideLoading();
  return response
}, error => {
  hideLoading();
  //  处理超时
  var str = error + ''
  if (str.search('timeout') !== -1) {   // 超时error捕获
    console.error('请求超时')
  }
  return Promise.resolve(error.response)
})


function mergeHeader(noAuth, headers) {
  let h = {
    'Content-Type': 'application/json;charset=UTF-8',
  }
  return h
}


// 返回在vue模板中的调用接口 noAuth--请求时header是否需要添加token
export default {
  get: function (url, params, noAuth = false, headers = null, isloading) {
    return apiAxiosGet('GET', url, params, noAuth, headers, isloading)
  },
  post: function (url, params, noAuth = false, headers = null, isloading) {
    return apiAxiosPost('POST', url, params, noAuth, headers, isloading)
  },
  // ...
}
